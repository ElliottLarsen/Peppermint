from pydantic import BaseModel


class AccountCreate(BaseModel):
    account_type: str
    institution: str
    current_balance: float


class AccountUpdate(BaseModel):
    account_type: str
    institution: str


class AccountResponse(BaseModel):
    id: str
    account_type: str
    institution: str
    current_balance: str
    user_id: str
