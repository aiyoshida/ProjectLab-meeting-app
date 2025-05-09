from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# implement pydantic for type definition later

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
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


# PUT /setting/{user_id}
class UserUpdate(BaseModel):
    id: int
    username: str
    timezone: str


# PUT /setting/{user_id}
@app.put("/setting/{userId}")
async def update_user(userId: int, user_data: UserUpdate):
    if userId not in mockUserDB:
        raise HTTPException(status_code=404, detail="User not found")
    data = user_data
    print("受け取ったデータ:", data)
    mockUserDB[userId] = data
    return {"message": "Success!", "data": mockUserDB[userId]}


# http://localhost:3000/contact
# GET /contact/{userId}
@app.get("/contact/{userId}")
async def get_contactlist(userId: int):
    if userId not in mockUserDB:
        raise HTTPException(status_code=404, detail="User not found")
    contacts = []
    for contact in mockContactDB.values():
        if contact["userId"] == userId:
            contacts.append(contact)
    return {"contacts": contacts}


# GET /homepage/{userId}
@app.get("/homepage/{userId}")
async def get_meeting_card(userId: int):
    if userId not in mockUserDB:
        raise HTTPException(status_code=404, detail="User not found")
    cards = []
    for card in mockMeetingCardDB.values():
        if card["user_id"] == userId:
            cards.append(card)
    return {"cards": cards}


# DELETE /homepage/{cardId}
@app.delete("/homepage/{cardId}")
async def delete_card(cardId: int):
    if cardId not in mockMeetingCardDB:
        raise HTTPException(status_code=404, detail="User not found")

    deleted = mockMeetingCardDB.pop(cardId)
    return {"message": "deleted", "deleted card is ": deleted}


# GET /newmeeting/{userId}
@app.get("/newmeeting/{userId}")
async def get_meetingcontactlist(userId: int):
    if userId not in mockUserDB:
        raise HTTPException(status_code=404, detail="User not found")
    contacts = []
    for contact in mockContactDB.values():
        if contact["userId"] == userId:
            contacts.append(contact)
    return {"contacts": contacts}


# POST /newmeeting
@app.post("/newmeeting/{userId}")
async def create_newmeetingcard(userId: int):
    if userId not in mockUserDB:
        raise HTTPException(status_code=404, detail="User not found")
    return "meee"
