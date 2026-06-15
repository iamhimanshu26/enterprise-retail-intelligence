export type PhaseStatus = 'completed' | 'current' | 'locked'

export interface ProjectPhase {
  phase: number
  title: string
  description: string
  technologies: string[]
  status: PhaseStatus
}

export const PROJECT_ROADMAP: ProjectPhase[] = [
  {
    phase: 0,
    title: 'Enterprise Foundation',
    description: 'Monorepo architecture, design system, JWT infrastructure, Docker, and documentation portal.',
    technologies: ['React 19', 'Spring Boot 3', 'FastAPI', 'PostgreSQL', 'Docker'],
    status: 'completed',
  },
  {
    phase: 1,
    title: 'Enterprise Dashboard',
    description: 'Executive KPI views, workspace switching, and premium dashboard layouts.',
    technologies: ['React', 'TanStack Query', 'Recharts'],
    status: 'completed',
  },
  {
    phase: 2,
    title: 'Backend APIs',
    description: 'RESTful domain APIs for sales, inventory, customers, and suppliers.',
    technologies: ['Spring Boot', 'JPA', 'OpenAPI'],
    status: 'current',
  },
  {
    phase: 3,
    title: 'Synthetic Retail Data Generator',
    description: 'Realistic retail datasets for development, testing, and demos.',
    technologies: ['Faker', 'Pandas', 'FastAPI'],
    status: 'locked',
  },
  {
    phase: 4,
    title: 'Python ETL Pipeline',
    description: 'Batch ingestion, transformation, validation, and load into PostgreSQL.',
    technologies: ['Polars', 'DuckDB', 'SQLAlchemy'],
    status: 'locked',
  },
  {
    phase: 5,
    title: 'Business Analytics & Statistics',
    description: 'Statistical modeling, hypothesis testing, and analytics computation.',
    technologies: ['Scikit-learn', 'Statsmodels', 'NumPy'],
    status: 'locked',
  },
  {
    phase: 6,
    title: 'Data Visualization',
    description: 'Interactive charts, drill-downs, and executive reporting views.',
    technologies: ['Recharts', 'D3.js', 'TanStack Table'],
    status: 'locked',
  },
  {
    phase: 7,
    title: 'Forecasting Engine',
    description: 'Demand forecasting with time-series models and scenario planning.',
    technologies: ['Prophet', 'ARIMA', 'XGBoost'],
    status: 'locked',
  },
  {
    phase: 8,
    title: 'Pipeline Monitoring',
    description: 'Real-time pipeline health, logs, metrics, and alerting.',
    technologies: ['WebSocket', 'Prometheus', 'Grafana'],
    status: 'locked',
  },
  {
    phase: 9,
    title: 'Airflow Integration',
    description: 'Orchestrated workflows for scheduled and dependency-driven pipelines.',
    technologies: ['Apache Airflow', 'Celery', 'Redis'],
    status: 'locked',
  },
  {
    phase: 10,
    title: 'Event-Driven Architecture',
    description: 'Async messaging, event sourcing, and microservice decoupling.',
    technologies: ['Kafka', 'RabbitMQ', 'CQRS'],
    status: 'locked',
  },
  {
    phase: 11,
    title: 'Business Insight Engine',
    description: 'AI-powered recommendations and anomaly detection for retail KPIs.',
    technologies: ['LLM APIs', 'Embeddings', 'RAG'],
    status: 'locked',
  },
  {
    phase: 12,
    title: 'Kubernetes Deployment',
    description: 'Production container orchestration with Helm and GitOps.',
    technologies: ['Kubernetes', 'Helm', 'ArgoCD'],
    status: 'locked',
  },
  {
    phase: 13,
    title: 'Monitoring & Observability',
    description: 'Distributed tracing, centralized logging, and SLA dashboards.',
    technologies: ['Jaeger', 'ELK', 'Datadog'],
    status: 'locked',
  },
  {
    phase: 14,
    title: 'Portfolio Polish',
    description: 'Final UX refinement, documentation, demos, and production hardening.',
    technologies: ['Storybook', 'E2E Tests', 'Performance'],
    status: 'locked',
  },
]

export const CURRENT_PHASE = 1
