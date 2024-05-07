from sqlalchemy.orm import Session
from domain.user.user_schema import (
    UserCreate,
    UserUpdate,
)
from models import User
from passlib.context import CryptContext
import uuid
from datetime import datetime, timedelta, timezone
from starlette import status
from fastapi import HTTPException
from starlette.config import Config
from database import get_db
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends
from jose import jwt, JWTError

config = Config(".env")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/peppermint/user/login")
SECRET_KEY = config("SECRET_KEY", default="SECRET_KEY")
ALGORITHM = "HS512"

ACCEPTED_EMAILS = [
    config("EMAIL1", default="default1"),
    config("EMAIL2", default="default2"),
]

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# CRUD


def create_user(db: Session, user_create: UserCreate) -> User:
    """
    Creates a new user
    """
    db_user = User(
        id=str(uuid.uuid4()),
        username=user_create.username,
        password=pwd_context.hash(user_create.password1),
        email=user_create.email,
        first_name=user_create.first_name,
        last_name=user_create.last_name,
        created=datetime.now(timezone.utc),
        modified=datetime.now(timezone.utc),
        last_verified=datetime.now(timezone.utc),
        last_login_attempt=datetime.now(timezone.utc),
        login_attempts=0,
    )

    db.add(db_user)
    db.commit()

    return get_user_by_username(db, user_create.username)


def get_all_users(db: Session):
    """
    Retrieves all users.
    """
    return db.query(User).all()


def get_user_by_username(db: Session, username: str) -> User | None:
    """
    Retrives user by username.
    """
    return db.query(User).filter(User.username == username).first()


def get_user_by_id(db: Session, id: str) -> User | None:
    """
    Retrieves a user by the given ID
    """
    return db.query(User).filter(User.id == id).first()


def get_existing_user(db: Session, user_create: UserCreate) -> User | None:
    """
    Retrieves user with the given username or email.
    """
    return (
        db.query(User)
        .filter(
            (User.username == user_create.username) | (User.email == user_create.email)
        )
        .first()
    )


def update_user(
    db: Session,
    user_update: UserUpdate,
    current_user: User,
) -> User:
    """
    Updates user
    """
    user = get_user_by_id(db, current_user.id)
    user.username = user_update.username
    user.password = pwd_context.hash(user_update.password1)
    user.email = user_update.email
    user.first_name = user_update.first_name
    user.last_name = user_update.last_name
    user.modified = datetime.now(timezone.utc)
    db.add(user)
    db.commit()
    return get_user_by_id(db, user.id)


def remove_user(db: Session, current_user: User) -> None:
    """
    Remmoves the currently logged in user.
    """
    db.delete(current_user)
    db.commit()


# Utils


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    """
    Authenticates the current user.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    else:
        user = get_user_by_username(db, username=username)
        if user is None:
            raise credentials_exception
        return user


def update_login_attempts(
    db: Session,
    current_user: User,
    login_attempts: int = 0,
    last_login_attempt: datetime = None,
) -> None:
    """
    Updates login attempts
    """
    user = get_user_by_username(db, current_user.username)
    user.login_attempts += login_attempts
    if last_login_attempt:
        user.last_login_attempt = last_login_attempt
    db.add(user)
    db.commit()


def check_login_attempts(db: Session, current_user: User):
    """
    After 3 unsuccessful login attempts, blocks the user for 10 minutes.
    """
    if current_user.login_attempts == 3:
        if datetime.utcnow() < current_user.last_login_attempt:
            remainder = (
                current_user.last_login_attempt - datetime.utcnow()
            ).total_seconds()
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Too many failed login attempts. \
                Please try again in {remainder} seconds.",
                headers={"WWW-Authenticate": "Bearer"},
            )
        else:
            update_login_attempts(db, current_user, -(current_user.login_attempts))
    if current_user.login_attempts == 2:
        new_time = current_user.last_login_attempt + timedelta(minutes=10)
        update_login_attempts(db, current_user, 0, new_time)


def validate_user(db: Session, current_user: User) -> None:
    """
    Validates user.
    """
    all_users = db.query(User).all()
    if len(all_users) > 2 or current_user.email not in ACCEPTED_EMAILS:
        raise HTTPException(status_code=403, detail="You are not authorized.")
