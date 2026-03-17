"""
Demo Data Seed Script
=====================
Creates a complete demo dataset for the Autograder:
  - 12 students (ULM warhawks domain)
  - Uses course "Data Structure" (CSCI 2270, course_id=6)
  - 2 assignments: Python FizzBuzz (weighted rubric) + Java Calculator (unweighted rubric)
  - Test cases for each assignment
  - Rubric criteria for each assignment
  - Varied submission records across students (graded, pending, missing)

Usage:
    python backend/seed_demo_data.py

Works with existing DB and won't duplicate records (idempotent).
"""
import sys
import os
import random
from datetime import datetime, timedelta

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.core.security import hash_password
from app.models.user import User
from app.models.course import Course
from app.models.enrollment import Enrollment
from app.models.assignment import Assignment
from app.models.testcase import TestCase
from app.models.rubric import Rubric
from app.models.submission import Submission
from app.models.submission_file import SubmissionFile
from app.models.submission_result import SubmissionResult

# ── Demo students ─────────────────────────────────────────────────────────────
DEMO_STUDENTS = [
    {"name": "Emma Johnson",     "email": "ejohnson@warhawks.ulm.edu",  "sis": "10000001"},
    {"name": "Lucas Williams",   "email": "lwilliams@warhawks.ulm.edu", "sis": "10000002"},
    {"name": "Olivia Brown",     "email": "obrown@warhawks.ulm.edu",    "sis": "10000003"},
    {"name": "Noah Davis",       "email": "ndavis@warhawks.ulm.edu",    "sis": "10000004"},
    {"name": "Ava Martinez",     "email": "amartinez@warhawks.ulm.edu", "sis": "10000005"},
    {"name": "Ethan Wilson",     "email": "ewilson@warhawks.ulm.edu",   "sis": "10000006"},
    {"name": "Isabella Moore",   "email": "imoore@warhawks.ulm.edu",    "sis": "10000007"},
    {"name": "Liam Taylor",      "email": "ltaylor@warhawks.ulm.edu",   "sis": "10000008"},
    {"name": "Sophia Anderson",  "email": "sanderson@warhawks.ulm.edu", "sis": "10000009"},
    {"name": "Mason Thomas",     "email": "mthomas@warhawks.ulm.edu",   "sis": "10000010"},
    {"name": "Charlotte Jackson","email": "cjackson@warhawks.ulm.edu",  "sis": "10000011"},
    {"name": "Aiden White",      "email": "awhite@warhawks.ulm.edu",    "sis": "10000012"},
]

STUDENT_PASSWORD = "Student@123"

# ── Python FizzBuzz starter code / sample solutions ───────────────────────────
PYTHON_GOOD = """\
# FizzBuzz - iterates 1..n and prints:
#   "FizzBuzz" if divisible by both 3 and 5
#   "Fizz"     if divisible by 3
#   "Buzz"     if divisible by 5
#   the number otherwise

def fizzbuzz(n):
    for i in range(1, n + 1):
        if i % 15 == 0:
            print("FizzBuzz")
        elif i % 3 == 0:
            print("Fizz")
        elif i % 5 == 0:
            print("Buzz")
        else:
            print(i)

n = int(input())
fizzbuzz(n)
"""

PYTHON_PARTIAL = """\
n = int(input())
for i in range(1, n + 1):
    if i % 3 == 0:
        print("Fizz")
    elif i % 5 == 0:
        print("Buzz")
    else:
        print(i)
"""

# ── Java Calculator starter code / sample solutions ───────────────────────────
JAVA_GOOD = """\
import java.util.Scanner;

/**
 * Simple Calculator
 * Supports: add, sub, mul, div
 * Input format: <op> <a> <b>
 */
public class Calculator {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String op = sc.next();
        int a = sc.nextInt();
        int b = sc.nextInt();

        switch (op) {
            case "add": System.out.println(a + b); break;
            case "sub": System.out.println(a - b); break;
            case "mul": System.out.println(a * b); break;
            case "div":
                if (b == 0) { System.out.println("Error: division by zero"); }
                else        { System.out.println(a / b); }
                break;
            default: System.out.println("Unknown operation");
        }
    }
}
"""

