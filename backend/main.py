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
import logging


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# level setting of the log
logging.basicConfig(level=logging.DEBUG)


# pydantic class definitions


class SlotTime(BaseModel):
    start: datetime
    end: datetime


class NewMeetingData(BaseModel):
    title: str
    timezone: str
    creator_user_sub: str
    invitees: List[str]
    slots: List[SlotTime]
    slot_duration: str
    url: Optional[str] = None


class VoteData(BaseModel):
    user_id: str
    slots: List[int]


# for Google login POST
class GoogleLogin(BaseModel):
    name: str
    gmail: str
    pic: str


# for adding/deleting new contact
class ManageContact(BaseModel):
    sub: str


# for create DB when app.db does not exist
Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# for PUT /setting/{user_id}
class UserUpdate(BaseModel):
    username: str
    timezone: str


# ==, !=, like, in_([1,2,3]), and_, or_, first(), all(), count()


# GET /setting/{user_id}
@app.get("/setting/{userId}")
async def get_user_data(userId: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.sub == userId).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "username": user.username,
        "timezone": user.timezone,
        "gmail": user.gmail,
        "picture": user.picture,
    }


# PUT /setting/{user_id}
@app.put("/setting/{userId}")
async def update_user(
    userId: str, user_data: UserUpdate, db: Session = Depends(get_db)
):
    print("received data: ", user_data)
    user = db.query(User).filter(User.sub == userId).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.username = user_data.username
    user.timezone = user_data.timezone
    db.commit()
    db.refresh(user)

    return {
        "message": "Success!",
        "data": {
            "sub": user.sub,
            "username": user.username,
            "timezone": user.timezone,
            "gmail": user.gmail,
        },
    }


