import pytest
from fastapi.testclient import TestClient
from main import app
import json
from domain.user.user_crud import get_user_by_username, get_user_by_id
from domain.budget.budget_crud import get_budget_by_id
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


def test_create_budget(client, test_user):
    access_token = test_setup_login_user(client, test_user)
    data = {
        "budget_category": "Groceries",
        "budget_amount": 100.00,
    }

    response = client.post(
        "/peppermint/budget/",
        json=data,
        headers={"Authorization": f"Bearer {access_token}"},
    )

    assert response.status_code == 200
    assert response.json()["budget_category"] == "Groceries"
    assert response.json()["budget_amount"] == 100.00


def test_budget_get_all(client, test_user):
    access_token = test_setup_login_user(client, test_user)
    response = client.get(
        "/peppermint/budget/my_budgets",
        headers={"Authorization": f"Bearer {access_token}"},
    )
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_budget_get_one(client, test_user):
    access_token = test_setup_login_user(client, test_user)
    budget_response = client.get(
        "/peppermint/budget/my_budgets",
        headers={"Authorization": f"Bearer {access_token}"},
    )

    budget = budget_response.json()[0]
    budget_id = budget["id"]
    response = client.get(
        f"/peppermint/budget/{budget_id}",
        headers={"Authorization": f"Bearer {access_token}"},
    )

    assert response.status_code == 200
    assert response.json()["budget_category"] == "Groceries"
    assert response.json()["budget_amount"] == 100.00


def test_budget_update(client, test_user):
    access_token = test_setup_login_user(client, test_user)
    budget_response = client.get(
        "/peppermint/budget/my_budgets",
        headers={"Authorization": f"Bearer {access_token}"},
    )

    budget = budget_response.json()[0]
    budget_id = budget["id"]
    budget_update = {
        "budget_category": "Shopping",
        "budget_amount": 133.78,
    }

    response = client.put(
        f"/peppermint/budget/{budget_id}",
        headers={"Authorization": f"Bearer {access_token}"},
        json=budget_update,
    )

    assert response.status_code == 200
    assert response.json()["budget_category"] != "Groceries"
    assert response.json()["budget_category"] == "Shopping"
    assert response.json()["budget_amount"] != 100.00
    assert response.json()["budget_amount"] == 133.78


def test_get_current_balances(client, test_user):
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

    transaction_data = {
        "transaction_date": "2025-01-05T19:51:34.898000",
        "transaction_description": "Trader Jo",
        "transaction_category": "groceries",
        "transaction_amount": 100.0,
    }

    client.post(f"/peppermint/{account['id']}", json=transaction_data)

    response = client.get(
        "/peppermint/budget/current_balances",
        headers={"Authorization": f"Bearer {access_token}"},
    )

    assert response.status_code == 200
    assert response.json()["groceries"] == 100.0

    client.delete(
        f"/peppermint/account/{account['id']}",
        headers={"Authorization": f"Bearer {access_token}"},
    )


#  -------------------------------------------------------------------
#  DELETE
#  -------------------------------------------------------------------


def test_budget_remove(client, test_user):
    """
    budget remove by id endpoint test
    """
    access_token = test_setup_login_user(client, test_user)
    new_data = {
        "budget_category": "Gas",
        "budget_amount": 200.00,
    }

    add_new_budget = client.post(
        "/peppermint/budget/",
        json=new_data,
        headers={"Authorization": f"Bearer {access_token}"},
    )

    assert add_new_budget.status_code == 200

    budget_response = client.get(
        "/peppermint/budget/my_budgets",
        headers={"Authorization": f"Bearer {access_token}"},
    )

    assert budget_response.status_code == 200
    assert len(budget_response.json()) == 2

    for budget in budget_response.json():
        budget_id = budget["id"]
        response = client.delete(
            f"/peppermint/budget/{budget_id}",
            headers={"Authorization": f"Bearer {access_token}"},
        )

        assert response.status_code == 204

    check_budget_response = client.get(
        "/peppermint/budget/my_budgets",
        headers={"Authorization": f"Bearer {access_token}"},
    )

    assert check_budget_response.json() is None


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
