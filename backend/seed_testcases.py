"""
Test Case Seeder / Preloader (CLI)
====================================
Preload test cases into the Autograder database from a file or interactively.

Usage:
    # List existing test cases
    python backend/seed_testcases.py --assignment-id 4 --list

    # Import from JSON file
    python backend/seed_testcases.py --assignment-id 4 --file testcases.json

    # Import from CSV file
    python backend/seed_testcases.py --assignment-id 4 --file testcases.csv

    # Interactive entry
    python backend/seed_testcases.py --assignment-id 4 --interactive

    # Clear existing and reload
    python backend/seed_testcases.py --assignment-id 4 --file testcases.json --clear

JSON format:
    [
      {
        "name": "Test Name",
        "input": "stdin input",
        "expected_output": "expected stdout",
        "is_public": true,
        "points": 10,
        "timeout_seconds": 10
      }
    ]

CSV format (header row required):
    name,input,expected_output,is_public,points,timeout_seconds
"""
import sys
import os
import json
import csv
import argparse

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal
from app.models.assignment import Assignment
from app.models.testcase import TestCase


def _parse_bool(val) -> bool:
    if isinstance(val, bool):
        return val
    return str(val).strip().lower() in ("1", "true", "yes", "y")


def list_testcases(db, assignment_id: int):
    a = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not a:
        print(f"❌ Assignment {assignment_id} not found.")
        return
    tcs = db.query(TestCase).filter(TestCase.assignment_id == assignment_id).all()
    print(f"\n  Assignment: {a.title}  (id={assignment_id})")
    print(f"  {'ID':<6} {'Name':<30} {'Public':<8} {'Points':<8} {'Timeout'}")
    print("  " + "-" * 62)
    for tc in tcs:
        vis = "yes" if tc.is_public else "no"
        print(f"  {tc.id:<6} {(tc.name or '')[:29]:<30} {vis:<8} {tc.points:<8} {tc.timeout_seconds}s")
    print(f"\n  Total: {len(tcs)} test case(s)\n")


def load_json(path: str) -> list:
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
    if not isinstance(data, list):
        raise ValueError("JSON must be a top-level list.")
    return data


def load_csv(path: str) -> list:
    with open(path, encoding="utf-8", newline="") as f:
        return list(csv.DictReader(f))


def load_interactive() -> list:
    rows = []
    print("\nInteractive mode. Type 'done' as the test name to finish.\n")
    while True:
        name = input("  Test name (or 'done'): ").strip()
        if name.lower() == "done":
            break
        print("  Stdin input (blank line to end):")
        inp = "\n".join(iter(input, ""))
        print("  Expected output (blank line to end):")
        exp = "\n".join(iter(input, ""))
        pub_raw = input("  Public? (y/n) [y]: ").strip() or "y"
        pts_raw = input("  Points [10]: ").strip() or "10"
        tmo_raw = input("  Timeout seconds [10]: ").strip() or "10"
        rows.append({"name": name, "input": inp, "expected_output": exp,
                     "is_public": pub_raw, "points": int(pts_raw), "timeout_seconds": int(tmo_raw)})
        print(f"  ✅ Added '{name}'\n")
    return rows


def seed(db, assignment_id: int, rows: list, clear: bool = False) -> int:
    a = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not a:
        print(f"❌ Assignment {assignment_id} not found.")
        return 0
    if clear:
        n = db.query(TestCase).filter(TestCase.assignment_id == assignment_id).delete()
        db.commit()
        print(f"  🗑  Removed {n} existing test case(s).")
        existing = set()
    else:
        existing = {tc.name for tc in db.query(TestCase).filter(TestCase.assignment_id == assignment_id).all()}

    created = 0
    for row in rows:
        name = str(row.get("name", "")).strip()
        if not name or (name in existing):
            print(f"  ⚠️  Skipping '{name}'" + (" (duplicate)" if name in existing else " (no name)"))
            continue
        tc = TestCase(
            assignment_id=assignment_id,
            name=name,
            input_data=str(row.get("input", row.get("input_data", ""))),
            expected_output=str(row.get("expected_output", row.get("expected", ""))),
            is_public=_parse_bool(row.get("is_public", True)),
            points=int(row.get("points", 10)),
            timeout_seconds=int(row.get("timeout_seconds", row.get("timeout", 10))),
        )
        db.add(tc)
        existing.add(name)
        vis = "public" if tc.is_public else "private"
        print(f"  ✅ [{vis}] '{name}'  ({tc.points} pts)")
        created += 1
    db.commit()
    return created


def main():
    parser = argparse.ArgumentParser(description="Preload test cases into Autograder DB.")
    parser.add_argument("--assignment-id", type=int, required=True)
    g = parser.add_mutually_exclusive_group()
    g.add_argument("--file", type=str, help="JSON or CSV file path")
    g.add_argument("--interactive", action="store_true")
    g.add_argument("--list", action="store_true")
    parser.add_argument("--clear", action="store_true", help="Delete existing before import")
    args = parser.parse_args()

    db = SessionLocal()
    try:
        if args.list or (not args.file and not args.interactive):
            list_testcases(db, args.assignment_id)
            if not args.list:
                print("Tip: use --file <path> or --interactive to add test cases.")
            return

        if args.file:
            if not os.path.exists(args.file):
                print(f"❌ File not found: {args.file}"); sys.exit(1)
            ext = os.path.splitext(args.file)[1].lower()
            rows = load_json(args.file) if ext == ".json" else load_csv(args.file)
        else:
            rows = load_interactive()

        if not rows:
            print("Nothing to import."); return

        print(f"\nImporting {len(rows)} test case(s) → assignment {args.assignment_id} …")
        n = seed(db, args.assignment_id, rows, clear=args.clear)
        print(f"\n✅ Done — {n} test case(s) added.\n")
    except KeyboardInterrupt:
        print("\nAborted.")
    except Exception as e:
        db.rollback()
        print(f"\n❌ {e}")
        import traceback; traceback.print_exc()
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    main()

