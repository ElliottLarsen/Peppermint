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


def test_get_all_accounts_by_userid(client, test_user):
    """
    Get all accounts by user id endpoint test
    """
    access_token = test_setup_login_user(client, test_user)
    db = SessionLocal()
    test01 = get_user_by_username(db, "testuser")
    data02 = {
        "institution": "testbank02",
        "account_type": "checking",
        "current_balance": 57.98,
    }
    data03 = {
        "institution": "testbank03",
        "account_type": "savings",
        "current_balance": 86750.70,
    }

    response01 = client.post(
        "/peppermint/account/",
        json=data02,
        headers={"Authorization": f"Bearer {access_token}"},
    )
    response02 = client.post(
        "/peppermint/account/",
        json=data03,
        headers={"Authorization": f"Bearer {access_token}"},
    )

    assert response01.status_code == 200
    assert response02.status_code == 200

    get_response = client.get(
        f"/peppermint/user/{test01.id}/account/",
        headers={"Authorization": f"Bearer {access_token}"},
    )

    assert get_response.status_code == 200
    assert len(get_response.json()) == 3


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


def test_get_account_transactions(client, test_user):
    """
    Get all transactions by account id router test
    """
    access_token = test_setup_login_user(client, test_user)
    data = {
        "institution": "new_testbank",
        "account_type": "checking",
        "current_balance": 0.0,
    }
    account_response = client.post(
        "/peppermint/account/",
        json=data,
        headers={"Authorization": f"Bearer {access_token}"},
    )
    account = account_response.json()
    account_id = account["id"]

    trans_response01 = client.get(
        f"/peppermint/account/{account_id}/transactions",
        headers={"Authorization": f"Bearer {access_token}"},
    )
    assert trans_response01.status_code == 200
    assert trans_response01.json() is None

    transaction_data01 = {
        "transaction_date": "2024-10-09T19:51:34.898000",
        "transaction_amount": 25.0,
    }

    transaction_data02 = {
        "transaction_date": "2024-10-09T19:55:35.898000",
        "transaction_amount": 75.0,
    }

    acct_resp01 = client.post(f"/peppermint/{account_id}", json=transaction_data01)
    assert acct_resp01.status_code == 200

    acct_resp02 = client.post(f"/peppermint/{account_id}", json=transaction_data02)
    assert acct_resp02.status_code == 200

    all_transaction_resp = client.get(
        f"/peppermint/account/{account_id}/transactions",
        headers={"Authorization": f"Bearer {access_token}"},
    )
    assert all_transaction_resp.status_code == 200
    assert len(all_transaction_resp.json()) == 2

    # I was originally going to delete each transaction, but
    # since we already have a router for that in transaction_router
    # and it was causing tests to fail. I removed it and just deleted
    # the temp account

    remove_acct_response = client.delete(
        f"/peppermint/account/{account_id}",
        headers={"Authorization": f"Bearer {access_token}"},
    )

    assert remove_acct_response.status_code == 204


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

    assert len(account_response.json()) == 3

    for account in account_response.json():
        account_id = account["id"]

        response = client.delete(
            f"/peppermint/account/{account_id}",
            headers={"Authorization": f"Bearer {access_token}"},
        )

        assert response.status_code == 204

    check_account_response = client.get(
        "/peppermint/account/my_accounts",
        headers={"Authorization": f"Bearer {access_token}"},
    )

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
