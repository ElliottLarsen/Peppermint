from fastapi import APIRouter, HTTPException
from fastapi import Depends
from sqlalchemy.orm import Session
from starlette import status
from database import get_db
from domain.transaction.transaction_crud import (
    create_transaction,
    update_transaction,
    remove_transaction,
    get_account_transactions,
    get_account_transaction_by_id,
    valid_transaction,
)
from domain.account.account_crud import (
    create_account,
    update_account,
    remove_account,
    get_account_by_id,
    get_user_accounts,
    account_balance_update,
)
from domain.user.user_crud import (
    validate_user,
    get_user_by_id,
)
from domain.transaction.transaction_schema import (
    TransactionCreate,
    TransactionUpdate,
    TransactionResponse,
)
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

router = APIRouter(prefix="/peppermint/")


@router.post("/{account_id}")
def transaction_create(
    transaction_create: TransactionCreate,
    account_id: str,
    db: Session = Depends(get_db),
) -> TransactionResponse:
    """
    Create transaction
    """
    # do I need to validate account?
    new_transaction = create_transaction(
        db, transaction_create=transaction_create, account_id=account_id
    )

    return TransactionResponse(
        id=new_transaction.id,
        transaction_date=new_transaction.transaction_date,
        transaction_amount=new_transaction.transaction_amount,
        account_id=new_transaction.account_id,
    )
