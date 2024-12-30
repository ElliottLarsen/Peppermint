from pydantic import BaseModel


class BudgetCreate(BaseModel):
    budget_category: str
    budget_amount: float


class BudgetUpdate(BaseModel):
    budget_category: str
    budget_amount: float


class BudgetResponse(BaseModel):
    id: str
    budget_category: str
    budget_amount: float
    user_id: str
