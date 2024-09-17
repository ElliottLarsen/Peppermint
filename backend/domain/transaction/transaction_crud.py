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
        account_id=account,
    )

    account_balance_update(db, account, db_transaction.transaction_amount)

    db.add(db_transaction)
    db.commit()
    return get_account_transactions(db, account_id)


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
