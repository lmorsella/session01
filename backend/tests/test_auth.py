import jwt
from fastapi.testclient import TestClient

from app.main import (
    ACCESS_TOKEN_EXPIRE_SECONDS,
    ALGORITHM,
    SECRET_KEY,
    app,
)

client = TestClient(app)


def test_token_success_returns_access_and_refresh_tokens() -> None:
    response = client.post("/token", json={"username": "admin", "password": "admin123"})

    assert response.status_code == 200
    payload = response.json()
    assert payload["token_type"] == "bearer"
    assert payload["expires_in"] == ACCESS_TOKEN_EXPIRE_SECONDS
    assert "access_token" in payload
    assert "refresh_token" in payload

    decoded = jwt.decode(payload["access_token"], SECRET_KEY, algorithms=[ALGORITHM])
    assert decoded["sub"] == "admin"
    assert decoded["type"] == "access"


def test_token_rejects_invalid_credentials() -> None:
    response = client.post("/token", json={"username": "admin", "password": "bad"})

    assert response.status_code == 401


def test_refresh_endpoint_returns_new_access_token() -> None:
    login = client.post("/token", json={"username": "admin", "password": "admin123"})
    refresh_token = login.json()["refresh_token"]

    response = client.post("/token/refresh", json={"refresh_token": refresh_token})

    assert response.status_code == 200
    payload = response.json()
    assert payload["expires_in"] == ACCESS_TOKEN_EXPIRE_SECONDS
    decoded = jwt.decode(payload["access_token"], SECRET_KEY, algorithms=[ALGORITHM])
    assert decoded["sub"] == "admin"
    assert decoded["type"] == "access"


def test_refresh_rejects_access_token() -> None:
    login = client.post("/token", json={"username": "admin", "password": "admin123"})
    access_token = login.json()["access_token"]

    response = client.post("/token/refresh", json={"refresh_token": access_token})

    assert response.status_code == 401
