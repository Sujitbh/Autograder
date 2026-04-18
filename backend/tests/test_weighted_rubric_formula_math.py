import math


def weighted_points(rating: float, criterion_weight_percent: float) -> float:
    """Canonical weighted rubric formula: (rating/5) * criterion_weight."""
    clamped_rating = max(0.0, min(5.0, float(rating)))
    return (clamped_rating / 5.0) * float(criterion_weight_percent)


def test_weighted_formula_examples():
    assert math.isclose(weighted_points(2, 10), 4.0, rel_tol=0, abs_tol=1e-9)
    assert math.isclose(weighted_points(5, 10), 10.0, rel_tol=0, abs_tol=1e-9)
    assert math.isclose(weighted_points(3, 20), 12.0, rel_tol=0, abs_tol=1e-9)


def test_weighted_total_is_sum_of_criteria_points():
    criteria = [
        (2, 10),
        (5, 10),
        (3, 20),
    ]
    criterion_points = [weighted_points(rating, weight) for rating, weight in criteria]
    total = sum(criterion_points)

    assert criterion_points == [4.0, 10.0, 12.0]
    assert math.isclose(total, 26.0, rel_tol=0, abs_tol=1e-9)


def test_zero_to_five_rating_bounds_are_supported():
    assert math.isclose(weighted_points(0, 15), 0.0, rel_tol=0, abs_tol=1e-9)
    assert math.isclose(weighted_points(-3, 15), 0.0, rel_tol=0, abs_tol=1e-9)
    assert math.isclose(weighted_points(8, 15), 15.0, rel_tol=0, abs_tol=1e-9)
