from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.ext.asyncio import AsyncAttrs
from sqlalchemy import Integer, String, ForeignKey, Text, Boolean
from typing import List

from db.engine import Base


class Program(Base):
    """
    Представляет образовательную программу.

    Атрибуты:
        program_id (int): Уникальный идентификатор программы.
        program_name (str): Название программы.
        p2g (List[Group_to_Prog]): Связь с группами через промежуточную таблицу.
    """
    __tablename__ = 'programs'

    program_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    program_name: Mapped[str] = mapped_column(String(24))

    p2g: Mapped[List['Group_to_Prog']] = relationship(back_populates='program')


class User(Base):
    """
    Представляет пользователя системы (например, студента или преподавателя).

    Атрибуты:
        user_id (int): Уникальный идентификатор пользователя.
        user_name (str): Имя пользователя.
        user_phone (str): Уникальный номер телефона.
        user_email (str): Уникальный email.
        user_password (str): Пароль пользователя.
        user_group_id (int): ID группы, к которой относится пользователь.
        user_to_group (List[Group]): Связь с моделью группы.
    """
    __tablename__ = 'users'

    user_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_name: Mapped[str] = mapped_column(String(100))
    user_phone: Mapped[str] = mapped_column(String(15), unique=True)
    user_email: Mapped[str] = mapped_column(String(40), unique=True)
    user_password: Mapped[int] = mapped_column(String(20))
    user_group_id: Mapped[str] = mapped_column(Integer(), ForeignKey('groups.group_id'))

    user_to_group: Mapped[List['Group']] = relationship(back_populates='group_id_user')


class Group(Base):
    """
    Представляет учебную группу.

    Атрибуты:
        group_id (int): Уникальный идентификатор группы.
        group_name (str): Название группы.
        group_id_user (User): Связанные пользователи.
        g2p (List[Group_to_Prog]): Программы, связанные с группой.
    """
    __tablename__ = 'groups'

    group_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    group_name: Mapped[str] = mapped_column(String(18), unique=True)

    group_id_user: Mapped['User'] = relationship('User', back_populates='user_to_group')
    g2p: Mapped[List['Group_to_Prog']] = relationship(back_populates='group')


class Group_to_Prog(Base):
    """
    Промежуточная таблица для связи групп и программ (многие ко многим).

    Атрибуты:
        relation_id (int): Уникальный идентификатор записи.
        group_id (int): ID связанной группы.
        program_id (int): ID связанной программы.
        program (Program): Объект связанной программы.
        group (Group): Объект связанной группы.
    """
    __tablename__ = 'g2p'

    relation_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    group_id: Mapped[int] = mapped_column(Integer(), ForeignKey('groups.group_id'))
    program_id: Mapped[int] = mapped_column(Integer(), ForeignKey('programs.program_id'))

    program: Mapped['Program'] = relationship('Program', back_populates='p2g')
    group: Mapped['Group'] = relationship('Group', back_populates='g2p')


class Access(Base):
    """
    Представляет роль доступа с правами в системе.

    Атрибуты:
        role_id (int): Уникальный идентификатор роли.
        role_name (str): Название роли.
        read_and_download_lessons (bool): Право на чтение и скачивание уроков.
        generating_report (bool): Право на генерацию отчетов.
        voting (bool): Право голосовать.
        checking_marks (bool): Право просматривать оценки.
        give_marks (bool): Право выставлять оценки.
    """
    __tablename__ = 'access_roles'

    role_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    role_name: Mapped[str] = mapped_column(String())
    read_and_download_lessons: Mapped[bool] = mapped_column(Boolean())
    generating_report: Mapped[bool] = mapped_column(Boolean())
    voting: Mapped[bool] = mapped_column(Boolean())
    checking_marks: Mapped[bool] = mapped_column(Boolean())
    give_marks: Mapped[bool] = mapped_column(Boolean())
