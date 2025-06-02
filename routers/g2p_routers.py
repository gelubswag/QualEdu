import logging
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from db.engine import get_db
from db.models import Program, Group, Group_to_Prog
from db.validation import GroupToProgCreate, GroupToProgRead

log = logging.getLogger('app.routers')

G2P_Router = APIRouter(prefix='/groups', tags=['groups'])

@G2P_Router.post("/{group_id}/programs/", response_model=GroupToProgRead)
def add_program_to_group(
    group_id: int, 
    relation: Annotated[GroupToProgCreate, Depends()],
    db: Session = Depends(get_db)
):
    # Проверка существования группы и программы
    group_exists = db.query(Group).filter(Group.group_id == group_id).first()
    if not group_exists:
        raise HTTPException(status_code=404, detail="Group not found")
    
    program_exists = db.query(Program).filter(Program.program_id == relation.program_id).first()
    if not program_exists:
        raise HTTPException(status_code=404, detail="Program not found")
    
    # Проверка существующей связи
    existing_relation = db.query(Group_to_Prog).filter(
        Group_to_Prog.group_id == group_id,
        Group_to_Prog.program_id == relation.program_id
    ).first()
    
    if existing_relation:
        raise HTTPException(
            status_code=400,
            detail="This program is already associated with the group"
        )
    
    db_relation = Group_to_Prog(
        group_id=group_id,
        program_id=relation.program_id
    )
    db.add(db_relation)
    db.commit()
    db.refresh(db_relation)
    return db_relation

@G2P_Router.get("/{group_id}/programs/", response_model=list[GroupToProgRead])
def get_group_programs(
    group_id: int,
    db: Session = Depends(get_db)
):
    if not db.query(Group).filter(Group.group_id == group_id).first():
        raise HTTPException(status_code=404, detail="Group not found")
    
    relations = db.query(Group_to_Prog).filter(
        Group_to_Prog.group_id == group_id
    ).all()
    
    return relations

@G2P_Router.delete("/{group_id}/programs/{program_id}/")
def remove_program_from_group(
    group_id: int,
    program_id: int,
    db: Session = Depends(get_db)
):
    relation = db.query(Group_to_Prog).filter(
        Group_to_Prog.group_id == group_id,
        Group_to_Prog.program_id == program_id
    ).first()
    
    if not relation:
        raise HTTPException(
            status_code=404,
            detail="Program not associated with this group"
        )
    
    db.delete(relation)
    db.commit()
    return {"detail": "Program removed from group"}