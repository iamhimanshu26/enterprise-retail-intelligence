"""Scenario planning utilities."""

from __future__ import annotations

from app.forecasting.models import ScenarioOutputs, ScenarioResult


def build_scenario_outputs(base_value: float, metric: str = "revenue") -> ScenarioOutputs:
    """Optimistic +10%, realistic base, pessimistic -10%."""
    scenarios = [
        ScenarioResult(
            scenario="optimistic",
            metric=metric,
            base_value=round(base_value, 2),
            adjusted_value=round(base_value * 1.10, 2),
            adjustment_pct=10.0,
        ),
        ScenarioResult(
            scenario="realistic",
            metric=metric,
            base_value=round(base_value, 2),
            adjusted_value=round(base_value, 2),
            adjustment_pct=0.0,
        ),
        ScenarioResult(
            scenario="pessimistic",
            metric=metric,
            base_value=round(base_value, 2),
            adjusted_value=round(base_value * 0.90, 2),
            adjustment_pct=-10.0,
        ),
    ]
    return ScenarioOutputs(scenarios=scenarios)
