import pytest
from fastapi.testclient import TestClient
from main import app
from domain.transaction.transaction_crud import (
    get_account_transactions_all,
)
from domain.user.user_crud import get_user_by_username

from database import SessionLocal


client_401 = TestClient(app)


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def test_user():
    return {"username": "testuser", "password": "testpassword"}


@pytest.fixture
def test_account():
    return {
        "id": "0",
        "institution": "testbank",
        "account_type": "checking",
        "current_balance": "0",
    }


def test_setup_user(client):
    """
    Register user for testing
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
    Login user for testing
    """
    response = client.post("/peppermint/user/login", data=test_user)
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert "token_type" in response.json()
    assert "username" in response.json()

    return response.json()["access_token"]


def test_setup_add_account(client, test_user):
    """
    Create account for testing
    """
    db = SessionLocal()
    access_token = test_setup_login_user(client, test_user)
    data = {
        "institution": "testbank",
        "account_type": "checking",
        "current_balance": 0.0,
    }

    response = client.post(
        "/peppermint/account/",
        json=data,
        headers={"Authorization": f"Bearer {access_token}"},
    )

    assert response.status_code == 200


def test_transaction_create(client, test_user):
    """
    Create transaction endpoint test
    """
    access_token = test_setup_login_user(client, test_user)
    account_response01 = client.get(
        "/peppermint/account/my_accounts",
        headers={"Authorization": f"Bearer {access_token}"},
    )

    account = account_response01.json()[0]

    transaction_data = {
        "transaction_date": "2024-09-29T19:51:34.898000",
        "transaction_description": "Trader Jo",
        "transaction_category": "Groceries",
        "transaction_amount": 100.0,
    }

    response = client.post(f"/peppermint/{account['id']}", json=transaction_data)

    account_response02 = client.get(
        "/peppermint/account/my_accounts",
        headers={"Authorization": f"Bearer {access_token}"},
    )

    account_check = account_response02.json()[0]

    assert response.status_code == 200
    assert response.json()["transaction_date"] == "2024-09-29T19:51:34.898000"
    assert response.json()["transaction_description"] == "Trader Jo"
    assert response.json()["transaction_category"] == "Groceries"
    assert "transaction_amount" in response.json()
    assert account_check["current_balance"] == 100.0


def test_one_transaction_get(client, test_user):
    """
    Get one transaction endpoint test
    """
    db = SessionLocal()
    access_token = test_setup_login_user(client, test_user)
    account_response01 = client.get(
        "/peppermint/account/my_accounts",
        headers={"Authorization": f"Bearer {access_token}"},
    )

    account = account_response01.json()[0]

    before_transaction = get_account_transactions_all(db, account["id"])

    new_transaction_data = {
        "transaction_date": "2024-10-01T19:51:34.898000",
        "transaction_description": "Whole Fud",
        "transaction_category": "Groceries",
        "transaction_amount": 25.0,
    }

    response = client.post(f"/peppermint/{account['id']}", json=new_transaction_data)

    transaction_id = response.json()["id"]
    account_response02 = client.get(
        "/peppermint/account/my_accounts",
        headers={"Authorization": f"Bearer {access_token}"},
    )

    transaction_response = client.get(f"/peppermint/{account['id']}/{transaction_id}")

    account_check = account_response02.json()[0]
    after_transaction = get_account_transactions_all(db, account["id"])

    assert transaction_response.status_code == 200
    assert len(before_transaction) == 1
    assert account["current_balance"] == 100.0
    assert (
        transaction_response.json()["transaction_date"] == "2024-10-01T19:51:34.898000"
    )
    assert transaction_response.json()["transaction_amount"] == 25.0
    assert len(after_transaction) == 2
    assert account_check["current_balance"] == 125.0


def test_update_transaction(client, test_user):
    """
    Transaction PUT test
    """
    db = SessionLocal()
    access_token = test_setup_login_user(client, test_user)
    account_response01 = client.get(
        "/peppermint/account/my_accounts",
        headers={"Authorization": f"Bearer {access_token}"},
    )

    account = account_response01.json()[0]
    transactions = get_account_transactions_all(db, account["id"])

    # transaction[0] = 100, [1] = 25
    transaction_id = transactions[0].id

    assert account["current_balance"] == 125.0
    assert len(transactions) == 2

    update_transaction_data = {
        "transaction_date": "2024-10-03T12:51:34.898000",
        "transaction_description": "Trader Yes",
        "transaction_category": "Gas",
        "transaction_amount": 50.0,
    }
    # update transaction[0]
    update_response = client.put(
        f"/peppermint/{account['id']}/{transaction_id}", json=update_transaction_data
    )
    account_response02 = client.get(
        "/peppermint/account/my_accounts",
        headers={"Authorization": f"Bearer {access_token}"},
    )

    updated_account = account_response02.json()[0]
    assert update_response.status_code == 200
    assert len(transactions) == 2
    assert updated_account["current_balance"] != 125.0
    assert updated_account["current_balance"] == 75.0
    assert update_response.json()[0]["transaction_date"] != "2024-10-01T19:51:34.898000"
    assert update_response.json()[0]["transaction_description"] == "Trader Yes"
    assert update_response.json()[0]["transaction_category"] == "Gas"
    assert update_response.json()[0]["transaction_amount"] == 50.0


# ---------------------------------------------------------
#   DELETE
# ---------------------------------------------------------


def test_transaction_remove(client, test_user):
    """
    Transaction DELETE test
    """
    db = SessionLocal()
    access_token = test_setup_login_user(client, test_user)
    account_response01 = client.get(
        "/peppermint/account/my_accounts",
        headers={"Authorization": f"Bearer {access_token}"},
    )

    account = account_response01.json()[0]
    transactions = get_account_transactions_all(db, account["id"])

    assert account["current_balance"] == 75.0
    assert len(transactions) == 2

    for transaction in transactions:
        remove_response = client.delete(
            f"/peppermint/{account['id']}/{transaction.id}",
        )

    assert remove_response.status_code == 204

    check_account_response = client.get(
        "/peppermint/account/my_accounts",
        headers={"Authorization": f"Bearer {access_token}"},
    )
    check_account = check_account_response.json()[0]
    check_transacations = get_account_transactions_all(db, check_account["id"])

    assert check_transacations is None
    assert check_account["current_balance"] == 0.0


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
