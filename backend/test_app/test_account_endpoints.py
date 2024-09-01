import pytest
from fastapi.testclient import TestClient
from main import app
import json
from domain.user.user_crud import get_user_by_username, get_user_by_id
from domain.account.account_crud import get_account_by_id
from database import SessionLocal


client_401 = TestClient(app)


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def test_user():
    return {"username": "testuser", "password": "testpassword"}


def test_setup_user(client):
    """
    Register user
    """
    data = {
        "username": "testuser",
        "password1": "testpassword",
        "password2": "testpassword",
        "first_name": "TEST",
        "last_name": "USER",
        "email": "testuser@testuser.com",
    }
    response = client.post("/peppermint/user/register", json=data)
    assert response.status_code == 200
    assert "id" in response.json()
    assert response.json()["username"] == "testuser"
    assert response.json()["first_name"] == "TEST"
    assert response.json()["last_name"] == "USER"
    assert response.json()["email"] == "testuser@testuser.com"


def test_setup_login_user(client, test_user):
    """
    Login user
    """
    response = client.post("/peppermint/user/login", data=test_user)
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert "token_type" in response.json()
    assert "username" in response.json()

    return response.json()["access_token"]


def test_create_account(client, test_user):
    """
    Account create endpoint test
    """
    access_token = test_setup_login_user(client, test_user)
    data = {
        "institution": "testbank",
        "account_type": "checking",
        "current_balance": 100.00,
    }
    response = client.post(
        "/peppermint/account/",
        json=data,
        headers={"Authorization": f"Bearer {access_token}"},
    )

    assert response.status_code == 200
    assert response.json()["institution"] == "testbank"
    assert response.json()["account_type"] == "checking"
    assert response.json()["current_balance"] == 100.00


def test_account_get(client, test_user):
    """
    Get all accounts endpoint test
    """
    access_token = test_setup_login_user(client, test_user)
    response = client.get(
        "/peppermint/account/my_accounts",
        headers={"Authorization": f"Bearer {access_token}"},
    )

    assert response.status_code == 200
    assert len(response.json()) == 1


def test_one_account_get(client, test_user):
    """
    Get one account by id endpoint test
    """
    access_token = test_setup_login_user(client, test_user)
    account_response = client.get(
        "/peppermint/account/my_accounts",
        headers={"Authorization": f"Bearer {access_token}"},
    )
    account = account_response.json()[0]
    account_id = account["id"]

    response = client.get(
        f"/peppermint/account/{account_id}",
        headers={"Authorization": f"Bearer {access_token}"},
    )

    assert response.status_code == 200
    assert response.json()["institution"] == "testbank"
    assert response.json()["account_type"] == "checking"
    assert response.json()["current_balance"] == 100.0


def test_update_account(client, test_user):
    """
    Account update endpoint test
    """
    access_token = test_setup_login_user(client, test_user)
    account_response = client.get(
        "/peppermint/account/my_accounts",
        headers={"Authorization": f"Bearer {access_token}"},
    )
    account = account_response.json()[0]
    account_id = account["id"]
    account_update = {
        "institution": "new_testbank",
        "account_type": "savings",
        "current_balance": 150.09,
    }
    response = client.put(
        f"/peppermint/account/{account_id}",
        headers={"Authorization": f"Bearer {access_token}"},
        json=account_update,
    )

    assert response.status_code == 200
    assert response.json()["institution"] != "testbank"
    assert response.json()["institution"] == "new_testbank"
    assert response.json()["account_type"] != "checking"
    assert response.json()["account_type"] == "savings"
    assert response.json()["current_balance"] != 100.00
    assert response.json()["current_balance"] == 150.09


#  -------------------------------------------------------------------
#  DELETE
#  -------------------------------------------------------------------


def test_account_remove(client, test_user):
    """
    Account remove by id endpoint test
    """
    access_token = test_setup_login_user(client, test_user)
    account_response = client.get(
        "/peppermint/account/my_accounts",
        headers={"Authorization": f"Bearer {access_token}"},
    )
    account = account_response.json()[0]
    account_id = account["id"]

    assert len(account_response.json()) == 1

    response = client.delete(
        f"/peppermint/account/{account_id}",
        headers={"Authorization": f"Bearer {access_token}"},
    )
    check_account_response = client.get(
        "/peppermint/account/my_accounts",
        headers={"Authorization": f"Bearer {access_token}"},
    )
    assert response.status_code == 204
    assert check_account_response.json() is None


def test_delete_setup_users(client, test_user):
    """
    Deletes users created during testing
    """
    access_token = test_setup_login_user(client, test_user)
    db = SessionLocal()
    testuser = get_user_by_username(db, "testuser")

    response = client.delete(
        f"/peppermint/user/{testuser.id}",
        headers={"Authorization": f"Bearer {access_token}"},
    )

    assert response.status_code == 204
