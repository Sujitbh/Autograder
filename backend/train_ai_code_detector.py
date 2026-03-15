#!/usr/bin/env python3
"""
Train an AI-vs-human code detector from Hugging Face dataset and save artifact.

Default dataset:
  basakdemirok/AIGCodeSet

Example:
  python train_ai_code_detector.py --max-rows 12000
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from datasets import concatenate_datasets, load_dataset
from joblib import dump
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, f1_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline

from app.settings import settings


def normalize_label(raw_label, llm_value) -> int | None:
    if raw_label is not None:
        if isinstance(raw_label, bool):
            return int(raw_label)
        if isinstance(raw_label, (int, float)):
            return int(raw_label)

        txt = str(raw_label).strip().lower()
        if txt in {"1", "true", "ai", "llm", "generated", "synthetic"}:
            return 1
        if txt in {"0", "false", "human", "manual"}:
            return 0

    if llm_value is not None:
        llm_txt = str(llm_value).strip().lower()
        if llm_txt == "human":
            return 0
        if llm_txt:
            return 1

    return None


def load_training_rows(dataset_name: str, split_mode: str, max_rows: int | None) -> tuple[list[str], list[int]]:
    dataset_dict = load_dataset(dataset_name)

    if split_mode == "all":
        merged = concatenate_datasets([dataset_dict[s] for s in dataset_dict.keys()])
    else:
        if split_mode not in dataset_dict:
            raise ValueError(f"Split '{split_mode}' not found. Available: {list(dataset_dict.keys())}")
        merged = dataset_dict[split_mode]

    if max_rows and max_rows > 0:
        max_rows = min(max_rows, len(merged))
        merged = merged.select(range(max_rows))

    codes: list[str] = []
    labels: list[int] = []

    for row in merged:
        code = row.get("code")
        label = normalize_label(row.get("label"), row.get("LLM"))

        if not code or label is None:
            continue

        code_text = str(code).strip()
        if not code_text:
            continue

        codes.append(code_text)
        labels.append(label)

    if not codes:
        raise ValueError("No valid labeled code rows found in dataset.")

    return codes, labels


def train_model(codes: list[str], labels: list[int]) -> tuple[Pipeline, dict]:
    x_train, x_test, y_train, y_test = train_test_split(
        codes,
        labels,
        test_size=0.2,
        random_state=42,
        stratify=labels,
    )

    pipeline = Pipeline(
        steps=[
            (
                "tfidf",
                TfidfVectorizer(
                    analyzer="char_wb",
                    ngram_range=(3, 5),
                    min_df=2,
                    max_features=120000,
                    lowercase=True,
                    sublinear_tf=True,
                ),
            ),
            (
                "clf",
                LogisticRegression(
                    max_iter=450,
                    class_weight="balanced",
                    solver="liblinear",
                ),
            ),
        ]
    )

    pipeline.fit(x_train, y_train)
    preds = pipeline.predict(x_test)

    metrics = {
        "accuracy": round(float(accuracy_score(y_test, preds)), 4),
        "macro_f1": round(float(f1_score(y_test, preds, average="macro")), 4),
        "report": classification_report(y_test, preds, digits=4),
        "train_size": len(x_train),
        "test_size": len(x_test),
        "classes": [str(c) for c in pipeline.named_steps["clf"].classes_],
    }

    return pipeline, metrics


def main() -> None:
    parser = argparse.ArgumentParser(description="Train AI-vs-human code detector.")
    parser.add_argument("--dataset", default="basakdemirok/AIGCodeSet", help="Hugging Face dataset name")
    parser.add_argument("--split", default="all", help="Dataset split (train/test/all)")
    parser.add_argument("--max-rows", type=int, default=0, help="Optional cap on number of rows")
    parser.add_argument(
        "--output",
        default=str(Path(settings.DATA_ROOT) / "models" / "ai_code_detector.joblib"),
        help="Model artifact output path",
    )
    parser.add_argument(
        "--metrics-output",
        default=str(Path(settings.DATA_ROOT) / "models" / "ai_code_detector_metrics.json"),
        help="Metrics output path",
    )
    args = parser.parse_args()

    codes, labels = load_training_rows(
        dataset_name=args.dataset,
        split_mode=args.split,
        max_rows=args.max_rows if args.max_rows and args.max_rows > 0 else None,
    )

    pipeline, metrics = train_model(codes, labels)

    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    metrics_path = Path(args.metrics_output)
    metrics_path.parent.mkdir(parents=True, exist_ok=True)

    artifact = {
        "pipeline": pipeline,
        "meta": {
            "dataset_name": args.dataset,
            "split": args.split,
            "max_rows": args.max_rows,
            "model_name": "tfidf-charwb-logreg",
            "label_1": "ai_generated",
            "label_0": "human_written",
            "metrics": {
                "accuracy": metrics["accuracy"],
                "macro_f1": metrics["macro_f1"],
            },
        },
    }

    dump(artifact, output_path)
    with metrics_path.open("w", encoding="utf-8") as fh:
        json.dump(metrics, fh, indent=2)

    print("Training complete.")
    print(f"Rows used: {len(codes)}")
    print(f"Accuracy: {metrics['accuracy']}")
    print(f"Macro-F1: {metrics['macro_f1']}")
    print(f"Model saved to: {output_path}")
    print(f"Metrics saved to: {metrics_path}")


if __name__ == "__main__":
    main()
