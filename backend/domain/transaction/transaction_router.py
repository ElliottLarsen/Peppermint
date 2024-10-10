from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session
from starlette import status
from database import get_db
from domain.transaction.transaction_crud import (
    create_transaction,
    update_transaction,
    remove_transaction,
    get_account_transaction_by_id,
    valid_transaction,
)
from domain.transaction.transaction_schema import (
    TransactionCreate,
    TransactionUpdate,
    TransactionResponse,
)

router = APIRouter(prefix="/peppermint")


@router.post("/{account_id}")
def transaction_create(
    account_id: str,
    transaction_create: TransactionCreate,
    db: Session = Depends(get_db),
):
    """
    Create transaction router
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


@router.get("/{account_id}/{transaction_id}")
def one_transaction_get(
    transaction_id: str,
    account_id: str,
    db: Session = Depends(get_db),
):
    """
    Get one transaction router
    """
    # should this raise error if False?
    valid_transaction(db, account_id, transaction_id)
    return get_account_transaction_by_id(db, transaction_id)


@router.put("/{account_id}/{transaction_id}")
def transaction_update(
    transaction_update: TransactionUpdate,
    transaction_id: str,
    account_id: str,
    db: Session = Depends(get_db),
):
    """
    update transaction router
    """
    valid_transaction(db, account_id, transaction_id)
    return update_transaction(db, transaction_update, transaction_id, account_id)


@router.delete("/{account_id}/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT)
def transaction_remove(
    transaction_id: str,
    account_id: str,
    db: Session = Depends(get_db),
):
    """
    Delete transaction router
    """
    valid_transaction(db, account_id, transaction_id)
    return remove_transaction(db, transaction_id, account_id)
