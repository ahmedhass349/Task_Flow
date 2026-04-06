#!/usr/bin/env python3
import queue
import re
import subprocess
import threading
import time
import os
from pathlib import Path

import requests

results = []
backend_url = None


def _safe_json(response):
    try:
        return response.json()
    except Exception:
        return None


def _extract_token(payload):
    if not isinstance(payload, dict):
        return None

    candidates = [
        payload.get("Token"),
        payload.get("token"),
        payload.get("Data", {}).get("Token") if isinstance(payload.get("Data"), dict) else None,
        payload.get("data", {}).get("token") if isinstance(payload.get("data"), dict) else None,
    ]

    for token in candidates:
        if token:
            return token
    return None


def _extract_id(payload):
    if not isinstance(payload, dict):
        return None

    data = payload.get("Data")
    if isinstance(data, dict) and data.get("Id") is not None:
        return data.get("Id")

    data2 = payload.get("data")
    if isinstance(data2, dict) and data2.get("id") is not None:
        return data2.get("id")

    if payload.get("Id") is not None:
        return payload.get("Id")
    if payload.get("id") is not None:
        return payload.get("id")
    return None


def _stream_output(proc, output_queue):
    for line in iter(proc.stdout.readline, ""):
        output_queue.put(line.rstrip())
    proc.stdout.close()

print("=" * 50)
print("Phase 4: Functional Integration Testing")
print("=" * 50)
print()

# Start backend
print("Starting backend (waiting up to 60 seconds)...")
backend_env = os.environ.copy()
backend_env["ASPNETCORE_ENVIRONMENT"] = "Production"

backend_proc = subprocess.Popen(
    ["dotnet", "run", "--project", "TaskFlow.csproj", "--no-launch-profile"],
    stdout=subprocess.PIPE,
    stderr=subprocess.STDOUT,
    universal_newlines=True,
    bufsize=1,
    env=backend_env,
)

output_queue = queue.Queue()
reader_thread = threading.Thread(target=_stream_output, args=(backend_proc, output_queue), daemon=True)
reader_thread.start()

deadline = time.time() + 60
last_wait_second = -1

while time.time() < deadline and backend_url is None:
    if backend_proc.poll() is not None:
        break

    try:
        line = output_queue.get(timeout=1)
    except queue.Empty:
        waited = int(60 - (deadline - time.time()))
        if waited % 5 == 0 and waited != last_wait_second:
            last_wait_second = waited
            print(f"  Waiting... ({waited}/60)")
        continue

    if "TASKFLOW_DB_READY" in line:
        print("  [backend] TASKFLOW_DB_READY")

    match = re.search(r"TASKFLOW_BACKEND_READY:(.*)", line)
    if match:
        backend_url = match.group(1).strip()
        break

if not backend_url:
    print("✗ Backend failed to start after 60 seconds")
    results.append("Backend: FAIL")
    backend_proc.terminate()
    print("\nTest Results:")
    for result in results:
        print(f"  {result}")
    print("=" * 50)
    exit(1)

BASE_URL = backend_url
print(f"✓ Backend detected at {BASE_URL}")
results.append(f"Backend Health: PASS")
print()

# Test 2: User Registration
print("Test 2: User Registration")
test_stamp = int(time.time())
test_email = f"phase4_{test_stamp}@example.com"
test_password = "Test@1234"

try:
    reg_data = {
        "fullName": "Phase Four User",
        "email": test_email,
        "password": test_password,
        "confirmPassword": test_password,
    }
    resp = requests.post(f"{BASE_URL}/api/auth/register", json=reg_data, timeout=5)
    body = _safe_json(resp)
    if resp.status_code in [200, 201]:
        print("✓ Registration successful")
        results.append("Registration: PASS")
    elif resp.status_code == 409:
        print("✓ Registration skipped (user already exists)")
        results.append("Registration: PASS")
    else:
        print(f"✗ Registration failed (status: {resp.status_code})")
        if body is not None:
            print(f"  Response: {body}")
        results.append("Registration: FAIL")
except Exception as e:
    print(f"✗ Registration error: {e}")
    results.append("Registration: FAIL")

