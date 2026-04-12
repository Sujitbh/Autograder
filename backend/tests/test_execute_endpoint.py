from fastapi.testclient import TestClient

from app.main import app
from app.api.deps import get_current_user
from app.models.user import User


def _fake_user() -> User:
    return User(
        id=1,
        name="Demo User",
        email="demo@example.com",
        password_hash="x",
        role="instructor",
        is_active=True,
    )


def _client() -> TestClient:
    app.dependency_overrides[get_current_user] = _fake_user
    return TestClient(app)


def _assert_contract_shape(payload: dict) -> None:
    assert set(payload.keys()) == {
        "status",
        "stdout",
        "stderr",
        "exit_code",
        "execution_time_ms",
    }
    assert isinstance(payload["status"], str)
    assert isinstance(payload["stdout"], str)
    assert isinstance(payload["stderr"], str)
    assert isinstance(payload["exit_code"], int)
    assert isinstance(payload["execution_time_ms"], (int, float))


def test_execute_python_stdin_success() -> None:
    client = _client()
    response = client.post(
        "/api/grading/execute",
        json={
            "code": "n=int(input())\nprint(n*2)",
            "language": "python",
            "stdin_input": "21\n",
            "timeout": 5,
        },
    )

    assert response.status_code == 200
    data = response.json()
    _assert_contract_shape(data)
    assert data["status"] == "success"
    assert data["stdout"].strip() == "42"
    assert data["stderr"] == ""
    assert data["exit_code"] == 0



def test_execute_java_non_main_class_success() -> None:
    client = _client()
    java_code = """
import java.util.*;
class Solution {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    int n = sc.nextInt();
    System.out.println(n + 5);
  }
}
"""

    response = client.post(
        "/api/grading/execute",
        json={
            "code": java_code,
            "language": "java",
            "stdin_input": "7\n",
            "timeout": 10,
        },
    )

    assert response.status_code == 200
    data = response.json()
    _assert_contract_shape(data)
    assert data["status"] == "success"
    assert data["stdout"].strip() == "12"
    assert data["exit_code"] == 0



def test_execute_java_compile_error_shape() -> None:
    client = _client()
    response = client.post(
        "/api/grading/execute",
        json={
            "code": "public class Main { public static void main(String[] args){ System.out.println( } }",
            "language": "java",
            "stdin_input": "",
            "timeout": 10,
        },
    )

    assert response.status_code == 200
    data = response.json()
    _assert_contract_shape(data)
    assert data["status"] == "compile_error"
    assert isinstance(data["stderr"], str)
    assert len(data["stderr"]) > 0
    assert data["exit_code"] != 0



def test_execute_timeout_shape() -> None:
    client = _client()
    response = client.post(
        "/api/grading/execute",
        json={
            "code": "while True:\n    pass",
            "language": "python",
            "stdin_input": "",
            "timeout": 1,
        },
    )

    assert response.status_code == 200
    data = response.json()
    _assert_contract_shape(data)
    assert data["status"] == "timeout"
    assert "timed out" in data["stderr"].lower()
    assert data["exit_code"] == -1
