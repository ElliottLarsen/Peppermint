import pytest
from fastapi.testclient import TestClient
from main import app

client_401 = TestClient(app)


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def test_user():
    return {"username": "testuser", "password": "testpassword"}


@pytest.fixture
def test_user2():
    return {"username": "testuser2", "password": "testpassword2"}


def test_user_register(client):
    """
    User registration endpoint test
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


def test_user_duplicate_username_register(client):
    """
    User duplicate registration endpoint test
    """
    data = {
        "username": "testuser",
        "password1": "testpassword",
        "password2": "testpassword",
        "first_name": "TEST",
        "last_name": "USER",
        "email": "testuser1@testuser.com",
    }
    response = client.post("/peppermint/user/register", json=data)
    assert response.status_code == 409


def test_user_duplicate_email_register(client):
    """
    User duplicate registration endpoint test
    """
    data = {
        "username": "testuser1",
        "password1": "testpassword",
        "password2": "testpassword",
        "first_name": "TEST",
        "last_name": "USER",
        "email": "testuser@testuser.com",
    }
    response = client.post("/peppermint/user/register", json=data)
    assert response.status_code == 409


def test_testuser_login_incorrect_username(client):
    """
    Login test with incorrect username
    """
    test_user = {
        "username": "testuser1",
        "password": "testpassword",
    }
    response = client.post("/peppermint/user/login", data=test_user)
    assert response.status_code == 401


def test_testuser_login_incorrect_password(client):
    """
    Login test with incorrect username
    """
    test_user = {
        "username": "testuser",
        "password": "testpassword1",
    }
    response = client.post("/peppermint/user/login", data=test_user)
    assert response.status_code == 401


def test_testuser_login(client, test_user):
    """
    Login test
    """
    response = client.post("/peppermint/user/login", data=test_user)
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert "token_type" in response.json()
    assert "username" in response.json()

    return response.json()["access_token"]


def test_testuser_get(client, test_user):
    """
    GET /user/ test
    """
    login_response = client.post("/peppermint/user/login", data=test_user)
    access_token = login_response.json()["access_token"]
    response = client.get(
        "/peppermint/user", headers={"Authorization": f"Bearer {access_token}"}
    )
    assert response.status_code == 200
    assert response.json()["username"] == "testuser"
    assert "password" not in response.json()

def test_get_user_all(client):
    """
    Test return all users endpoint
    """
    data01 = {
        "username": "testu1",
        "password1": "testpassword",
        "password2": "testpassword",
        "first_name": "TEST",
        "last_name": "USER",
        "email": "test1@testuser.com",
    }
    data02 = {
        "username": "testu2",
        "password1": "testpassword2",
        "password2": "testpassword2",
        "first_name": "TEST",
        "last_name": "USER2",
        "email": "test2@testuser.com",
    }

    client.post("/peppermint/user/register", json=data01)
    client.post("/peppermint/user/register", json=data02)
    response = client.get("/peppermint/user/all/")

    assert response.status_code == 200
    assert len(response) == 2
    

    


