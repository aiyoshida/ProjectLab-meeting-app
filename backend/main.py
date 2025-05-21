from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from backend.models import Base
from backend.database import engine
from backend.database import SessionLocal
from fastapi import Depends
from sqlalchemy.orm import Session
from backend.models import Meeting, Participant, User, Contact, VotedDate, Vote
from typing import List, Optional
from datetime import datetime
from sqlalchemy import func


# implement pydantic for type definition later

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class SlotTime(BaseModel):
    start: datetime
    end: datetime


# POST register
class RegisteredData(BaseModel):
    name: str
    gmail: str
    timezone: str


class NewMeetingData(BaseModel):
    title: str
    timezone: str
    creator_user_id: int
    invitees: List[int]
    slots: List[SlotTime]
    url: Optional[str] = None


class VoteData(BaseModel):
    user_id: int
    slots: List[int]


# for GET register
class RegsiteredUser(BaseModel):
    gmail: str


Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# for PUT /setting/{user_id}
class UserUpdate(BaseModel):
    id: int
    username: str
    timezone: str


# GET /setting/{user_id}
@app.get("/setting/{userId}")
async def get_user_data(userId: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == userId).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "username": user.username,
        "timezone": user.timezone,
        "gmail": user.gmail,
    }


# PUT /setting/{user_id}
@app.put("/setting/{userId}")
async def update_user(
    userId: int, user_data: UserUpdate, db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == userId).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.username = user_data.username
    user.timezone = user_data.timezone
    db.commit()
    db.refresh(user)

    return {
        "message": "Success!",
        "data": {
            "id": user.id,
            "username": user.username,
            "timezone": user.timezone,
            "gmail": user.gmail,
        },
    }


# POST /register/login
@app.post("/register/login")
async def login_user(req: RegsiteredUser, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.gmail == req.gmail).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"userId": user.id}


# POST /register
@app.post("/register")
async def register_user(req: RegisteredData, db: Session = Depends(get_db)):
    new_user = User(username=req.name, gmail=req.gmail, timezone=req.timezone)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    # return auto created userId
    return {"userId": new_user.id}


# http://localhost:3000/contact
# GET /contact/{userId}
@app.get("/contact/{userId}")
async def get_contactlist(userId: int, db: Session = Depends(get_db)):
    contacts = db.query(Contact).filter(Contact.friend_of_this_user_id == userId).all()

    if not contacts:
        raise HTTPException(status_code=404, detail="User not found or no contacts")

    result = []
    for c in contacts:
        contact_user = c.actual_user
        result.append(
            {
                "id": c.id,
                "name": contact_user.username,
                "gmail": contact_user.gmail,
                "timezone": contact_user.timezone,
            }
        )

    return {"contacts": result}


# GET /homepage/{userId}
@app.get("/homepage/{userId}")
async def get_meeting_card(userId: int, db: Session = Depends(get_db)):
    participating_meeting = db.query(Participant).filter(Participant.user_id == userId, Participant.meeting_id != None).all()

    result = []
    # ⭐️ working on progress
    for meeting in participating_meeting:
        if not meeting:
            continue 
        participants = (
            db.query(Participant).filter(Participant.meeting_id == meeting.meeting_id).all()
        )
        participant_names = []

        for p in participants:
            user = db.query(User).filter(User.id == p.user_id).first()
            if user:
                participant_names.append(user.username)

        result.append(
            {
                "id": meeting.meeting_id,
                "title": meeting.meeting.title,
                "date": meeting.meeting.created_at.strftime("%Y %b %d"),
                "participants": participant_names,
                "url": meeting.meeting.url,
            }
        )

    return {"cards": result}


# DELETE /homepage/{cardId}
@app.delete("/homepage/{cardId}")
async def delete_card(cardId: int, db: Session = Depends(get_db)):
    meeting = db.query(Meeting).filter(Meeting.id == cardId).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    # to adjust child tables to deleted meeting table
    db.query(VotedDate).filter(VotedDate.meeting_id.is_(None)).delete(
        synchronize_session=False
    )
    db.query(Participant).filter(Participant.meeting_id.is_(None)).delete(
        synchronize_session=False
    )
    db.query(Vote).filter(Vote.meeting_id.is_(None)).delete(
        synchronize_session=False
    )
    db.delete(meeting)
    db.commit()

    return {"message": "Meeting deleted", "id": cardId}


