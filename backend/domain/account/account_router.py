from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session
from starlette import status
from datetime import datetime, timedelta
from database import get_db
from domain.account.account_crud import (
    create_account,
    update_account,
    remove_account,
    get_account_by_id,
    get_user_accounts,
    get_users_accounts_balance,
)
from domain.user.user_crud import (
    validate_user,
)
from domain.transaction.transaction_crud import (
    get_account_transactions_all,
    get_all_transactions,
    get_expenses_by_month,
    date_modulo,
)
from domain.account.account_schema import (
    AccountCreate,
    AccountUpdate,
    AccountResponse,
)
from models import (
    User,
)

from domain.user.user_router import get_current_user

router = APIRouter(prefix="/peppermint/account")


@router.post("/")
def account_create(
    account_create: AccountCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> AccountResponse:
    """
    Create Account
    """
    validate_user(db, current_user)
    new_account = create_account(db, account_create=account_create, user=current_user)

    return AccountResponse(
        id=new_account.id,
        institution=new_account.institution,
        account_type=new_account.account_type,
        current_balance=new_account.current_balance,
        user_id=new_account.user_id,
    )


@router.get("/my_accounts")
def account_get(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Gets all of user's accounts
    """
    validate_user(db, current_user)
    return get_user_accounts(db, current_user)


@router.get("/all_transactions")
def account_get_all_transactions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    validate_user(db, current_user)
    return get_all_transactions(db, current_user.id)


@router.get("/expenses")
def account_get_expenses(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    get current month's expenses
    """
    today = datetime.today()
    year, month = today.year, today.month
    return get_expenses_by_month(db, current_user.id, year, month)


@router.get("/total_balances")
def account_get_total_balances(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    validate_user(db, current_user)
    return get_users_accounts_balance(db, current_user.id)


@router.get("/{id}")
def one_account_get(
    id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    validate_user(db, current_user)
    return get_account_by_id(db, id)


@router.get("/{account_id}/transactions")
def get_account_transactions(
    account_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    validate_user(db, current_user)
    return get_account_transactions_all(db, account_id)


@router.put("/{id}")
def account_update(
    account_update: AccountUpdate,
    id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Update account by id
    """
    validate_user(db, current_user)
    account = get_account_by_id(db, id)
    return update_account(db, account_update, account)


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def account_remove(
    id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Delete account by id
    """
    validate_user(db, current_user)
    account = get_account_by_id(db, id)
    return remove_account(db, account)