JAVA_PARTIAL = """\
import java.util.Scanner;
public class Calculator {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String op = sc.next();
        int a = sc.nextInt();
        int b = sc.nextInt();
        if (op.equals("add")) System.out.println(a + b);
        else if (op.equals("sub")) System.out.println(a - b);
        else System.out.println("?");
    }
}
"""


def get_or_create_user(db: Session, student: dict) -> User:
    user = db.query(User).filter(User.email == student["email"]).first()
    if user:
        # Keep seeded CWID consistent with current 8-digit requirement.
        if user.sis_user_id != student["sis"]:
            user.sis_user_id = student["sis"]
            db.add(user)
            db.flush()
        return user
    user = User(
        name=student["name"],
        email=student["email"],
        password_hash=hash_password(STUDENT_PASSWORD),
        role="student",
        is_active=True,
        sis_user_id=student["sis"],
    )
    db.add(user)
    db.flush()
    print(f"  ✅ Created student: {student['name']} ({student['email']})")
    return user


def enroll_if_missing(db: Session, course_id: int, user_id: int, role: str = "student"):
    existing = db.query(Enrollment).filter(
        Enrollment.course_id == course_id,
        Enrollment.user_id == user_id,
    ).first()
    if not existing:
        db.add(Enrollment(course_id=course_id, user_id=user_id, role=role))
        db.flush()


def make_submission(
    db: Session,
    assignment: Assignment,
    student: User,
    code: str,
    filename: str,
    status: str,
    score: int | None,
    max_score: int | None,
    feedback: str | None,
    test_passes: list[bool] | None,
    testcases: list[TestCase],
    data_root: str,
) -> Submission:
    """Create a submission record + persists the code file to disk."""
    # Check for existing submission
    existing = db.query(Submission).filter(
        Submission.assignment_id == assignment.id,
        Submission.student_id == student.id,
    ).first()
    if existing:
        return existing

    submitted_at = datetime.utcnow() - timedelta(days=random.randint(0, 5), hours=random.randint(0, 23))

    sub = Submission(
        assignment_id=assignment.id,
        student_id=student.id,
        status=status,
        score=score,
        max_score=max_score,
        feedback=feedback,
        graded_at=submitted_at + timedelta(hours=2) if status == "graded" else None,
        created_at=submitted_at,
    )
    db.add(sub)
    db.flush()

    # Save code file to disk
    folder = os.path.join(
        data_root,
        f"assignment_{assignment.id}",
        student.email,
        f"submission_{sub.id}",
    )
    os.makedirs(folder, exist_ok=True)
    filepath = os.path.join(folder, filename)
    with open(filepath, "w") as f:
        f.write(code)

    # Relative path stored in DB (mirroring existing convention)
    rel_path = os.path.relpath(filepath, os.path.dirname(data_root))

    sf = SubmissionFile(
        submission_id=sub.id,
        filename=filename,
        path=filepath,
        file_size=len(code.encode()),
        content_type="text/plain",
    )
    db.add(sf)
    db.flush()

    # Store test results if provided
    if test_passes and testcases:
        for tc, passed in zip(testcases, test_passes):
            db.add(SubmissionResult(
                submission_id=sub.id,
                testcase_id=tc.id,
                passed=passed,
                output="(seeded)" if not passed else "(correct output)",
                points_awarded=tc.points if passed else 0,
            ))
        db.flush()

    return sub


