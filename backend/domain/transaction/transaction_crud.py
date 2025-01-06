from sqlalchemy.orm import Session
from sqlalchemy import extract
from datetime import datetime
from dateutil.relativedelta import relativedelta
from collections import defaultdict
from domain.transaction.transaction_schema import (
    TransactionCreate,
    TransactionUpdate,
)
from domain.account.account_crud import (
    account_balance_update,
    get_account_by_id,
    get_all_accounts_by_user_id,
)
from models import Transaction, User
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
        transaction_description=transaction_create.transaction_description,
        transaction_category=transaction_create.transaction_category,
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

    if not valid_transaction(db, account_id, transaction_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction and account mismatch",
        )

    old_amount = transaction.transaction_amount

    # remove the old amount from the current balance by negating the sign
    account_balance_update(db, account, (old_amount * -1))
    transaction.transaction_date = transaction_update.transaction_date
    transaction.transaction_description = transaction_update.transaction_description
    transaction.transaction_category = transaction_update.transaction_category
    transaction.transaction_amount = transaction_update.transaction_amount

    account_balance_update(db, account, transaction_update.transaction_amount)

    db.add(transaction)
    db.commit()
    return get_account_transactions_all(db, account_id)


def remove_transaction(
    db: Session,
    transaction_id: str,
    account_id: str,
):

    if not valid_transaction(db, account_id, transaction_id):
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


def get_account_transactions_all(
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


def get_account_transaction_by_id(
    db: Session, transaction_id: str
) -> Transaction | None:
    """
    returns transaction from given transaction id
    """
    return db.query(Transaction).filter(Transaction.id == transaction_id).first()


def valid_transaction(db: Session, account_id: str, transaction_id: str) -> bool:
    """
    Checks if a transaction is valid and returns bool
    """

    account_transactions = get_account_transactions_all(db, account_id)

    transaction_id_set = set()

    for transaction in account_transactions:
        transaction_id_set.add(transaction.id)

    if transaction_id not in transaction_id_set:
        return False
    return True


def get_all_transactions(db: Session, user_id: str):
    """
    returns all transactions for a user
    """
    transactions = []

    accounts = get_all_accounts_by_user_id(db, user_id)

    for account in accounts:
        account_transactions = get_account_transactions_all(db, account.id)
        if account_transactions:
            for item in account_transactions:
                transactions.append(item)

    return transactions


def get_account_transactions_by_month(
    db: Session, account_id: str, year: int, month: int
):
    """
    return query for account's transactions by month/year
    """
    year, month = year, month

    transactions = (
        db.query(Transaction)
        .filter(
            Transaction.account_id == account_id,
            extract("year", Transaction.transaction_date) == year,
            extract("month", Transaction.transaction_date) == month,
        )
        .all()
    )

    return transactions


def get_all_transactions_by_month(db: Session, user_id: str, year: int, month: int):
    monthly_transactions = []

    accounts = get_all_accounts_by_user_id(db, user_id)

    for account in accounts:
        current_month = get_account_transactions_by_month(db, account.id, year, month)
        if current_month:
            for item in current_month:
                monthly_transactions.append(item)

    return monthly_transactions


def sort_transactions_date(transactions: list):
    """
    sort transactions by date descending
    """

    return sorted(transactions, key=lambda x: x.transaction_date, reverse=True)


def get_transaction_balances_by_category(transactions):
    """
    return transactions categories' balances
    """
    category_balances = {
        "auto-transport": 0,
        "bills-utilities": 0,
        "credit": 0,
        "education": 0,
        "fees-charges": 0,
        "food-restaurants": 0,
        "gas": 0,
        "groceries": 0,
        "health-fitness": 0,
        "income": 0,
        "misc": 0,
        "mortgage-rent": 0,
        "personal care": 0,
        "pets": 0,
        "refund": 0,
        "shopping": 0,
        "transfer": 0,
    }

    for item in transactions:
        category_balances[item.transaction_category] += abs(item.transaction_amount)

    return category_balances


def get_expenses_total_for_month(db: Session, user_id: str, year: int, month: int):
    """
    return expenses by month (no income, credit, transfer)
    """
    current_total = 0.0
    income = {"credit", "income", "transfer"}

    transactions = get_all_transactions_by_month(db, user_id, year, month)
    for item in transactions:
        if item.transaction_category not in income:
            current_total += abs(item.transaction_amount)

    return current_total


def get_six_months_total_expenses(
    db: Session, user_id: str, year: int, month: int, day: int
):
    """
    return last six months expenses (total value)
    """
    income = {"credit", "income", "transfer"}
    expenses_by_month = defaultdict(float)

    current_date = datetime(year, month, day)

    for i in range(6):
        date = current_date - relativedelta(months=i)
        current_year, current_month = date.year, date.month

        total_expenses = 0.0
        transactions = get_all_transactions_by_month(
            db, user_id, current_year, current_month
        )

        for item in transactions:
            if item.transaction_category not in income:
                total_expenses += abs(item.transaction_amount)
        expenses_by_month[f"{current_year}-{current_month:02d}"] = total_expenses

    return expenses_by_month


def get_monthly_expenses_by_category(transactions):
    expense_balances = {
        "auto-transport": 0,
        "bills-utilities": 0,
        "education": 0,
        "fees-charges": 0,
        "food-restaurants": 0,
        "gas": 0,
        "groceries": 0,
        "health-fitness": 0,
        "misc": 0,
        "mortgage-rent": 0,
        "personal care": 0,
        "pets": 0,
        "refund": 0,
        "shopping": 0,
    }

    for item in transactions:
        expense_balances[item.transaction_category] += abs(item.transaction_amount)

    return expense_balances
