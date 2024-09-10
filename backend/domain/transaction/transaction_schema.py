from pydantic import BaseModel, validator
from models import User, Account
from datetime import datetime, date, time


class TransactionCreate(BaseModel):
    transaction_type: str
    transaction_date: date
    # transaction_time: time
    vendor: str  # vendor for withdrawals and institution for deposits?
    amount: float
    transaction_note: str  # need?

    @validator(
        "transaction_type",
        "vendor",
        "transaction_note",
    )
    def not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError("This is a required field.")
        return v

    @validator("transaction_date")
    def date_not_empty(cls, v):
        if not v:
            raise ValueError("This is a required field.")
        return v

    @validator("amount")
    def amount_not_empty(cls, v):
        if not v:
            raise ValueError("This is a required field.")
        return v


class TransactionUpdate(BaseModel):
    transaction_type: str
    transaction_date: date
    # transaction_time: time
    vendor: str  # vendor for withdrawals and institution for deposits?
    amount: float
    transaction_note: str  # need?

    @validator(
        "transaction_type",
        "vendor",
        "transaction_note",
    )
    def not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError("This is a required field.")
        return v

    @validator("transaction_date")
    def date_not_empty(cls, v):
        if not v:
            raise ValueError("This is a required field.")
        return v

    @validator("amount")
    def amount_not_empty(cls, v):
        if not v:
            raise ValueError("This is a required field.")
        return v


class TransactionResponse(BaseModel):
    id: str
    transaction_type: str
    transaction_date: date
    # transaction_time: time
    vendor: str  # vendor for withdrawals and institution for deposits?
    amount: float
    transaction_note: str  # need?
    account_id: str  # or should this be user_id?
