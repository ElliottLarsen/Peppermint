from sqlalchemy import (
    Column,
    ForeignKey,
    String,
    DateTime,
    Integer,
    Text,
    Boolean,
    Float,
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()


class User(Base):
    """
    User table in DB
    """

    __tablename__ = "site_user"
    id = Column(String, primary_key=True)
    username = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    created = Column(DateTime, nullable=False)
    modified = Column(DateTime, nullable=False)
    last_verified = Column(DateTime, nullable=True)
    last_login_attempt = Column(DateTime, nullable=True)
    login_attempts = Column(Integer, nullable=False)


class Account(Base):
    """
    Account table in DB
    """

    __tablename__ = "account"
    id = Column(String, primary_key=True)
    account_type = Column(String, unique=False, nullable=False)
    institution = Column(String, unique=False, nullable=False)
    current_balance = Column(Float, unique=False, nullable=False)
    user_id = Column(String, ForeignKey("site_user.id"))
    user = relationship("User", backref="account")


class Transaction(Base):
    """
    Transaction table in DB
    """

    __tablename__ = "transaction"
    id = Column(String, primary_key=True)
    transaction_date = Column(DateTime, nullable=False)
    transaction_description = Column(String, unique=False, nullable=True)
    transaction_category = Column(String, unique=False, nullable=True)
    transaction_amount = Column(Float, unique=False, nullable=False)
    account_id = Column(String, ForeignKey("account.id"))
    account = relationship("Account", backref="transaction")


class Budget(Base):
    """
    Budget table in DB
    """

    __tablename__ = "budget"
    id = Column(String, primary_key=True)
    budget_category = Column(String, unique=False, nullable=False)
    budget_amount = Column(Float, unique=False, nullable=False)
    user_id = Column(String, ForeignKey("site_user.id"))
    user = relationship("User", backref="budget")
