from pydantic import BaseModel, validator
from models import User, Account
from datetime import datetime, date, time


class TransactionCreate(BaseModel):
    transaction_date: datetime
    transaction_amount: float

    @validator("transaction_date", "transaction_amount")
    def date_not_empty(cls, v):
        if not v:
            raise ValueError("This is a required field.")
        return v


class TransactionUpdate(BaseModel):
    transaction_date: datetime
    transaction_amount: float
    account_id: str  # need?
    account: Account

    @validator("account_id", "account")
    def not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError("This is a required field.")
        return v

    @validator("transaction_date", "transaction_amount")
    def date_not_empty(cls, v):
        if not v:
            raise ValueError("This is a required field.")
        return v


class TransactionResponse(BaseModel):
    id: str
    transaction_date: datetime
    transaction_amount: float
    account_id: str
    account: Account
