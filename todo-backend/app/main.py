from fastapi import FastAPI
from .database import Base, engine
from .models import User
from .routers import auth
from fastapi import Depends
from .auth import get_current_user
from .schemas import UserResponse
from . import models
from .routers import todos
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(todos.router)

Base.metadata.create_all(bind=engine)

app.include_router(auth.router)

@app.get("/")
def read_root():
    return {"message": "API is running, https://chatgpt.com/c/6985ca5a-87b8-8324-88a2-f521466a8119"}

@app.get("/me", response_model=UserResponse)
def read_current_user(current_user: models.User = Depends(get_current_user)):
    return current_user
