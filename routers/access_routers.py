import logging
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from db.engine import get_db
from db.models import Access
from db.validation import AccessCreate, AccessRead

log = logging.getLogger('app.routers')

Access_Router = APIRouter(prefix='/access', tags=['access'])

@Access_Router.post("/", response_model=AccessRead)
def create_access_role(
    role: Annotated[AccessCreate, Depends()],
    db: Session = Depends(get_db)
):
    if db.query(Access).filter(Access.role_name == role.role_name).first():
        raise HTTPException(status_code=400, detail="Role name exists")
    
    db_role = Access(**role.dict())
    db.add(db_role)
    db.commit()
    db.refresh(db_role)
    return db_role

@Access_Router.get("/{role_id}", response_model=AccessRead)
def read_access_role(
    role_id: int,
    db: Session = Depends(get_db)
):
    role = db.query(Access).filter(Access.role_id == role_id).first()
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    return role