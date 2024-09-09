from sqlalchemy.orm import Session
from domain.account.account_schema import (
    AccountCreate,
    AccountUpdate,
)
from models import User, Account
import uuid
from datetime import datetime, timedelta, timezone
from starlette import status
from fastapi import HTTPException


def create_account(
    db: Session,
    account_create: AccountCreate,
    user: User,
) -> Account:
    """
    Creates new account
    """
    db_account = Account(
        id=str(uuid.uuid4()),
        institution=account_create.institution,
        account_type=account_create.account_type,
        current_balance=account_create.current_balance,
        user_id=user.id,
        user=user,
    )

    db.add(db_account)
    db.commit()
    return get_account_by_id(db, db_account.id)


def update_account(
    db: Session,
    account_update: AccountUpdate,
    account: Account,
) -> Account:
    """
    Updates account
    """
    account = get_account_by_id(db, account.id)
    account.institution = account_update.institution
    account.account_type = account_update.account_type
    account.current_balance = account_update.current_balance
    db.add(account)
    db.commit()
    return get_account_by_id(db, account.id)


def remove_account(
    db: Session,
    account: Account,
) -> None:
    """
    Deletes account
    """
    db.delete(account)
    db.commit()


def get_account_by_id(
    db: Session,
    id: str,
) -> Account | None:
    """
    Retrieves account by id
    """
    return db.query(Account).filter(Account.id == id).first()


def get_user_accounts(
    db: Session,
    user: User,
):
    """
    Retrieves list of accounts for a user
    """
    accounts = db.query(Account).filter(Account.user_id == user.id).all()
    if not accounts:
        return
    return accounts


def get_all_accounts_by_user_id(
    db: Session,
    user_id: str,
):
    """
    Retrieves user's accounts by user id
    """
    accounts = db.query(Account).filter(Account.user_id == user_id).all()
    if not accounts:
        return
    return accounts
