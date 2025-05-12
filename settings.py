from pydantic_settings import BaseSettings


class Setting(BaseSettings):
    # App settings
    SECRET_KEY: str
    DEBUG: bool

    # Database settings
    DB_HOST: str
    DB_PORT: int
    DB_USER: str
    DB_PASSWORD: str
    DB_NAME: str

    class Config:
        env_file = ".env"


settings = Setting()
