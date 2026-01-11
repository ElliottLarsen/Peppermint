import pytest
from fastapi.testclient import TestClient
from main import app
import json
from domain.user.user_crud import (
    get_user_by_username, 
    get_user_by_id
)
from domain.transaction.transaction_crud import (
    get_account_transactions_all,
)
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

def test_bad_file_type(client, test_user):
    db = SessionLocal()
    access_token = test_setup_login_user(client, test_user)

    account_response = client.get(
        "/peppermint/account/my_accounts",
        headers={"Authorization": f"Bearer {access_token}"},
    )

    account = account_response.json()[0]

    csv = """
    Trans. Date,Post Date,Description,Amount,Category
    09/24/2025,09/24/2025,"NATIONWIDE PET INS 800-872-7387 CA1380713170000000",62.45,"Merchandise"
    09/23/2025,09/23/2025,"FEDEX OFFIC00012260069 MALVERN PA",2.45,"Services"
    09/23/2025,09/23/2025,"FEDEX OFFIC00012260069 MALVERN PA",9.57,"Services"
    09/23/2025,09/23/2025,"KOHL'S #0277 EXTON PA",56.18,"Department Stores"
    """

    response = client.post(
        f"/peppermint/upload/{account['id']}",
        params={"query":"disco"},
        files ={"file": ("disco_test.csv", csv, "text/plain")},
        headers={"Authorization": f"Bearer {access_token}"},
    )

    assert response.status_code == 400

def test_disco_file_upload(client, test_user):
    db = SessionLocal()
    access_token = test_setup_login_user(client, test_user)

    account_response = client.get(
        "/peppermint/account/my_accounts",
        headers={"Authorization": f"Bearer {access_token}"},
    )

    account = account_response.json()[0]

    path = "/Users/josquin/Desktop/csv_parser/bank statements/Discover-Statement-20250927.csv"
    with open(path, "rb") as infile:
        response = client.post(
            f"/peppermint/upload/{account['id']}",
            params={"query":"disco"},
            files ={"file": ("disco_test.csv", infile, "text/csv")},
            headers={"Authorization": f"Bearer {access_token}"},
        )

    after_upload = get_account_transactions_all(db, account["id"])

    assert response.status_code == 200
    assert len(after_upload) == 21

def test_boa_file_upload(client, test_user):
    db = SessionLocal()
    access_token = test_setup_login_user(client, test_user)

    account_response = client.get(
        "/peppermint/account/my_accounts",
        headers={"Authorization": f"Bearer {access_token}"},
    )

    account = account_response.json()[0]

    path = "/Users/josquin/Desktop/csv_parser/bank statements/boa_check_20251117.csv"
    with open(path, "rb") as infile:
        response = client.post(
            f"/peppermint/upload/{account['id']}",
            params={"query":"boa"},
            files ={"file": ("boa_test.csv", infile, "text/csv")},
            headers={"Authorization": f"Bearer {access_token}"},
        )

    after_upload = get_account_transactions_all(db, account["id"])

    assert response.status_code == 200
    assert len(after_upload) == 43



# ----------------------------------------------------
#  CLEAN UP
# ----------------------------------------------------

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