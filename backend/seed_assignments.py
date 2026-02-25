"""
Seed assignments, test cases, and rubrics for the Data Structure course (id=1).
Run with: ./.venv/bin/python seed_assignments.py
"""
import sys
sys.path.insert(0, '.')

from datetime import datetime, timedelta, timezone
from app.core.database import SessionLocal
from app.models.assignment import Assignment
from app.models.testcase import TestCase
from app.models.rubric import Rubric

db = SessionLocal()

def seed():
    COURSE_ID = 1   # Data structure / CSCI 4060

    # ── Assignment 1: Hello World ─────────────────────────────────────
    a1 = Assignment(
        course_id=COURSE_ID,
        title="Hello World",
        description="Write a Python or Java program that prints exactly: Hello, World!\n\nThis is a warm-up to verify your submission pipeline works.",
        due_date=datetime.now(timezone.utc) + timedelta(days=7),
        allowed_languages="python,java",
        is_active=True,
    )
    db.add(a1); db.flush()

    db.add_all([
        TestCase(assignment_id=a1.id, name="Basic print", input_data="", expected_output="Hello, World!", is_public=True, points=10),
        TestCase(assignment_id=a1.id, name="No extra whitespace", input_data="", expected_output="Hello, World!", is_public=True, points=10),
        TestCase(assignment_id=a1.id, name="Hidden: exact match", input_data="", expected_output="Hello, World!", is_public=False, points=5),
    ])
    db.add_all([
        Rubric(assignment_id=a1.id, name="Correct Output", description="Program prints exactly 'Hello, World!'", max_points=15, order=1),
        Rubric(assignment_id=a1.id, name="Code Style", description="Variable names are meaningful, code is readable", max_points=5, order=2),
    ])

    # ── Assignment 2: FizzBuzz ────────────────────────────────────────
    a2 = Assignment(
        course_id=COURSE_ID,
        title="FizzBuzz",
        description=(
            "Print numbers from 1 to N (read from stdin).\n"
            "- If divisible by 3 → print Fizz\n"
            "- If divisible by 5 → print Buzz\n"
            "- If divisible by both → print FizzBuzz\n"
            "- Otherwise → print the number\n\n"
            "Each on its own line."
        ),
        due_date=datetime.now(timezone.utc) + timedelta(days=14),
        allowed_languages="python,java",
        is_active=True,
    )
    db.add(a2); db.flush()

    db.add_all([
        TestCase(assignment_id=a2.id, name="N=5", input_data="5",
                 expected_output="1\n2\nFizz\n4\nBuzz", is_public=True, points=10),
        TestCase(assignment_id=a2.id, name="N=15", input_data="15",
                 expected_output="1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz",
                 is_public=True, points=15),
        TestCase(assignment_id=a2.id, name="N=1", input_data="1",
                 expected_output="1", is_public=True, points=5),
        TestCase(assignment_id=a2.id, name="Hidden: N=20", input_data="20",
                 expected_output="1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz\n16\n17\nFizz\n19\nBuzz",
                 is_public=False, points=20),
    ])
    db.add_all([
        Rubric(assignment_id=a2.id, name="Divisible by 3 → Fizz", description="Correctly identifies multiples of 3", max_points=15, order=1),
        Rubric(assignment_id=a2.id, name="Divisible by 5 → Buzz", description="Correctly identifies multiples of 5", max_points=15, order=2),
        Rubric(assignment_id=a2.id, name="Divisible by 15 → FizzBuzz", description="Handles the combined case correctly", max_points=15, order=3),
        Rubric(assignment_id=a2.id, name="Correct Range", description="Iterates from 1 to N inclusive", max_points=5, order=4),
    ])

    # ── Assignment 3: Sum of Two Numbers ─────────────────────────────
    a3 = Assignment(
        course_id=COURSE_ID,
        title="Sum of Two Numbers",
        description=(
            "Read two integers from stdin (one per line) and print their sum.\n\n"
            "Example:\nInput:\n3\n7\nOutput:\n10"
        ),
        due_date=datetime.now(timezone.utc) + timedelta(days=21),
        allowed_languages="python,java,cpp",
        is_active=True,
    )
    db.add(a3); db.flush()

    db.add_all([
        TestCase(assignment_id=a3.id, name="3 + 7", input_data="3\n7", expected_output="10", is_public=True, points=10),
        TestCase(assignment_id=a3.id, name="0 + 0", input_data="0\n0", expected_output="0", is_public=True, points=10),
        TestCase(assignment_id=a3.id, name="-5 + 3", input_data="-5\n3", expected_output="-2", is_public=True, points=10),
        TestCase(assignment_id=a3.id, name="Hidden: large numbers", input_data="999999\n1", expected_output="1000000", is_public=False, points=20),
    ])
    db.add_all([
        Rubric(assignment_id=a3.id, name="Correct Addition", description="Computes a + b correctly", max_points=20, order=1),
        Rubric(assignment_id=a3.id, name="Handles Negatives", description="Works with negative integers", max_points=10, order=2),
        Rubric(assignment_id=a3.id, name="Input Parsing", description="Correctly reads two integers from stdin", max_points=10, order=3),
        Rubric(assignment_id=a3.id, name="Code Clarity", description="Clean, readable code with no unnecessary complexity", max_points=10, order=4),
    ])

    # ── Assignment 4: Palindrome Check ───────────────────────────────
    a4 = Assignment(
        course_id=COURSE_ID,
        title="Palindrome Check",
        description=(
            "Read a string from stdin and print True if it is a palindrome, False otherwise.\n"
            "Ignore case and spaces.\n\n"
            "Examples:\n"
            "  racecar → True\n"
            "  hello → False\n"
            "  A man a plan a canal Panama → True"
        ),
        due_date=datetime.now(timezone.utc) + timedelta(days=28),
        allowed_languages="python,java",
        is_active=True,
    )
    db.add(a4); db.flush()

    db.add_all([
        TestCase(assignment_id=a4.id, name="racecar", input_data="racecar", expected_output="True", is_public=True, points=10),
        TestCase(assignment_id=a4.id, name="hello", input_data="hello", expected_output="False", is_public=True, points=10),
        TestCase(assignment_id=a4.id, name="Panama sentence", input_data="A man a plan a canal Panama", expected_output="True", is_public=True, points=15),
        TestCase(assignment_id=a4.id, name="Single char", input_data="z", expected_output="True", is_public=True, points=5),
        TestCase(assignment_id=a4.id, name="Hidden: mixed case", input_data="Madam", expected_output="True", is_public=False, points=15),
        TestCase(assignment_id=a4.id, name="Hidden: not palindrome", input_data="python", expected_output="False", is_public=False, points=15),
    ])
    db.add_all([
        Rubric(assignment_id=a4.id, name="Basic Palindrome Detection", description="Correctly identifies simple palindromes", max_points=20, order=1),
        Rubric(assignment_id=a4.id, name="Case Insensitive", description="Treats 'Madam' and 'madam' the same", max_points=15, order=2),
        Rubric(assignment_id=a4.id, name="Space Handling", description="Ignores spaces when checking palindrome", max_points=15, order=3),
        Rubric(assignment_id=a4.id, name="Algorithm Efficiency", description="O(n) or better time complexity", max_points=10, order=4),
        Rubric(assignment_id=a4.id, name="Edge Cases", description="Handles single character, empty string", max_points=5, order=5),
    ])

    db.commit()
    print("✅ Seeded 4 assignments with test cases and rubrics for course 1 (Data structure / CSCI 4060)")
    print(f"   Assignment IDs: {a1.id}, {a2.id}, {a3.id}, {a4.id}")

try:
    seed()
except Exception as e:
    db.rollback()
    print(f"❌ Error: {e}")
    raise
finally:
    db.close()
