from pydantic import BaseModel, validator
from models import User
from datetime import datetime


class AccountCreate(BaseModel):
    institution: str  # account_name
    account_type: str
    current_balance: float
    #  does this need user ?

    @validator("institution", "account_type", "current_balance")
    def not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError("This is a required field")
        return v


class AccountUpdate(BaseModel):
    institution: str 
    account_type: str
    current_balance: float

    @validator("institution", "account_type", "current_balance")
    def not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError("This is a required field")
        return v


class AccountResponse(BaseModel):
    id: str
    institution: str 
    account_type: str
    current_balance: float
    user_id: str
    user: str  # does this need user as well ?
