from pydantic import BaseModel, EmailStr, constr
from typing import List, Optional


# === PROGRAM ===

class ProgramBase(BaseModel):
    program_name: str


class ProgramCreate(ProgramBase):
    pass


class ProgramRead(ProgramBase):
    program_id: int

    class Config:
        orm_mode = True


# === USER ===

class UserBase(BaseModel):
    user_name: str
    user_phone: str
    user_email: EmailStr
    user_password: str
    user_group_id: int


class UserCreate(UserBase):
    pass


class UserRead(UserBase):
    user_id: int

    class Config:
        orm_mode = True


# === GROUP ===

class GroupBase(BaseModel):
    group_name: str


class GroupCreate(GroupBase):
    pass


class GroupRead(GroupBase):
    group_id: int
    group_id_user: Optional[List[UserRead]] = []
    g2p: Optional[List["GroupToProgRead"]] = []

    class Config:
        orm_mode = True


# === G2P (Group_to_Prog) ===

class GroupToProgBase(BaseModel):
    group_id: int
    program_id: int


class GroupToProgCreate(GroupToProgBase):
    pass


class GroupToProgRead(GroupToProgBase):
    relation_id: int
    program: Optional[ProgramRead]
    group: Optional[GroupRead]

    class Config:
        orm_mode = True


# === ACCESS ROLES ===

class AccessBase(BaseModel):
    role_name: str
    read_and_download_lessons: bool
    generating_report: bool
    voting: bool
    checking_marks: bool
    give_marks: bool


class AccessCreate(AccessBase):
    pass


class AccessRead(AccessBase):
    role_id: int

    class Config:
        orm_mode = True

# Для обновления пользователя
class UserUpdate(BaseModel):
    user_name: Optional[str] = None
    user_phone: Optional[str] = None
    user_email: Optional[EmailStr] = None
    user_group_id: Optional[int] = None

# Для обновления программы
class ProgramUpdate(BaseModel):
    program_name: Optional[str] = None

# Для вложенных ссылок (forward references)
GroupRead.update_forward_refs()
GroupToProgRead.update_forward_refs()
