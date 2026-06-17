"""Data lineage engine — tracks dataset movement through the ETL pipeline."""

from __future__ import annotations

from typing import Any, Dict, List, Optional


class LineageNode:
    def __init__(self, id: str, name: str, node_type: str, metadata: Optional[Dict[str, Any]] = None) -> None:
        self.id = id
        self.name = name
        self.node_type = node_type
        self.metadata = metadata or {}

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "name": self.name,
            "type": self.node_type,
            "metadata": self.metadata,
        }


class LineageEdge:
    def __init__(self, source_id: str, target_id: str, transformation: str) -> None:
        self.source_id = source_id
        self.target_id = target_id
        self.transformation = transformation

    def to_dict(self) -> Dict[str, Any]:
        return {
            "source": self.source_id,
            "target": self.target_id,
            "transformation": self.transformation,
        }


class LineageTracker:
    def __init__(self) -> None:
        self.nodes: List[LineageNode] = []
        self.edges: List[LineageEdge] = []

    def add_node(self, id: str, name: str, node_type: str, metadata: Optional[Dict[str, Any]] = None) -> None:
        if not any(n.id == id for n in self.nodes):
            self.nodes.append(LineageNode(id, name, node_type, metadata))

    def add_edge(self, source_id: str, target_id: str, transformation: str) -> None:
        self.edges.append(LineageEdge(source_id, target_id, transformation))

    def to_dict(self) -> Dict[str, Any]:
        return {
            "nodes": [n.to_dict() for n in self.nodes],
            "edges": [e.to_dict() for e in self.edges],
            "flow": self._build_flow_chain(),
        }

    def _build_flow_chain(self) -> List[str]:
        if not self.nodes:
            return []
        ordered: List[str] = []
        seen: set = set()
        for edge in self.edges:
            if edge.source_id not in seen:
                node = next((n for n in self.nodes if n.id == edge.source_id), None)
                if node:
                    ordered.append(node.name)
                    seen.add(edge.source_id)
            if edge.target_id not in seen:
                node = next((n for n in self.nodes if n.id == edge.target_id), None)
                if node:
                    ordered.append(node.name)
                    seen.add(edge.target_id)
        return ordered

    def to_list(self) -> List[str]:
        return self._build_flow_chain()


def build_pipeline_lineage(
    source_name: str,
    entity: str,
    warehouse_tables: Optional[List[str]] = None,
) -> LineageTracker:
    """Build standard lineage chain for an ETL run."""
    tracker = LineageTracker()
    stages = [
        ("source", source_name, "source"),
        ("validation", "validation", "stage"),
        ("cleaning", "cleaning", "stage"),
        ("normalization", "normalization", "stage"),
        ("transformation", "transformation", "stage"),
        ("aggregation", "aggregation", "stage"),
        ("load", "load", "stage"),
    ]

    for stage_id, name, node_type in stages:
        tracker.add_node(stage_id, name, node_type)

    for i in range(len(stages) - 1):
        tracker.add_edge(stages[i][0], stages[i + 1][0], stages[i + 1][1])

    if warehouse_tables:
        tracker.add_node("warehouse", "analytics_warehouse", "warehouse")
        tracker.add_edge("load", "warehouse", "warehouse_load")
        for table in warehouse_tables:
            table_id = f"wh_{table}"
            tracker.add_node(table_id, table, "warehouse_table")
            tracker.add_edge("warehouse", table_id, "star_schema_load")

    final_target = warehouse_tables[0] if warehouse_tables else entity
    tracker.add_node(f"target_{final_target}", final_target, "target")
    last_id = f"wh_{warehouse_tables[-1]}" if warehouse_tables else "load"
    tracker.add_edge(last_id, f"target_{final_target}", "analytics_ready")

    return tracker
