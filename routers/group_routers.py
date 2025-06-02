import logging
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from db.engine import get_db
from db.models import Group
from db.validation import GroupCreate, GroupRead

log = logging.getLogger('app.routers')

Group_Router = APIRouter(prefix='/groups', tags=['groups'])

@Group_Router.post("/", response_model=GroupRead)
def create_group(
    group: Annotated[GroupCreate, Depends()],
    db: Session = Depends(get_db)
):
    # Проверка уникальности имени группы
    if db.query(Group).filter(Group.group_name == group.group_name).first():
        raise HTTPException(
            status_code=400,
            detail="Group name already exists"
        )
    
    db_group = Group(**group.dict())
    db.add(db_group)
    db.commit()
    db.refresh(db_group)
    return db_group

@Group_Router.get("/{group_id}", response_model=GroupRead)
def read_group(
    group_id: int,
    db: Session = Depends(get_db)
):
    group = db.query(Group).filter(Group.group_id == group_id).first()
    if not group:
        raise HTTPException(
            status_code=404,
            detail="Group not found"
        )
    return group

@Group_Router.patch("/{group_id}", response_model=GroupRead)
def update_group(
    group_id: int,
    group_update: Annotated[GroupCreate, Depends()],
    db: Session = Depends(get_db)
):
    group = db.query(Group).filter(Group.group_id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    
    if group_update.group_name:
        # Проверка уникальности нового имени
        if db.query(Group).filter(
            Group.group_name == group_update.group_name,
            Group.group_id != group_id
        ).first():
            raise HTTPException(
                status_code=400,
                detail="Group name already exists"
            )
        group.group_name = group_update.group_name
    
    db.commit()
    db.refresh(group)
    return group