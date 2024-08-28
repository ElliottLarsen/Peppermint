from fastapi import APIRouter, HTTPException
from fastapi import Depends
from sqlalchemy.orm import Session
from starlette import status
from database import get_db
from domain.account.account_crud import (
    create_account,
    update_account,
    remove_account,
    get_account_by_id,
    get_user_accounts,
)
from domain.user.user_crud import validate_user
from domain.account.account_schema import (
    AccountCreate,
    AccountUpdate,
    AccountResponse,
)
from models import (
    Account,
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
