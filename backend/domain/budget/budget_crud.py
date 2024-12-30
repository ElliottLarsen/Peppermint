from sqlalchemy.orm import Session
from domain.budget.budget_schema import (
    BudgetCreate,
    BudgetUpdate,
)
from models import User, Budget
import uuid


def create_budget(
    db: Session,
    budget_create: BudgetCreate,
    user: User,
) -> Budget:
    """
    Create new budget
    """
    db_budget = Budget(
        id=str(uuid.uuid4()),
        budget_category=budget_create.budget_category,
        budget_amount=budget_create.budget_amount,
        user_id=user.id,
        user=user,
    )

    db.add(db_budget)
    db.commit()
    return get_budget_by_id(db, db_budget.id)


def update_budget(
    db: Session,
    budget_update: BudgetUpdate,
    budget: Budget,
) -> Budget:
    """
    Update budget
    """
    budget = get_budget_by_id(db, budget.id)
    budget.budget_category = budget_update.budget_category
    budget.budget_amount = budget_update.budget_amount
    db.add(budget)
    db.commit()
    return get_budget_by_id(db, budget.id)


def remove_budget(
    db: Session,
    budget: Budget,
) -> None:
    """
    Delete budget
    """
    db.delete(budget)
    db.commit()


def get_budget_by_id(
    db: Session,
    id: str,
) -> Budget | None:
    """
    Retrieve budget by id
    """
    return db.query(Budget).filter(Budget.id == id).first()


def get_user_budgets(
    db: Session,
    user: User,
):
    """
    Retrieves user's budgets
    """

    budgets = db.query(Budget).filter(Budget.user_id == user.id).all()

    if not budgets:
        return
    return budgets
