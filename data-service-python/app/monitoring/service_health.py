"""Service health engine — logical health of platform services."""

from __future__ import annotations

import time
from typing import List

from app.monitoring.models import ServiceHealthItem

SERVICE_DEFINITIONS = [
    ("spring-api", "Spring Boot API", "healthy", 85, "JWT gateway active"),
    ("fastapi", "FastAPI Service", "healthy", 38, "Data service online"),
    ("postgresql", "PostgreSQL", "healthy", 12, "Connection pool ready"),
    ("etl-engine", "ETL Engine", "healthy", 120, "Pipeline executor ready"),
    ("analytics-engine", "Analytics Engine", "degraded", 210, "Elevated query latency"),
    ("forecasting-engine", "Forecasting Engine", "healthy", 95, "Models loaded"),
]

STATUS_API_MAP = {
    "healthy": "healthy",
    "degraded": "degraded",
    "warning": "warning",
    "offline": "down",
}


class ServiceHealthEngine:
    def _normalize_status(self, status: str) -> str:
        return STATUS_API_MAP.get(status.lower(), status.lower())

    def build_health_cards(self, include_frontend: bool = True) -> List[ServiceHealthItem]:
        start = time.time()
        cards: List[ServiceHealthItem] = []

        if include_frontend:
            cards.append(
                ServiceHealthItem(
                    service_id="frontend",
                    service_name="Frontend",
                    status="healthy",
                    latency_ms=42,
                    message="Vercel edge deployment",
                )
            )

        for service_id, name, status, latency, message in SERVICE_DEFINITIONS:
            cards.append(
                ServiceHealthItem(
                    service_id=service_id,
                    service_name=name,
                    status=self._normalize_status(status),
                    latency_ms=float(latency),
                    message=message,
                )
            )

        elapsed_ms = round((time.time() - start) * 1000, 1)
        cards.append(
            ServiceHealthItem(
                service_id="monitoring-engine",
                service_name="Monitoring Engine",
                status="healthy",
                latency_ms=elapsed_ms,
                message="Monitoring orchestrator operational",
            )
        )
        return cards

    def platform_health_score(self, cards: List[ServiceHealthItem]) -> float:
        weights = {"healthy": 100, "degraded": 70, "warning": 50, "down": 0}
        if not cards:
            return 0.0
        scores = [weights.get(card.status, 60) for card in cards]
        return round(sum(scores) / len(scores), 1)


service_health_engine = ServiceHealthEngine()
