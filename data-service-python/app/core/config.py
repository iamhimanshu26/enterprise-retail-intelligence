from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    app_name: str = "Retail Intelligence Data Service"
    app_version: str = "0.1.0"
    environment: str = "development"
    debug: bool = False
    api_v1_prefix: str = "/api/v1"
    log_level: str = "INFO"

    database_url: str = "postgresql://retail_admin:retail_secure_pass@localhost:5432/retail_intelligence"
    backend_url: str = "http://localhost:8080"

    cors_origins: list[str] = ["http://localhost:5173", "http://localhost:8080"]


settings = Settings()
