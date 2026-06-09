from datetime import UTC, datetime, timedelta
import os

import jwt
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "change-this-in-production-secret-key-32")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_SECONDS = 300
REFRESH_TOKEN_EXPIRE_SECONDS = 900
VALID_USERNAME = "admin"
VALID_PASSWORD = "admin123"

app = FastAPI(title="JWT Backend API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        o.strip()
        for o in os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")
        if o.strip()
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class LoginRequest(BaseModel):
    username: str
    password: str


class RefreshRequest(BaseModel):
    refresh_token: str


def _create_token(subject: str, expires_delta: timedelta, token_type: str) -> str:
    now = datetime.now(UTC)
    payload = {
        "sub": subject,
        "type": token_type,
        "iat": now,
        "exp": now + expires_delta,
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


@app.post("/token")
def create_token(data: LoginRequest) -> dict[str, str | int]:
    if data.username != VALID_USERNAME or data.password != VALID_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = _create_token(
        subject=data.username,
        expires_delta=timedelta(seconds=ACCESS_TOKEN_EXPIRE_SECONDS),
        token_type="access",
    )
    refresh_token = _create_token(
        subject=data.username,
        expires_delta=timedelta(seconds=REFRESH_TOKEN_EXPIRE_SECONDS),
        token_type="refresh",
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": ACCESS_TOKEN_EXPIRE_SECONDS,
        "refresh_token": refresh_token,
    }


@app.post("/token/refresh")
def refresh_token(data: RefreshRequest) -> dict[str, str | int]:
    try:
        payload = jwt.decode(data.refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.PyJWTError as exc:
        raise HTTPException(status_code=401, detail="Invalid refresh token") from exc

    if payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid token type")

    subject = payload.get("sub")
    if not subject:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    access_token = _create_token(
        subject=subject,
        expires_delta=timedelta(seconds=ACCESS_TOKEN_EXPIRE_SECONDS),
        token_type="access",
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": ACCESS_TOKEN_EXPIRE_SECONDS,
    }
