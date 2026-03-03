"""Seed test cases and rubrics for assignment 2 (Homework 3)."""
from app.core.database import SessionLocal
from app.models.testcase import TestCase
from app.models.rubric import Rubric

db = SessionLocal()

# Check if already seeded
existing = db.query(TestCase).filter(TestCase.assignment_id == 2).count()
if existing > 0:
    print(f"Already {existing} test cases for assignment 2, skipping.")
else:
    testcases = [
        TestCase(assignment_id=2, name="Basic: double 5", input_data="5\n", expected_output="10\n", is_public=True, points=10),
        TestCase(assignment_id=2, name="Double 0", input_data="0\n", expected_output="0\n", is_public=True, points=10),
        TestCase(assignment_id=2, name="Double negative", input_data="-3\n", expected_output="-6\n", is_public=False, points=10),
        TestCase(assignment_id=2, name="Large number", input_data="1000\n", expected_output="2000\n", is_public=False, points=10),
    ]
    for tc in testcases:
        db.add(tc)
    print(f"Added {len(testcases)} test cases for assignment 2")

existing_rubrics = db.query(Rubric).filter(Rubric.assignment_id == 2).count()
if existing_rubrics > 0:
    print(f"Already {existing_rubrics} rubrics for assignment 2, skipping.")
else:
    rubrics = [
        Rubric(assignment_id=2, name="Correctness", description="Program produces correct output for all inputs", max_points=40, weight=1.0),
        Rubric(assignment_id=2, name="Code Style", description="Clean variable naming and formatting", max_points=30, weight=1.0),
        Rubric(assignment_id=2, name="Comments", description="Code includes helpful comments", max_points=30, weight=1.0),
    ]
    for r in rubrics:
        db.add(r)
    print(f"Added {len(rubrics)} rubrics for assignment 2")

db.commit()
db.close()
print("Done.")