# GET /newmeeting/{userId}
@app.get("/newmeeting/{userId}")
async def get_meetingcontact(userId: int, db: Session = Depends(get_db)):
    contacts = db.query(Contact).filter(Contact.friend_of_this_user_id == userId).all()
    if not contacts:
        raise HTTPException(status_code=404, detail="User not found or no contacts")

    result = [
        {
            "id": c.id,
            "name": c.actual_user.username,
            "gmail": c.actual_user.gmail,
            "timezone": c.actual_user.timezone,
        }
        for c in contacts
    ]

    return {"contacts": result}


# GET newmeeting/timezone/${useId}
@app.get("newmeeting/timezone/{userId}")
async def get_newmeeting_timezone(userId: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == userId).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    print(user.timezone)
    return {
        "timezone": user.timezone,
    }


#GET /newmeeting/timezone/{userId}
@app.get("/newmeeting/timezone/{userId}")
async def get_meetinglink_timezone(userId: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == userId).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    print(user.timezone)
    return {
        "timezone": user.timezone,
    }


# POST /newmeeting/{userId}
@app.post("/newmeeting/{userId}")
async def create_meeting(data: NewMeetingData, db: Session = Depends(get_db)):
    # Meeting
    meeting = Meeting(
        title=data.title,
        creator_user_id=data.creator_user_id,
        timezone=data.timezone,
        url="",
    )
    db.add(meeting)
    db.commit()
    db.refresh(meeting)
    # to add url with meeting id
    meeting.url = f"{data.url}/{meeting.id}"
    meeting.id = meeting.id
    db.commit()

    creator_participant = Participant(
        meeting_id=meeting.id,
        user_id=data.creator_user_id,
        voted=True,
    )
    db.add(creator_participant)

    #  add Participants
    for contact_id in data.invitees:
        contact = db.query(Contact).filter(Contact.id == contact_id).first()
        if contact:
            participant = Participant(
                meeting_id=meeting.id,
                user_id=contact.user_id,
                voted=False,
            )
            db.add(participant)

    # add VotedDate
    for slot in data.slots:
        voted_date = VotedDate(
            meeting_id=meeting.id, starting_time=slot.start, ending_time=slot.end
        )
        db.add(voted_date)

    db.commit()
    return {"message": "Meeting created", "meeting_id": meeting.id}


# GET /meetinglink/timezone/{userId}
@app.get("/meetinglink/timezone/{userId}")
async def get_meetinglink_timezone(userId: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == userId).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    print(user.timezone)
    return {
        "timezone": user.timezone,
    }


# GET /meetinglink/{meetingId}
@app.get("/meetinglink/{meetingId}")
async def get_meetinglink_contact(meetingId: int, db: Session = Depends(get_db)):
    # participant
    participants = (
        db.query(Participant).filter(Participant.meeting_id == meetingId).all()
    )
    if not participants:
        raise HTTPException(status_code=404, detail="Participants not found")

    contacts = []
    for p in participants:
        user = db.query(User).filter(User.id == p.user_id).first()
        if user:
            contacts.append(
                {
                    "id": user.id,
                    "name": user.username,
                    "gmail": user.gmail,
                    "timezone": user.timezone,
                    "voted": p.voted,
                }
            )

    # slots
    # slots = db.query(VotedDate).filter(VotedDate.meeting_id == meetingId).all()
    slots = (
        db.query(
            VotedDate.id,
            VotedDate.starting_time,
            VotedDate.ending_time,
            func.count(Vote.id).label("vote_count"),
        )
        .outerjoin(Vote, VotedDate.id == Vote.voted_date_id)
        .filter(VotedDate.meeting_id == meetingId)
        .group_by(VotedDate.id, VotedDate.starting_time, VotedDate.ending_time)
        .all()
    )

    available_slots = [
        {
            "id": slot.id,
            "start": slot.starting_time.isoformat(),
            "end": slot.ending_time.isoformat(),
            "vote_count": slot.vote_count,
        }
        for slot in slots
    ]

    return {"contacts": contacts, "available_slots": available_slots}


# POST /meetinglink/{meetingId}/vote
@app.post("/meetinglink/{meetingId}/vote")
async def submit_vote(meetingId: int, data: VoteData, db: Session = Depends(get_db)):
    for voted_date_id in data.slots:
        vote = Vote(
            user_id=data.user_id, voted_date_id=voted_date_id, meeting_id=meetingId
        )
        db.add(vote)

    participant = (
        db.query(Participant)
        .filter_by(user_id=data.user_id, meeting_id=meetingId)
        .first()
    )
    if participant:
        participant.voted = True

    db.commit()
    return {"message": "Vote submitted!"}


# GET newmeetingothers/timezone/${userId}
@app.get("/newmeetingothers/timezone/{userId}")
async def get_getbasetime_timezone(userId: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == userId).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    print(user.timezone)
    return {
        "timezone": user.timezone,
    }