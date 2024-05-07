from pydantic import BaseModel, validator, EmailStr
from datetime import datetime


class UserCreate(BaseModel):
    username: str
    password1: str
    password2: str
    first_name: str
    last_name: str
    email: EmailStr

    @validator("username", "password1", "password2", "email")
    def not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError("This is a required field.")
        return v

    @validator("password2")
    def match_passwords(cls, v, values):
        if "password1" in values and v != values["password1"]:
            raise ValueError("Passwords must match.")
        return v


class UserUpdate(BaseModel):
    username: str
    password1: str
    password2: str
    first_name: str
    last_name: str
    email: EmailStr

    @validator("username", "password1", "password2", "email")
    def not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError("This is a required field.")
        return v

    @validator("password2")
    def match_passwords(cls, v, values):
        if "password1" in values and v != values["password1"]:
            raise ValueError("Passwords must match.")
        return v


class UserResponse(BaseModel):
    id: str
    username: str
    email: EmailStr
    first_name: str
    last_name: str
    created: datetime
    modified: datetime
    last_login_attempt: datetime
    login_attempts: int


class Token(BaseModel):
    access_token: str
    token_type: str
    username: str