def main():
    db: Session = SessionLocal()
    try:
        print("\n" + "=" * 65)
        print("  AUTOGRADER DEMO DATA — Seed Script")
        print("=" * 65)

        # ── Determine data_root ──────────────────────────────────────────
        from app.settings import settings
        data_root = settings.DATA_ROOT
        os.makedirs(data_root, exist_ok=True)

        # ── Resolve faculty ──────────────────────────────────────────────
        faculty = db.query(User).filter(User.email == "lon@ulm.edu").first()
        if not faculty:
            faculty = db.query(User).filter(User.role == "faculty").first()
        if not faculty:
            print("❌ No faculty user found. Please create a faculty user first.")
            return

        print(f"\n📌 Using faculty: {faculty.name} (id={faculty.id})")

        # ── Resolve / create course ──────────────────────────────────────
        course = db.query(Course).filter(Course.id == 6).first()
        if not course:
            course = db.query(Course).filter(Course.code == "CSCI 2270").first()
        if not course:
            import random, string
            code_chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
            course = Course(
                name="Data Structures",
                code="CSCI 2270",
                section="001",
                enrollment_code="".join(random.choices(code_chars, k=7)),
                enrollment_policy="invite",
                faculty_id=faculty.id,
                is_active=True,
            )
            db.add(course)
            db.flush()
            print(f"  ✅ Created course: {course.name} (id={course.id})")
        else:
            if not course.faculty_id:
                course.faculty_id = faculty.id
            print(f"  📌 Using course: {course.name} (id={course.id})")

        enroll_if_missing(db, course.id, faculty.id, role="instructor")

        # ── Create / update students ─────────────────────────────────────
        print(f"\n👥 Creating {len(DEMO_STUDENTS)} demo students …")
        student_users: list[User] = []
        for s in DEMO_STUDENTS:
            user = get_or_create_user(db, s)
            enroll_if_missing(db, course.id, user.id, role="student")
            student_users.append(user)

        db.commit()
        print(f"  ✅ {len(student_users)} students enrolled in '{course.name}'")

        # ── Assignment 1: Python FizzBuzz ────────────────────────────────
        print("\n📝 Setting up Assignment 1: Python FizzBuzz …")
        a1 = db.query(Assignment).filter(
            Assignment.course_id == course.id,
            Assignment.title == "Python FizzBuzz",
        ).first()
        if not a1:
            a1 = Assignment(
                title="Python FizzBuzz",
                description=(
                    "Write a Python program that reads a single integer n from stdin "
                    "and prints the FizzBuzz sequence from 1 to n. "
                    "Print 'Fizz' for multiples of 3, 'Buzz' for multiples of 5, "
                    "'FizzBuzz' for multiples of both, and the number otherwise."
                ),
                course_id=course.id,
                created_by=faculty.id,
                due_date=datetime.utcnow() + timedelta(days=14),
                max_points=100,
                allowed_languages="python",
                starter_code="# Write your FizzBuzz solution here\nn = int(input())\n",
                status="published",
            )
            db.add(a1)
            db.flush()
            print(f"  ✅ Created assignment: {a1.title} (id={a1.id})")
        else:
            print(f"  📌 Assignment already exists: {a1.title} (id={a1.id})")

        # Test cases for Assignment 1
        a1_tests_data = [
            {"name": "Basic FizzBuzz n=15", "input": "15",
             "expected": "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz",
             "is_public": True, "points": 15},
            {"name": "Short sequence n=5", "input": "5",
             "expected": "1\n2\nFizz\n4\nBuzz",
             "is_public": True, "points": 15},
            {"name": "Single value n=1", "input": "1",
             "expected": "1",
             "is_public": False, "points": 10},
            {"name": "FizzBuzz at n=30", "input": "30",
             "expected": (
                 "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz\n"
                 "16\n17\nFizz\n19\nBuzz\nFizz\n22\n23\nFizz\nBuzz\n26\nFizz\n28\n29\nFizzBuzz"
             ),
             "is_public": False, "points": 10},
        ]
        a1_testcases: list[TestCase] = []
        existing_tc_names = {tc.name for tc in db.query(TestCase).filter(TestCase.assignment_id == a1.id).all()}
        for td in a1_tests_data:
            if td["name"] not in existing_tc_names:
                tc = TestCase(
                    assignment_id=a1.id,
                    name=td["name"],
                    input_data=td["input"],
                    expected_output=td["expected"],
                    is_public=td["is_public"],
                    points=td["points"],
                    timeout_seconds=10,
                )
                db.add(tc)
                db.flush()
            else:
                tc = db.query(TestCase).filter(TestCase.assignment_id == a1.id, TestCase.name == td["name"]).first()
            a1_testcases.append(tc)

        # Rubric for Assignment 1 — WEIGHTED
        a1_rubric_data = [
            {"name": "Code Correctness", "description": "Produces correct FizzBuzz output for all test cases", "max_points": 60, "weight": 1.0},
            {"name": "Code Style",       "description": "Follows PEP 8 style guidelines; readable variable names", "max_points": 20, "weight": 0.5},
            {"name": "Documentation",    "description": "Includes comments explaining key logic", "max_points": 20, "weight": 0.5},
        ]
        existing_rubric_names = {r.name for r in db.query(Rubric).filter(Rubric.assignment_id == a1.id).all()}
        a1_rubrics: list[Rubric] = []
        for i, rd in enumerate(a1_rubric_data):
            if rd["name"] not in existing_rubric_names:
                r = Rubric(
                    assignment_id=a1.id,
                    name=rd["name"],
                    description=rd["description"],
                    max_points=rd["max_points"],
                    weight=rd["weight"],
                    order=i,
                )
                db.add(r)
                db.flush()
            else:
                r = db.query(Rubric).filter(Rubric.assignment_id == a1.id, Rubric.name == rd["name"]).first()
            a1_rubrics.append(r)

        db.commit()
        print(f"  ✅ {len(a1_testcases)} test cases,  {len(a1_rubrics)} rubric criteria (weighted)")

        # ── Assignment 2: Java Calculator ────────────────────────────────
        print("\n📝 Setting up Assignment 2: Java Calculator …")
        a2 = db.query(Assignment).filter(
            Assignment.course_id == course.id,
            Assignment.title == "Java Calculator",
        ).first()
        if not a2:
            a2 = Assignment(
                title="Java Calculator",
                description=(
                    "Write a Java program (class name: Calculator) that reads "
                    "an operation and two integers from stdin and prints the result. "
                    "Supported operations: add, sub, mul, div. "
                    "Handle division by zero with an appropriate message."
                ),
                course_id=course.id,
                created_by=faculty.id,
                due_date=datetime.utcnow() + timedelta(days=21),
                max_points=100,
                allowed_languages="java",
                starter_code=(
                    "import java.util.Scanner;\npublic class Calculator {\n"
                    "    public static void main(String[] args) {\n"
                    "        // Write your solution here\n    }\n}\n"
                ),
                status="published",
            )
            db.add(a2)
            db.flush()
            print(f"  ✅ Created assignment: {a2.title} (id={a2.id})")
        else:
            print(f"  📌 Assignment already exists: {a2.title} (id={a2.id})")

        # Test cases for Assignment 2
        a2_tests_data = [
            {"name": "Addition",       "input": "add 5 3",   "expected": "8",  "is_public": True,  "points": 15},
            {"name": "Subtraction",    "input": "sub 10 4",  "expected": "6",  "is_public": True,  "points": 15},
            {"name": "Multiplication", "input": "mul 3 7",   "expected": "21", "is_public": False, "points": 10},
            {"name": "Division",       "input": "div 15 3",  "expected": "5",  "is_public": False, "points": 10},
        ]
        a2_testcases: list[TestCase] = []
        existing_tc_names2 = {tc.name for tc in db.query(TestCase).filter(TestCase.assignment_id == a2.id).all()}
        for td in a2_tests_data:
            if td["name"] not in existing_tc_names2:
                tc = TestCase(
                    assignment_id=a2.id,
                    name=td["name"],
                    input_data=td["input"],
                    expected_output=td["expected"],
                    is_public=td["is_public"],
                    points=td["points"],
                    timeout_seconds=15,
                )
                db.add(tc)
                db.flush()
            else:
                tc = db.query(TestCase).filter(TestCase.assignment_id == a2.id, TestCase.name == td["name"]).first()
            a2_testcases.append(tc)

        # Rubric for Assignment 2 — UNWEIGHTED (all weight=1.0)
        a2_rubric_data = [
            {"name": "Functionality",      "description": "All supported operations produce correct output", "max_points": 50, "weight": 1.0},
            {"name": "Error Handling",     "description": "Division by zero and unknown operations handled", "max_points": 25, "weight": 1.0},
            {"name": "Code Organization",  "description": "Clean class structure and meaningful names",      "max_points": 25, "weight": 1.0},
        ]
        existing_rubric_names2 = {r.name for r in db.query(Rubric).filter(Rubric.assignment_id == a2.id).all()}
        a2_rubrics: list[Rubric] = []
        for i, rd in enumerate(a2_rubric_data):
            if rd["name"] not in existing_rubric_names2:
                r = Rubric(
                    assignment_id=a2.id,
                    name=rd["name"],
                    description=rd["description"],
                    max_points=rd["max_points"],
                    weight=rd["weight"],
                    order=i,
                )
                db.add(r)
                db.flush()
            else:
                r = db.query(Rubric).filter(Rubric.assignment_id == a2.id, Rubric.name == rd["name"]).first()
            a2_rubrics.append(r)

        db.commit()
        print(f"  ✅ {len(a2_testcases)} test cases,  {len(a2_rubrics)} rubric criteria (unweighted)")

        # ── Submissions: Assignment 1 (Python FizzBuzz) ──────────────────
        print("\n📤 Creating submissions for Assignment 1 (Python FizzBuzz) …")
        # Distribution: 8 graded, 2 pending, 2 missing
        a1_scores = [95, 88, 72, 65, 91, 78, 55, 82, None, None, None, None]
        a1_test_pass_patterns = [
            [True, True, True, True],    # 95
            [True, True, True, False],   # 88
            [True, True, False, False],  # 72
            [True, False, False, False], # 65
            [True, True, True, True],    # 91
            [True, True, False, True],   # 78
            [False, True, False, False], # 55
            [True, True, True, False],   # 82
            [False, False, False, False], # pending
            [True, False, False, False],  # pending
            None, None,
        ]
        for idx, student in enumerate(student_users):
            score = a1_scores[idx]
            test_passes = a1_test_pass_patterns[idx]
            if score is None and test_passes is None:
                # No submission
                continue
            status = "graded" if score is not None else "pending"
            fb = f"Auto-graded. Score: {score}/100" if score is not None else None
            make_submission(
                db=db,
                assignment=a1,
                student=student,
                code=PYTHON_GOOD if (score or 0) >= 80 else PYTHON_PARTIAL,
                filename="solution.py",
                status=status,
                score=score,
                max_score=100 if score is not None else None,
                feedback=fb,
                test_passes=test_passes,
                testcases=a1_testcases,
                data_root=data_root,
            )
        db.commit()
        print("  ✅ Assignment 1 submissions created")

        # ── Submissions: Assignment 2 (Java Calculator) ──────────────────
        print("\n📤 Creating submissions for Assignment 2 (Java Calculator) …")
        a2_scores = [98, 85, 70, 60, 93, 75, None, None, None, None, None, None]
        a2_test_pass_patterns = [
            [True, True, True, True],    # 98
            [True, True, True, False],   # 85
            [True, True, False, False],  # 70
            [True, False, False, False], # 60
            [True, True, True, True],    # 93
            [True, True, False, False],  # 75
            [False, False, False, False], # pending
            [True, False, False, False],  # pending
            None, None, None, None,
        ]
        for idx, student in enumerate(student_users):
            score = a2_scores[idx]
            test_passes = a2_test_pass_patterns[idx]
            if score is None and test_passes is None:
                continue
            status = "graded" if score is not None else "pending"
            fb = f"Auto-graded. Score: {score}/100" if score is not None else None
            make_submission(
                db=db,
                assignment=a2,
                student=student,
                code=JAVA_GOOD if (score or 0) >= 80 else JAVA_PARTIAL,
                filename="Calculator.java",
                status=status,
                score=score,
                max_score=100 if score is not None else None,
                feedback=fb,
                test_passes=test_passes,
                testcases=a2_testcases,
                data_root=data_root,
            )
        db.commit()
        print("  ✅ Assignment 2 submissions created")

        # ── Summary ──────────────────────────────────────────────────────
        print("\n" + "=" * 65)
        print("  DEMO DATA SEED COMPLETE")
        print("=" * 65)
        print(f"\n  Course  : {course.name} ({course.code})  id={course.id}")
        print(f"  Faculty : {faculty.name} ({faculty.email})")
        print(f"  Students: {len(student_users)}")
        print(f"  Assignment 1: '{a1.title}'  id={a1.id}")
        print(f"  Assignment 2: '{a2.title}'  id={a2.id}")
        print()
        print("  Student login credentials:")
        print(f"    Email domain : @warhawks.ulm.edu")
        print(f"    Password     : {STUDENT_PASSWORD}")
        print()
        print("  Faculty login:")
        print(f"    Email        : {faculty.email}")
        print(f"    Password     : Axiom@123  (existing)")
        print("=" * 65 + "\n")

    except Exception as exc:
        db.rollback()
        print(f"\n❌ Seed failed: {exc}")
        import traceback; traceback.print_exc()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
