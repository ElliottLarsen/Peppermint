from pydantic import BaseModel, validator
from datetime import datetime


class TransactionCreate(BaseModel):
    transaction_date: datetime
    transaction_description: str
    transaction_category: str
    transaction_amount: float

    @validator("transaction_date", "transaction_amount")
    def not_empty(cls, v):
        if not v:
            raise ValueError("This is a required field.")
        return v


class TransactionUpdate(BaseModel):
    transaction_date: datetime
    transaction_description: str
    transaction_category: str
    transaction_amount: float

    @validator("transaction_date", "transaction_amount")
    def not_empty(cls, v):
        if not v:
            raise ValueError("This is a required field.")
        return v


class TransactionResponse(BaseModel):
    id: str
    transaction_date: datetime
    transaction_description: str
    transaction_category: str
    transaction_amount: float
    account_id: str
