from sqlalchemy.orm import Session
from domain.transaction.transaction_schema import (
    TransactionCreate,
    TransactionUpdate,
)
from domain.account.account_crud import (
    account_balance_update,
    get_account_by_id,
)
from models import Transaction
from starlette import status
from fastapi import HTTPException
import uuid


def create_transaction(
    db: Session, transaction_create: TransactionCreate, account_id: str
) -> Transaction:
    """
    Create new transaction
    """
    account = get_account_by_id(db, account_id)
    db_transaction = Transaction(
        id=str(uuid.uuid4()),
        transaction_date=transaction_create.transaction_date,
        transaction_amount=transaction_create.transaction_amount,
        account_id=account.id,
        account=account,
    )

    account_balance_update(db, account, db_transaction.transaction_amount)

    db.add(db_transaction)
    db.commit()
    return get_account_transaction_by_id(db, db_transaction.id)


def update_transaction(
    db: Session,
    transaction_update: TransactionUpdate,
    transaction_id: str,
    account_id: str,
) -> Transaction:
    """
    update Transaction
    """
    account = get_account_by_id(db, account_id)
    transaction = get_account_transaction_by_id(db, transaction_id)

    if not valid_transaction(account_id, transaction_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction and account mismatch",
        )

    old_amount = transaction.transaction_amount

    # remove the old amount from the current balance by negating the sign
    account_balance_update(db, account, (old_amount * -1))
    transaction.transaction_date = transaction_update.transaction_date
    transaction.transaction_amount = transaction_update.transaction_amount

    account_balance_update(db, account, transaction_update.transaction_amount)

    db.add(transaction)
    db.commit()
    return get_account_transactions(db, account_id)


def remove_transaction(
    db: Session,
    transaction_id: str,
    account_id: str,
):

    if not valid_transaction(account_id, transaction_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction and account mismatch",
        )

    account = get_account_by_id(db, account_id)
    transaction = get_account_transaction_by_id(db, transaction_id)

    old_amount = transaction.transaction_amount
    account_balance_update(db, account, (old_amount * -1))

    db.delete(transaction)
    db.commit()


def get_account_transactions(
    db: Session,
    account_id: str,
):
    """
    Retrieves all transaction of an account
    """

    transactions = (
        db.query(Transaction).filter(Transaction.account_id == account_id).all()
    )
    if not transactions:
        return
    return transactions


def get_account_transaction_by_id(db: Session, transaction_id: str) -> Transaction | None:
    """
    returns transaction from given transaction id
    """
    return db.query(Transaction).filter(Transaction.id == transaction_id).first()


def valid_transaction(db: Session, account_id: str, transaction_id: str) -> bool:
    """
    Checks if a transaction is valid and returns bool
    """

    account_transactions = get_account_transactions(db, account_id)
    # Debug this. account_transactions might be a list of transactions.
    transaction_id_set = set()

    for transaction in account_transactions:
        transaction_id_set.add(transaction.id)

    if transaction_id not in transaction_id_set:
        return False
    return True
