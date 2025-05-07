from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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


# PUT /setting/{user_id}
@app.put("/setting/{userId}")
def update_user():
    return {"message": "Hello, World!"}
