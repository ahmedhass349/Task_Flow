#!/usr/bin/env python3
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
DIST_DIR = ROOT / "dist-phase5"


def cmd(name):
    if sys.platform.startswith("win"):
        return f"{name}.cmd"
    return name


def run_step(name, command):
    print(f"\n[STEP] {name}")
    print(f"[CMD ] {' '.join(command)}")
    result = subprocess.run(command, cwd=ROOT)
    if result.returncode != 0:
        print(f"[FAIL] {name} (exit code {result.returncode})")
        return False
    print(f"[PASS] {name}")
    return True


def ensure_backend_artifacts():
    print("\n[STEP] Verify packaged backend artifacts")
    backend_dir = DIST_DIR / "win-unpacked" / "resources" / "backend"
    exe_path = backend_dir / "taskflow.exe"
    dll_path = backend_dir / "taskflow.dll"

    if not backend_dir.exists():
        print(f"[FAIL] Missing backend directory: {backend_dir}")
        return False

    if exe_path.exists() or dll_path.exists():
        picked = exe_path if exe_path.exists() else dll_path
        print(f"[PASS] Found backend artifact: {picked}")
        return True

    print(f"[FAIL] Missing backend executable artifacts in: {backend_dir}")
    return False


def cleanup_dist():
    if DIST_DIR.exists():
        shutil.rmtree(DIST_DIR, ignore_errors=True)


if __name__ == "__main__":
    print("=" * 60)
    print("Phase 5: Release Readiness Verification")
    print("=" * 60)

    cleanup_dist()

    ok = True
    ok &= run_step("Backend build", ["dotnet", "build", "Task_Flow.sln", "--nologo"])
    ok &= run_step("Web + backend publish", [cmd("npm"), "run", "preelectron-build"])
    ok &= run_step(
        "Electron unpacked package",
        [
            cmd("npx"),
            "electron-builder",
            "--config",
            "electron-builder.json",
            "--dir",
            "--config.directories.output=dist-phase5",
        ],
    )
    ok &= ensure_backend_artifacts()
    ok &= run_step("Functional integration tests", [sys.executable, "phase4_test.py"])

    print("\n" + "=" * 60)
    if ok:
        print("PHASE 5 RESULT: PASS")
        code = 0
    else:
        print("PHASE 5 RESULT: FAIL")
        code = 1
    print("=" * 60)

    cleanup_dist()
    sys.exit(code)
