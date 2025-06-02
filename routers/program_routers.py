import logging
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from db.engine import get_db
from db.models import Program
from db.validation import ProgramCreate, ProgramRead

log = logging.getLogger('app.routers')

Program_Router = APIRouter(prefix='/programs', tags=['programs'])

@Program_Router.post("/", response_model=ProgramRead)
def create_program(
    program: Annotated[ProgramCreate, Depends()],
    db: Session = Depends(get_db)
):
    # Проверка уникальности названия программы
    if db.query(Program).filter(Program.program_name == program.program_name).first():
        raise HTTPException(
            status_code=400,
            detail="Program name already exists"
        )
    
    db_program = Program(**program.dict())
    db.add(db_program)
    db.commit()
    db.refresh(db_program)
    return db_program

@Program_Router.get("/{program_id}", response_model=ProgramRead)
def read_program(
    program_id: int,
    db: Session = Depends(get_db)
):
    program = db.query(Program).filter(Program.program_id == program_id).first()
    if not program:
        raise HTTPException(
            status_code=404,
            detail="Program not found"
        )
    return program

@Program_Router.get("/", response_model=list[ProgramRead])
def list_programs(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    return db.query(Program).offset(skip).limit(limit).all()

@Program_Router.patch("/{program_id}", response_model=ProgramRead)
def update_program(
    program_id: int,
    program_update: Annotated[ProgramCreate, Depends()],
    db: Session = Depends(get_db)
):
    program = db.query(Program).filter(Program.program_id == program_id).first()
    if not program:
        raise HTTPException(status_code=404, detail="Program not found")
    
    if program_update.program_name:
        # Проверка уникальности нового имени
        if db.query(Program).filter(
            Program.program_name == program_update.program_name,
            Program.program_id != program_id
        ).first():
            raise HTTPException(
                status_code=400,
                detail="Program name already exists"
            )
        program.program_name = program_update.program_name
    
    db.commit()
    db.refresh(program)
    return program

@Program_Router.delete("/{program_id}")
def delete_program(
    program_id: int,
    db: Session = Depends(get_db)
):
    program = db.query(Program).filter(Program.program_id == program_id).first()
    if not program:
        raise HTTPException(status_code=404, detail="Program not found")
    
    db.delete(program)
    db.commit()
    return {"detail": "Program deleted successfully"}