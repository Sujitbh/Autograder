import threading
from pathlib import Path

from app.settings import settings


_MODEL_LOCK = threading.Lock()
_MODEL_LOAD_ATTEMPTED = False
_MODEL_PIPELINE = None
_MODEL_META = {}
_MODEL_MTIME = None


def _detector_artifact_path() -> Path:
    return Path(settings.DATA_ROOT) / "models" / "ai_code_detector.joblib"


def _load_model_once() -> None:
    global _MODEL_LOAD_ATTEMPTED, _MODEL_PIPELINE, _MODEL_META, _MODEL_MTIME

    artifact_path = _detector_artifact_path()
    current_mtime = artifact_path.stat().st_mtime if artifact_path.exists() else None

    # Fast path: already loaded and unchanged.
    if _MODEL_LOAD_ATTEMPTED and _MODEL_MTIME == current_mtime:
        return

    with _MODEL_LOCK:
        current_mtime = artifact_path.stat().st_mtime if artifact_path.exists() else None
        if _MODEL_LOAD_ATTEMPTED and _MODEL_MTIME == current_mtime:
            return

        try:
            import joblib

            if artifact_path.exists():
                artifact = joblib.load(artifact_path)
                if isinstance(artifact, dict) and "pipeline" in artifact:
                    _MODEL_PIPELINE = artifact["pipeline"]
                    _MODEL_META = artifact.get("meta", {}) or {}
                else:
                    _MODEL_PIPELINE = artifact
                    _MODEL_META = {}
                _MODEL_MTIME = current_mtime
            else:
                _MODEL_PIPELINE = None
                _MODEL_META = {}
                _MODEL_MTIME = None
        except Exception:
            _MODEL_PIPELINE = None
            _MODEL_META = {}
            _MODEL_MTIME = None
        finally:
            _MODEL_LOAD_ATTEMPTED = True


def _resolve_ai_class_index(classes: list[str]) -> int | None:
    ai_markers = {"1", "ai", "llm", "generated", "synthetic"}

    for idx, cls in enumerate(classes):
        if cls in ai_markers:
            return idx

    # For numeric binary class labels, default to class 1 as AI.
    if set(classes).issubset({"0", "1"}) and "1" in classes:
        return classes.index("1")

    if len(classes) == 2:
        # Fallback for unknown binary labels: treat second class as AI-positive.
        return 1

    return None


def predict_ai_likelihood(code: str) -> dict | None:
    """Return model-based AI likelihood if a trained artifact exists; otherwise None."""
    _load_model_once()

    if _MODEL_PIPELINE is None or not code:
        return None

    try:
        probabilities = _MODEL_PIPELINE.predict_proba([code])[0]
        classes = [str(c).lower() for c in _MODEL_PIPELINE.classes_]
        ai_idx = _resolve_ai_class_index(classes)
        if ai_idx is None:
            return None

        score = round(float(probabilities[ai_idx]) * 100.0, 1)
        band = "low"
        if score >= 65:
            band = "high"
        elif score >= 40:
            band = "medium"

        model_name = _MODEL_META.get("model_name", "trained-classifier")
        dataset_name = _MODEL_META.get("dataset_name", "custom")

        signals = [
            f"Model confidence from {model_name}",
            f"Trained on {dataset_name}",
        ]

        return {
            "score": score,
            "band": band,
            "signals": signals,
            "disclaimer": "AI detection is advisory only; use instructor judgement and corroborating evidence.",
        }
    except Exception:
        return None
