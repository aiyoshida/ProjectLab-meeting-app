from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from backend.models import Base
from backend.database import engine
from backend.database import SessionLocal
from fastapi import Depends
from sqlalchemy.orm import Session
from backend.models import Meeting, Participant, User, Contact


# implement pydantic for type definition later

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

mockUserDB = {
    1: {
        "id": 1,
        "username": "Ai Yoshida",
        "timezone": "Asia/Tokyo",
        "gmail": "ai2150sorairo@gmail.com",
    },
    2: {
        "id": 2,
        "username": "Rauf",
        "timezone": "Europe/Budapest",
        "gmail": "ai2150sorairo@gmail.com",
    },
}
mockContactDB = {
    1: {
        "id": 1,
        "userId": 1,
        "name": "Katreen",
        "gmail": "aikawaiyoshida@gmail.com",
        "timezone": "Asia/Tokyo",
    },
    2: {
        "id": 2,
        "userId": 1,
        "name": "Rauf",
        "gmail": "ai.yoshida@edu.bme.hu",
        "timezone": "Asia/Amman",
    },
    3: {
        "id": 3,
        "userId": 1,
        "name": "Tariq",
        "gmail": "example@com",
        "timezone": "Europe/Budapest",
    },
    4: {
        "id": 4,
        "userId": 1,
        "name": "Ramiz",
        "gmail": "example4@com",
        "timezone": "Europe/Budapest",
    },
    5: {
        "id": 5,
        "userId": 3,
        "name": "Ramiz",
        "gmail": "example4@com",
        "timezone": "Europe/Budapest",
    },
}
mockMeetingCardDB = {
    1: {
        "id": 1,
        "user_id": 1,
        "date": "2025 Apr 13th",
        "title": "Regular meeting",
        "creator": "Ai Yoshida",
        "participants": ["Katreen", "Tariq"],
        "url": "www",
    },
    2: {
        "id": 2,
        "user_id": 1,
        "date": "2025 Apr 13th",
        "title": "Regular meeting",
        "creator": "Ai Yoshida",
        "participants": ["Katreen", "Tariq"],
        "url": "www",
    },
    3: {
        "id": 3,
        "user_id": 1,
        "date": "2025 Apr 13th",
        "title": "Regular meeting",
        "creator": "Ai Yoshida",
        "participants": ["Katreen", "Tariq"],
        "url": "www",
    },
}

Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# PUT /setting/{user_id}
class UserUpdate(BaseModel):
    id: int
    username: str
    timezone: str


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


# http://localhost:3000/contact
# GET /contact/{userId}
@app.get("/contact/{userId}")
async def get_contactlist(userId: int, db: Session = Depends(get_db)):
    contacts = db.query(Contact).filter(Contact.user_id == userId).all()
    if not contacts:
        raise HTTPException(status_code=404, detail="User not found")

    result = [
        {
            "id": c.id,
            "name": c.name,
            "gmail": c.gmail,
            "timezone": c.timezone,
        }
        for c in contacts
    ]

    return {"contacts": result}


# GET /homepage/{userId}
@app.get("/homepage/{userId}")
async def get_meeting_card(userId: int, db: Session = Depends(get_db)):
    meetings = db.query(Meeting).filter(Meeting.creator_user_id == userId).all()

    result = []
    for meeting in meetings:
        participants = (
            db.query(Participant).filter(Participant.meeting_id == meeting.id).all()
        )
        participant_names = []

        for p in participants:
            contact = db.query(Contact).filter(Contact.id == p.contact_id).first()
            if contact:
                participant_names.append(contact.name)

        result.append(
            {
                "id": meeting.id,
                "title": meeting.title,
                "date": meeting.created_at.strftime("%Y %b %d"),
                "participants": participant_names,
                "url": meeting.url,
            }
        )

    return {"cards": result}


# DELETE /homepage/{cardId}
@app.delete("/homepage/{cardId}")
async def delete_card(cardId: int, db: Session = Depends(get_db)):
    meeting = db.query(Meeting).filter(Meeting.id == cardId).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    db.delete(meeting)
    db.commit()

    return {"message": "Meeting deleted", "id": cardId}


# GET /newmeeting/{userId}
@app.get("/newmeeting/{userId}")
async def get_meetingcontact(userId: int, db: Session = Depends(get_db)):
    contacts = db.query(Contact).filter(Contact.user_id == userId).all()
    if not contacts:
        raise HTTPException(status_code=404, detail="User not found")

    result = [
        {
            "id": c.id,
            "name": c.name,
            "gmail": c.gmail,
            "timezone": c.timezone,
        }
        for c in contacts
    ]

    return {"contacts": result}


# POST /newmeeting
@app.post("/newmeeting/{userId}")
async def create_newmeetingcard(userId: int):
    if userId not in mockUserDB:
        raise HTTPException(status_code=404, detail="User not found")
    return "meee"
