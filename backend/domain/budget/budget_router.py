from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session
from starlette import status
from database import get_db
from domain.budget.budget_crud import (
    create_budget,
    update_budget,
    remove_budget,
    get_budget_by_id,
    get_user_budgets,
)
from domain.user.user_crud import (
    validate_user,
)
from domain.budget.budget_schema import (
    BudgetCreate,
    BudgetUpdate,
    BudgetResponse,
)

from models import (
    User,
)

from domain.user.user_router import get_current_user

router = APIRouter(prefix="/peppermint/budget")


@router.post("/")
def budget_create(
    budget_create: BudgetCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> BudgetResponse:
    """
    Create budget
    """
    # validate_user(db, current_user)
    new_budget = create_budget(db, budget_create=budget_create, user=current_user)

    return BudgetResponse(
        id=new_budget.id,
        budget_category=new_budget.budget_category,
        budget_amount=new_budget.budget_amount,
        user_id=new_budget.user_id,
    )


@router.get("/my_budgets")
def budget_get(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get all of user's budgets
    """
    # validate_user(current_user)
    return get_user_budgets(db, current_user)


@router.get("/{id}")
def one_budget_get(
    id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # validate_user(current_user)
    return get_budget_by_id(db, id)


@router.put("/{id}")
def budget_update(
    budget_update: BudgetUpdate,
    id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    update budget by id
    """
    # validate_user(current_user)
    budget = get_budget_by_id(db, id)
    return update_budget(db, budget_update, budget)


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def budget_remove(
    id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    delete budget by id
    """
    # validate_user(current_user)
    budget = get_budget_by_id(db, id)
    return remove_budget(db, budget)
