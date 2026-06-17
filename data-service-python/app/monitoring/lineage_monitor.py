"""Lineage monitor — platform-wide data flow graph for Operations Center."""

from __future__ import annotations

from app.etl.lineage import build_pipeline_lineage
from app.monitoring.models import LineageEdge, LineageGraph, LineageNode

PLATFORM_LINEAGE_STAGES = [
    ("synthetic", "Synthetic Data", "Faker/Pandas retail dataset generation"),
    ("validation", "Validation", "Schema and business rule validation"),
    ("cleaning", "Cleaning", "Missing values, duplicates, normalization"),
    ("transformation", "Transformation", "Business rules and enrichment"),
    ("warehouse", "Warehouse", "Star schema load to analytics warehouse"),
    ("statistics", "Statistics", "Descriptive and business statistics"),
    ("analytics", "Analytics", "Dimensional KPI computation"),
    ("forecasting", "Forecasting", "Predictive models and scenarios"),
]

WAREHOUSE_TABLES = ["stores", "products", "sales", "inventory"]


class LineageMonitor:
    def build_platform_lineage(self) -> LineageGraph:
        nodes = [
            LineageNode(id=node_id, label=label, description=desc)
            for node_id, label, desc in PLATFORM_LINEAGE_STAGES
        ]
        edges = [
            LineageEdge(
                source=PLATFORM_LINEAGE_STAGES[i][0],
                target=PLATFORM_LINEAGE_STAGES[i + 1][0],
                transformation=PLATFORM_LINEAGE_STAGES[i + 1][1].lower(),
            )
            for i in range(len(PLATFORM_LINEAGE_STAGES) - 1)
        ]
        flow = [label for _, label, _ in PLATFORM_LINEAGE_STAGES]
        return LineageGraph(nodes=nodes, edges=edges, flow=flow)

    def build_etl_lineage_sample(self) -> LineageGraph:
        etl_tracker = build_pipeline_lineage("sales.csv", "sales", WAREHOUSE_TABLES)
        etl_dict = etl_tracker.to_dict()
        nodes = [
            LineageNode(
                id=node["id"],
                label=node.get("name", node["id"]),
                description=node.get("type", "stage"),
            )
            for node in etl_dict.get("nodes", [])
        ]
        edges = [
            LineageEdge(
                source=edge["source"],
                target=edge["target"],
                transformation=edge.get("transformation", ""),
            )
            for edge in etl_dict.get("edges", [])
        ]
        flow = etl_dict.get("flow", [])
        return LineageGraph(nodes=nodes, edges=edges, flow=flow)

    def lineage_nodes_list(self) -> list[LineageNode]:
        return self.build_platform_lineage().nodes


lineage_monitor = LineageMonitor()
