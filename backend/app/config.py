import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "Lost & Found @ SCSU"
    SQLALCHEMY_DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql://postgres:Ball%401234@localhost:5432/lost_found_db",
    )
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "supersecretjwtkey")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day


    ADMIN_SETUP_TOKEN: str = os.getenv("ADMIN_SETUP_TOKEN", "admin-steup")
settings = Settings()