# POST /register/login
# first find sub in the DB? yes then, home, no then, add to the DB.
@app.post("/register/{sub}")
async def login_user(sub: str, req: GoogleLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.sub == sub).first()
    if user:
        return user
    if not user:
        new_user = User(
            sub=sub,
            username=req.name,
            gmail=req.gmail,
            timezone="UTC",
            picture=req.pic,
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return new_user
    else:
        raise HTTPException(status_code=404, detail="Error happened")


# http://localhost:3000/contact
# GET /contact/{userId}
@app.get("/contact/{userId}")
async def get_contactlist(userId: str, db: Session = Depends(get_db)):
    contacts = db.query(Contact).filter(Contact.user_sub == userId).all()
    # if not contacts:
    #     return {"contacts": []}

    result = [
            {
                "id": c.id,
                "sub": c.friend_of_this_user_sub,
                "name": c.owner_user.username,
                "gmail": c.owner_user.gmail,
                "timezone": c.owner_user.timezone,
                "picture": c.owner_user.picture
            }
            for c in contacts
        ]

    return {"contacts": result}

# logger = logging.getLogger("uvicorn.error")

# @app.get("/contact/{userId}")
# async def get_contactlist(userId: str, db: Session = Depends(get_db)):
#     logger.info("userId=%r DB=%s", userId, db.bind.url)

#     total = db.query(Contact).count()
#     owners = [c.friend_of_this_user_sub for c in db.query(Contact).all()]
#     hits_owner  = db.query(Contact).filter(Contact.friend_of_this_user_sub == userId).count()
#     hits_friend = db.query(Contact).filter(Contact.user_sub == userId).count()
#     logger.info("Contact total=%s owners=%s hits(owner)=%s hits(friend)=%s",
#                 total, owners, hits_owner, hits_friend)

#     rows = (
#         db.query(Contact, User)
#           .join(User, Contact.user_sub == User.sub)   # 友だち本人をJOIN
#           .filter(Contact.friend_of_this_user_sub == userId)
#           .all()
#     )
#     logger.info("join rows=%s", len(rows))

#     result = [{
#         "id": c.id,
#         "sub": u.sub,
#         "name": u.username,
#         "gmail": u.gmail,
#         "timezone": u.timezone,
#         "picture": u.picture,
#     } for c, u in rows]
#     return {"contacts": result}

# searching contact
# GET /contact/search?gmail={gmail}
@app.get("/contact/search/{gmail}")
async def get_search_contact(gmail: str, db: Session = Depends(get_db)):
    logging.info(
        "gmail is: ",
    )
    contact = db.query(User).filter(User.gmail == gmail).first()
    if not contact:
        return {"sub": None}
    return {
        "sub": contact.sub,
        "username": contact.username,
        "gmail": contact.gmail,
        "timezone": contact.timezone,
        "picture": contact.picture,
    }


# POST /contact/add/{userId}
# automatically rejects same contacts to add. good for this app but why...?
@app.post("/contact/add/{userId}")
async def add_new_contact(
    userId: str, req: ManageContact, db: Session = Depends(get_db)
):
    friend = (
        db.query(Contact)
        .filter(Contact.user_sub == userId, Contact.friend_of_this_user_sub == req.sub)
        .first()
    )

    if friend:
        return {"message": "This contact already exists in your contact"}
    if not friend:
        new_friend = Contact(user_sub=userId, friend_of_this_user_sub=req.sub)
        db.add(new_friend)
        db.commit()
        db.refresh(new_friend)
        return new_friend


# DELETE /contact/delete/{userId}
@app.delete("/contact/delete/{userId}")
async def delete_contact(
    userId: str, req: ManageContact, db: Session = Depends(get_db)
):
    friend = (
        db.query(Contact)
        .filter(Contact.user_sub == userId, Contact.friend_of_this_user_sub == req.sub)
        .first()
    )

    if not friend:
        return {"message": "This contact does not exist"}

    db.delete(friend)
    db.commit()
    return {"message": "Successfully deleted!"}


# Why I implemented this...?
# # POST /contact/add/{userId}
# @app.post("/contact/add/{userId}")
# async def contact_add(meetingId: int, data: VoteData, db: Session = Depends(get_db)):
#     for voted_date_id in data.slots:
#         vote = Vote(
#             user_id=data.user_id, voted_date_id=voted_date_id, meeting_id=meetingId
#         )
#         db.add(vote)

#     participant = (
#         db.query(Participant)
#         .filter_by(user_id=data.user_id, meeting_id=meetingId)
#         .first()
#     )
#     if participant:
#         participant.voted = True

#     db.commit()
#     return {"message": "new contact added!"}


# GET /homepage/{userId}
@app.get("/homepage/{userId}")
async def get_meeting_card(userId: str, db: Session = Depends(get_db)):
    # get list of the meeting that this user participates
    user_in_the_meeting = (
        db.query(Participant)
        .filter(Participant.user_id == userId, Participant.meeting_id != None)
        .all()
    )

    result = []
    # ⭐️ working on progress
    for meeting in user_in_the_meeting:
        participants = (
            db.query(Participant)
            .filter(Participant.meeting_id == meeting.meeting_id)
            .all()
        )

        participant_names = []
        for p in participants:
            user = db.query(User).filter(User.sub == p.user_id).first()
            if user:
                participant_names.append(user.username)

        creator_name = (
            meeting.meeting.creator.username if meeting.meeting.creator else "Unknown"
        )

        result.append(
            {
                "id": meeting.meeting_id,
                "creator": creator_name,
                "slot_duration": meeting.meeting.slot_duration,
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
    db.query(Vote).filter(Vote.meeting_id.is_(None)).delete(synchronize_session=False)
    db.delete(meeting)
    db.commit()

    return {"message": "Meeting deleted", "id": cardId}

# to get contact llist from user to create the new meeting
# GET /newmeeting/{userId}
@app.get("/newmeeting/{userId}")
async def get_meetingcontact(userId: str, db: Session = Depends(get_db)):
    contacts = db.query(Contact).filter(Contact.user_sub == userId).all()
    if not contacts:
        return {"contacts": []}

    result = [
        {
            "id": c.id,
            "sub": c.friend_of_this_user_sub,
            "name": c.owner_user.username,
            "gmail": c.owner_user.gmail,
            "timezone": c.owner_user.timezone,
            "picture": c.owner_user.picture
        }
        for c in contacts
    ]

    return {"contacts": result}

# GET newmeeting/timezone/${useId}
@app.get("/newmeeting/timezone/{userId}")
async def get_newmeeting_timezone(userId: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.sub == userId).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    print("User's timezone is ", user.timezone)
    return {"timezone": user.timezone}


# GET newmeeting/timezone/${useId}
@app.get("/newmeetingother/timezone/{userId}")
async def get_newmeetingother_timezone(userId: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.sub == userId).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    print("User's timezone is ", user.timezone)
    return {"timezone": user.timezone}


# POST /newmeeting/{userId}  create new meeting
@app.post("/newmeeting/{userId}")
async def create_meeting(data: NewMeetingData, db: Session = Depends(get_db)):
    # Meeting
    meeting = Meeting(
        title=data.title,
        creator_user_sub=data.creator_user_sub,
        timezone=data.timezone,
        slot_duration=data.slot_duration,
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
        user_id=data.creator_user_sub,
        voted=True,
    )
    db.add(creator_participant)

    #  add Participants
    for invitee_sub in data.invitees:
        participant = Participant(
                meeting_id=meeting.id,
                user_id=invitee_sub,
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
async def get_meetinglink_timezone(userId: str, db: Session = Depends(get_db)):
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
