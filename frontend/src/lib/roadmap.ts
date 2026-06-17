export type PhaseStatus = 'completed' | 'current' | 'locked'

export interface ProjectPhase {
  id: string
  phase: number | string
  title: string
  description: string
  purpose: string
  technologies: string[]
  status: PhaseStatus
}

/** Integer phases 0–14 (15 enterprise development phases). Phase 0.5 is a UX milestone between 0 and 1. */
export const ENTERPRISE_PHASE_COUNT = 15

/** Total roadmap entries including Phase 0.5 UX milestone. */
export const ROADMAP_ITEM_COUNT = 16

/** Next phase under active development. */
export const CURRENT_PHASE = 5

export const PROJECT_ROADMAP: ProjectPhase[] = [
  {
    id: '0',
    phase: 0,
    title: 'Enterprise Foundation & System Architecture',
    description:
      'Production-ready monorepo, enterprise UI shell, React, Spring Boot, FastAPI, PostgreSQL, Docker, Engineering Architecture module, and scalable project structure.',
    purpose: 'Establish the architectural foundation for all future phases without redesign.',
    technologies: ['React 19', 'Spring Boot 3', 'FastAPI', 'PostgreSQL', 'Docker'],
    status: 'completed',
  },
  {
    id: '0.5',
    phase: 0.5,
    title: 'Enterprise UX & SaaS Experience',
    description:
      'Landing page, demo mode, command palette, global search, enterprise design system, interactive Engineering Architecture, premium login, and UX polish.',
    purpose: 'Transform the platform into a premium enterprise SaaS experience.',
    technologies: ['React', 'Framer Motion', 'Design System', 'TanStack Query'],
    status: 'completed',
  },
  {
    id: '1',
    phase: 1,
    title: 'Executive Dashboard & Retail Intelligence Foundation',
    description:
      'KPI cards, executive summary, sales overview, store and product rankings, business alerts, regional performance, recent activity, mock data layer, and reusable analytics components.',
    purpose: 'Provide executives with a centralized business overview.',
    technologies: ['React', 'TanStack Query', 'Recharts', 'Zustand'],
    status: 'completed',
  },
  {
    id: '2',
    phase: 2,
    title: 'Core Retail Domain & Database Model',
    description:
      'Retail domain entities, PostgreSQL schema, JPA models, repositories, DTOs, Flyway migrations, and API-ready service skeletons for stores, products, customers, suppliers, inventory, sales, promotions, and returns.',
    purpose: 'Establish the backend and database foundation for data generation, ETL, analytics, and forecasting.',
    technologies: ['Spring Data JPA', 'PostgreSQL', 'Flyway', 'OpenAPI'],
    status: 'completed',
  },
  {
    id: '3',
    phase: 3,
    title: 'Synthetic Retail Data Generator',
    description:
      'Generate realistic stores, products, customers, suppliers, inventory, sales, promotions, and returns with configurable missing values, duplicates, outliers, seasonal trends, and regional distributions.',
    purpose: 'Create enterprise-scale datasets for testing and analytics.',
    technologies: ['Faker', 'Pandas', 'FastAPI', 'Python'],
    status: 'completed',
  },
  {
    id: '4',
    phase: 4,
    title: 'Python ETL & Data Engineering Pipeline',
    description:
      'Enterprise ETL for CSV, Excel, and JSON with validation, cleaning, transformation, aggregation, analytics warehouse loading, data lineage, execution history, and quality dashboard.',
    purpose: 'Create production-quality data engineering workflows.',
    technologies: ['Pandas', 'NumPy', 'Polars', 'DuckDB'],
    status: 'completed',
  },
  {
    id: '5',
    phase: 5,
    title: 'Business Analytics & Statistics Engine',
    description:
      'Revenue, profit, growth, mean, median, variance, standard deviation, customer retention, inventory turnover, and profit margin calculations.',
    purpose: 'Provide business intelligence and statistical analysis.',
    technologies: ['NumPy', 'SciPy', 'Statsmodels', 'Pandas'],
    status: 'current',
  },
  {
    id: '6',
    phase: 6,
    title: 'Data Visualization Platform',
    description:
      'Revenue trends, sales trends, product analytics, regional analytics, customer analytics, inventory dashboards, and executive charts.',
    purpose: 'Transform raw data into business insights.',
    technologies: ['Recharts', 'D3.js', 'TanStack Table'],
    status: 'locked',
  },
  {
    id: '7',
    phase: 7,
    title: 'Forecasting & Predictive Analytics',
    description:
      'Forecast revenue, sales, demand, inventory, seasonal trends, and store performance using statistical and ML models.',
    purpose: 'Enable data-driven planning.',
    technologies: ['Scikit-learn', 'Statsmodels', 'Prophet'],
    status: 'locked',
  },
  {
    id: '8',
    phase: 8,
    title: 'Pipeline Monitoring & Data Quality',
    description:
      'Pipeline status, success/failure, runtime, quality score, validation reports, and execution history.',
    purpose: 'Monitor ETL health and reliability.',
    technologies: ['WebSocket', 'Prometheus', 'FastAPI'],
    status: 'locked',
  },
  {
    id: '9',
    phase: 9,
    title: 'Airflow Workflow Orchestration',
    description:
      'Scheduled ETL, retry logic, DAG monitoring, and workflow history via Apache Airflow.',
    purpose: 'Automate enterprise data pipelines.',
    technologies: ['Apache Airflow', 'Celery', 'Redis'],
    status: 'locked',
  },
  {
    id: '10',
    phase: 10,
    title: 'Event-Driven Architecture',
    description:
      'Kafka/Redpanda events for data generated, ETL started/completed, forecast completed, and insight generated.',
    purpose: 'Build scalable event-driven microservices.',
    technologies: ['Kafka', 'Redpanda', 'Event Sourcing'],
    status: 'locked',
  },
  {
    id: '11',
    phase: 11,
    title: 'AI Business Insight Engine',
    description:
      'Executive insights including revenue explanation, demand anomalies, inventory warnings, growth opportunities, and business recommendations.',
    purpose: 'Convert analytics into actionable insights.',
    technologies: ['LLM APIs', 'Embeddings', 'RAG'],
    status: 'locked',
  },
  {
    id: '12',
    phase: 12,
    title: 'Kubernetes & Cloud-Native Deployment',
    description:
      'Docker, Kubernetes, ConfigMaps, Secrets, health checks, and service discovery for cloud-native deployment.',
    purpose: 'Demonstrate cloud-native architecture.',
    technologies: ['Kubernetes', 'Helm', 'Docker'],
    status: 'locked',
  },
  {
    id: '13',
    phase: 13,
    title: 'Monitoring & Observability',
    description:
      'Prometheus, Grafana, Spring Boot Actuator, FastAPI metrics, service health, and performance monitoring.',
    purpose: 'Enterprise production monitoring.',
    technologies: ['Prometheus', 'Grafana', 'Actuator'],
    status: 'locked',
  },
  {
    id: '14',
    phase: 14,
    title: 'Portfolio & Enterprise Presentation',
    description:
      'Architecture walkthrough, documentation, GitHub polish, landing page, screenshots, resume bullets, and presentation mode.',
    purpose:
      'Create a flagship portfolio project demonstrating full stack, data engineering, BI, statistics, forecasting, microservices, and cloud-native architecture.',
    technologies: ['Storybook', 'E2E Tests', 'Documentation'],
    status: 'locked',
  },
]

export function formatPhaseLabel(phase: number | string): string {
  return `Phase ${phase}`
}

export function getRoadmapProgress(): { completed: number; total: number; percent: number } {
  const completed = PROJECT_ROADMAP.filter((p) => p.status === 'completed').length
  const total = PROJECT_ROADMAP.length
  return { completed, total, percent: Math.round((completed / total) * 100) }
}
