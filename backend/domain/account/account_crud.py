from sqlalchemy.orm import Session
from domain.account.account_schema import (
    AccountCreate,
    AccountUpdate,
)
from models import User
from passlib.context import CryptContext
import uuid
from datetime import datetime, timedelta, timezone
from starlette import status
from fastapi import HTTPException
from starlette.config import Config
from database import get_db