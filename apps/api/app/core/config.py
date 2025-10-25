from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

ENV_PATH = Path(__file__).resolve().parents[2] / "apps" / "api" / ".env"

class Settings(BaseSettings):
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    DATABASE_URL: str 
    CORS_ORIGINS: str = "http://localhost:3000"
    BAYES_C: int = 20

    model_config = SettingsConfigDict(
        env_file=str(ENV_PATH),
        env_file_encoding="utf-8",
    )

settings = Settings()