# Test 3: User Login
print("\nTest 3: User Login")
jwt_token = None
try:
    login_data = {
        "email": test_email,
        "password": test_password,
    }
    resp = requests.post(f"{BASE_URL}/api/auth/login", json=login_data, timeout=5)
    body = _safe_json(resp)
    if resp.status_code == 200:
        jwt_token = _extract_token(body)
        if jwt_token:
            print("✓ Login successful, JWT token received")
            results.append("Login: PASS")
        else:
            print("✗ Login response did not include a token")
            if body is not None:
                print(f"  Response: {body}")
            results.append("Login: FAIL")
    else:
        print(f"✗ Login failed (status: {resp.status_code})")
        if body is not None:
            print(f"  Response: {body}")
        results.append("Login: FAIL")
except Exception as e:
    print(f"✗ Login error: {e}")
    results.append("Login: FAIL")

# Test 4: Create Project (required for task validation)
project_id = None
if jwt_token:
    print("\nTest 4: Project Creation")
    try:
        headers = {"Authorization": f"Bearer {jwt_token}"}
        project_data = {
            "name": f"Phase4 Project {test_stamp}",
            "description": "Functional integration project",
            "color": "#3B82F6",
        }
        resp = requests.post(f"{BASE_URL}/api/projects", json=project_data, headers=headers, timeout=5)
        body = _safe_json(resp)
        if resp.status_code in [200, 201]:
            project_id = _extract_id(body)
            if project_id:
                print(f"✓ Project created (ID: {project_id})")
                results.append("Project Creation: PASS")
            else:
                print("✗ Project created but ID was not returned")
                if body is not None:
                    print(f"  Response: {body}")
                results.append("Project Creation: FAIL")
        else:
            print(f"✗ Project creation failed (status: {resp.status_code})")
            if body is not None:
                print(f"  Response: {body}")
            results.append("Project Creation: FAIL")
    except Exception as e:
        print(f"✗ Project creation error: {e}")
        results.append("Project Creation: FAIL")
else:
    print("\nTest 4: Project Creation - SKIPPED")
    print("✓ Skipped (login unsuccessful)")
    results.append("Project Creation: SKIPPED")

# Test 5: Task Creation
if jwt_token and project_id:
    print("\nTest 5: Task Creation")
    try:
        headers = {"Authorization": f"Bearer {jwt_token}"}
        task_data = {
            "title": f"Phase 4 Task {test_stamp}",
            "description": "Functional integration test",
            "projectId": project_id,
            "priority": "Medium",
            "status": "Todo",
        }
        resp = requests.post(f"{BASE_URL}/api/tasks", json=task_data, headers=headers, timeout=5)
        body = _safe_json(resp)
        if resp.status_code not in [200, 201]:
            # Some serializer setups require enum numeric values.
            task_data["priority"] = 1
            task_data["status"] = 0
            resp = requests.post(f"{BASE_URL}/api/tasks", json=task_data, headers=headers, timeout=5)
            body = _safe_json(resp)

        if resp.status_code in [200, 201]:
            print("✓ Task created successfully")
            results.append("Task Creation: PASS")
        else:
            print(f"✗ Task creation failed (status: {resp.status_code})")
            if body is not None:
                print(f"  Response: {body}")
            results.append("Task Creation: FAIL")
    except Exception as e:
        print(f"✗ Task creation error: {e}")
        results.append("Task Creation: FAIL")
else:
    print("\nTest 5: Task Creation - SKIPPED")
    print("✓ Skipped (login/project creation unsuccessful)")
    results.append("Task Creation: SKIPPED")

# Test 6: Database Persistence
print("\nTest 6: SQLite Database Persistence")
db_path = Path(os.path.expandvars(r"%LOCALAPPDATA%\TaskFlow\taskflow.db"))
if db_path.exists():
    db_size_kb = db_path.stat().st_size / 1024
    print(f"✓ Database exists ({db_size_kb:.1f} KB)")
    results.append("Database: PASS")
else:
    print(f"✗ Database file not found at {db_path}")
    results.append("Database: FAIL")

# Summary
print("\n" + "=" * 50)
print("Test Results Summary:")
for result in results:
    print(f"  {result}")
print("=" * 50)

# Cleanup
print("\nCleaning up...")
backend_proc.terminate()
try:
    backend_proc.wait(timeout=5)
except subprocess.TimeoutExpired:
    backend_proc.kill()
print("Phase 4 testing complete.")

failed = [r for r in results if r.endswith(": FAIL")]
if failed:
    exit(1)

exit(0)
