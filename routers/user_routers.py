import logging
from typing import Annotated, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from db.engine import get_db
from db.models import User
from db.validation import UserCreate, UserRead, UserUpdate

log = logging.getLogger('app.routers')

User_Router = APIRouter(prefix='/users', tags=['users'])

@User_Router.post("/", response_model=UserRead)
def create_user(
    user_data: Annotated[UserCreate, Depends()],
    db: Session = Depends(get_db)
):
    # Проверка уникальности email/телефона
    if db.query(User).filter(User.user_email == user_data.user_email).first():
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    if db.query(User).filter(User.user_phone == user_data.user_phone).first():
        raise HTTPException(
            status_code=400,
            detail="Phone already registered"
        )
    
    db_user = User(**user_data.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@User_Router.get("/{user_id}", response_model=UserRead)
def read_user(
    user_id: int,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    return user

@User_Router.get("/", response_model=list[UserRead])
def list_users(
    skip: int = 0,
    limit: int = 100,
    group_id: Optional[int] = Query(None, description="Filter by group ID"),
    db: Session = Depends(get_db)
):
    query = db.query(User)
    if group_id is not None:
        query = query.filter(User.user_group_id == group_id)
    return query.offset(skip).limit(limit).all()

@User_Router.patch("/{user_id}", response_model=UserRead)
def update_user(
    user_id: int,
    user_update: Annotated[UserUpdate, Depends()],
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Проверка уникальности email/телефона при обновлении
    if user_update.user_email:
        if db.query(User).filter(
            User.user_email == user_update.user_email,
            User.user_id != user_id
        ).first():
            raise HTTPException(
                status_code=400,
                detail="Email already registered by another user"
            )
        user.user_email = user_update.user_email
    
    if user_update.user_phone:
        if db.query(User).filter(
            User.user_phone == user_update.user_phone,
            User.user_id != user_id
        ).first():
            raise HTTPException(
                status_code=400,
                detail="Phone already registered by another user"
            )
        user.user_phone = user_update.user_phone
    
    if user_update.user_name:
        user.user_name = user_update.user_name
    
    if user_update.user_group_id:
        user.user_group_id = user_update.user_group_id
    
    db.commit()
    db.refresh(user)
    return user

@User_Router.delete("/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.delete(user)
    db.commit()
    return {"detail": "User deleted successfully"}