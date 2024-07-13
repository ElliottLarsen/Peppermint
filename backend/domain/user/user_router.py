from fastapi import APIRouter, HTTPException
from fastapi import Depends
from sqlalchemy.orm import Session
from starlette import status
from datetime import timedelta, datetime
from database import get_db
from domain.user.user_crud import (
    pwd_context,
    create_user,
    update_user,
    get_user_by_username,
    get_user_by_id,
    get_existing_user,
    check_login_attempts,
    update_login_attempts,
    remove_user,
    get_all_users,
    validate_user,
    get_current_user,
)
from domain.user.user_schema import (
    UserCreate,
    UserResponse,
    Token,
    UserUpdate,
)
from models import User
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from jose import jwt
from starlette.config import Config

config = Config(".env")
router = APIRouter(prefix="/peppermint/user")

ACCESS_TOKEN_EXPIRE_MINUTES = int(config("ACCESS_TOKEN_EXPIRE_MINUTES", default=1))
SECRET_KEY = config("SECRET_KEY", default="SECRET_KEY")
ALGORITHM = "HS512"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/peppermint/user/login")


@router.post("/register")
def register(
    user_create: UserCreate,
    db: Session = Depends(get_db),
) -> UserResponse:
    """
    User registration.
    """
    user = get_existing_user(db, user_create=user_create)
    if user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This user already exists.",
        )
    new_user = create_user(db=db, user_create=user_create)

    return UserResponse(
        id=new_user.id,
        username=new_user.username,
        email=new_user.email,
        first_name=new_user.first_name,
        last_name=new_user.last_name,
        created=new_user.created,
        modified=new_user.modified,
        last_login_attempt=new_user.last_login_attempt,
        login_attempts=new_user.login_attempts,
    )


@router.post("/login", response_model=Token)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
) -> Token:
    """
    Login endpoint.
    """
    user = get_user_by_username(db, form_data.username)
    if not user or not pwd_context.verify(form_data.password, user.password):
        if user:
            check_login_attempts(db, user)
            update_login_attempts(db, user, 1, user.last_login_attempt)

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    check_login_attempts(db, user)
    data = {
        "sub": user.username,
        "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    }
    access_token = jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)
    update_login_attempts(db, user, -(user.login_attempts), datetime.utcnow())
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "username": user.username,
    }


@router.get("/")
def get_user_me(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> UserResponse:
    """
    Returns the currently log in user (aka, me).
    """
    print("HELLO!")
    validate_user(db, current_user)
    return get_user_by_id(db, current_user.id)


@router.get("/{user_id}")
def get_user_id(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> UserResponse | None:
    """
    Returns either the user by the given id or None.
    """
    validate_user(db, current_user)
    user = get_user_by_id(db, user_id)
    return user if user else None


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user_id(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Deletes users by user id
    """
    validate_user(db, current_user)
    user = get_user_by_id(db, user_id)
    return remove_user(db, user)

# here 
@router.get("/all/")
def get_user_all(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[UserResponse] | list:
    """
    Returns all users in the database
    """
    validate_user(db, current_user)
    users = get_all_users(db)
    
    return users    
