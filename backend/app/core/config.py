
from pydantic_settings import BaseSettings, SettingsConfigDict
from sqlalchemy.engine import URL


class Settings(BaseSettings):
    postgres_password: str
    jwt_secret_key: str
    database_url: str = ""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    def get_database_url(self) -> URL:
        return URL.create(
            drivername="postgresql+psycopg",
            username="workvault_user",
            password=self.postgres_password,
            host="127.0.0.1",
            port=55432,
            database="workvault",
        )


settings = Settings()
