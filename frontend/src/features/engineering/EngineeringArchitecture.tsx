import { useState } from 'react'
import {
  Activity,
  ArrowRightLeft,
  BarChart3,
  Boxes,
  Brain,
  ChevronDown,
  Cloud,
  Code2,
  Database,
  FolderTree,
  GitBranch,
  Layers,
  LineChart,
  Monitor,
  Network,
  Server,
  Settings,
  Sparkles,
  Workflow,
} from 'lucide-react'
import { motion } from 'framer-motion'
import {
  ArchitectureTimeline,
  Breadcrumb,
  DifficultyBadge,
  PageHeader,
  SectionContainer,
  StatusBadge,
  TechBadge,
} from '@/components/design-system'
import type { ArchitectureSection, DifficultyLevel, StatusVariant } from '@/types'
import {
  CURRENT_PHASE,
  ENTERPRISE_PHASE_COUNT,
  ROADMAP_ITEM_COUNT,
  getRoadmapProgress,
} from '@/lib/roadmap'
import { cn } from '@/lib/cn'

const ARCHITECTURE_SECTIONS: ArchitectureSection[] = [
  {
    id: 'overall',
    title: 'Overall System Architecture',
    description: 'Microservices-based platform with React frontend, Spring Boot API gateway, Python data service, and PostgreSQL persistence layer.',
    icon: 'network',
    status: 'completed',
    phase: 0,
    difficulty: 'intermediate',
    technologies: ['React', 'Spring Boot', 'FastAPI', 'PostgreSQL'],
    implementationStatus: 'Foundation deployed — Docker Compose + Vercel frontend',
  },
  {
    id: 'tech-stack',
    title: 'Technology Stack',
    description: 'React 19, Java 21 Spring Boot 3, Python 3.12 FastAPI, PostgreSQL, Docker, Kubernetes-ready infrastructure.',
    icon: 'layers',
    status: 'completed',
    phase: 0,
    difficulty: 'beginner',
    technologies: ['React 19', 'Java 21', 'Python 3.12', 'Docker'],
    implementationStatus: 'All core technologies configured and verified',
  },
  {
    id: 'frontend',
    title: 'Frontend Architecture',
    description: 'Feature-based React architecture with design system, TanStack Query, Zustand state management, and protected routing.',
    icon: 'code2',
    status: 'completed',
    phase: 0,
    difficulty: 'intermediate',
    technologies: ['Vite', 'Tailwind', 'Zustand', 'TanStack Query'],
    implementationStatus: '20+ design system components · Vercel deployed',
  },
  {
    id: 'backend',
    title: 'Backend Architecture',
    description: 'Spring Boot microservice with JWT authentication, feature packages, global exception handling, and OpenAPI documentation.',
    icon: 'server',
    status: 'completed',
    phase: 0,
    difficulty: 'intermediate',
    technologies: ['Spring Boot 3', 'JWT', 'JPA', 'OpenAPI'],
    implementationStatus: 'Health endpoint · Security · Swagger active',
  },
  {
    id: 'python',
    title: 'Python Service Architecture',
    description: 'FastAPI service prepared for pandas, numpy, polars, scikit-learn, and statsmodels integration.',
    icon: 'brain',
    status: 'completed',
    phase: 0,
    difficulty: 'intermediate',
    technologies: ['FastAPI', 'Pydantic', 'Uvicorn'],
    implementationStatus: 'Health endpoint · Faker/Pandas generator · modular ETL pipeline · /api/v1/etl',
  },
  {
    id: 'data-flow',
    title: 'Data Flow',
    description: 'End-to-end data movement from synthetic generation through transformation, analytics, and visualization layers.',
    icon: 'arrow',
    status: 'completed',
    phase: 4,
    difficulty: 'advanced',
    technologies: ['Faker', 'Pandas', 'PostgreSQL', 'DuckDB'],
    implementationStatus: 'Synthetic generator → ETL (4.1) → cleaning (4.2) → analytics warehouse (4.3) · Phase 4 complete',
  },
  {
    id: 'synthetic-generator',
    title: 'Synthetic Data Generator',
    description:
      'Enterprise-scale retail dataset generation with Faker, NumPy, and Pandas — configurable entity volumes, Japanese regional distribution, seasonal demand, promotion impact, and data quality simulation.',
    icon: 'sparkles',
    status: 'completed',
    phase: 3,
    difficulty: 'advanced',
    technologies: ['Faker', 'Pandas', 'NumPy', 'FastAPI'],
    implementationStatus:
      'Generator engine · /generator dashboard · CSV/JSON/Excel export · background jobs · local history',
  },
  {
    id: 'etl',
    title: 'ETL Pipeline',
    description:
      'Modular enterprise ETL: extract (CSV/Excel/JSON/PostgreSQL), validate, clean, transform, normalize, aggregate, load (PostgreSQL/DuckDB), and execution reporting.',
    icon: 'workflow',
    status: 'completed',
    phase: 4,
    difficulty: 'advanced',
    technologies: ['Pandas', 'Polars', 'DuckDB', 'Pydantic'],
    implementationStatus:
      'Sprint 4.1–4.3 complete · modular ETL · warehouse · lineage · execution history · quality dashboard · /etl studio',
  },
  {
    id: 'data-cleaning-engine',
    title: 'Data Cleaning & Transformation Engine',
    description:
      'Production-grade cleaning pipeline: profile → validate → detect missing → detect duplicates → clean → normalize → transform → business rules → quality score → analytics-ready output with full audit trail.',
    icon: 'workflow',
    status: 'completed',
    phase: 4,
    difficulty: 'advanced',
    technologies: ['Pandas', 'NumPy', 'Polars', 'DuckDB', 'Pydantic'],
    implementationStatus:
      'Sprint 4.2 complete · profiling · missing values · duplicates · standardization · dates/currency · business rules · quality score · audit log',
  },
  {
    id: 'analytics-warehouse',
    title: 'Analytics Warehouse',
    description:
      'Star schema analytics layer on PostgreSQL and DuckDB — fact_sales, dim_store, dim_product, dim_customer, dim_supplier, dim_date with full/incremental/append/replace load strategies.',
    icon: 'database',
    status: 'completed',
    phase: 4,
    difficulty: 'advanced',
    technologies: ['DuckDB', 'PostgreSQL', 'Pandas', 'Star Schema'],
    implementationStatus:
      'Sprint 4.3 · warehouse loaders · load engine · warehouse summary API · interfaces for Snowflake/BigQuery/Redshift',
  },
  {
    id: 'data-lineage',
    title: 'Data Lineage',
    description:
      'End-to-end dataset lineage tracking from source files through validation, cleaning, transformation, aggregation, and warehouse tables.',
    icon: 'gitBranch',
    status: 'completed',
    phase: 4,
    difficulty: 'advanced',
    technologies: ['Lineage Graph', 'Audit Log', 'FastAPI'],
    implementationStatus:
      'Sprint 4.3 · lineage engine · structured metadata · /api/v1/etl/lineage · ETL Studio lineage card',
  },
  {
    id: 'analytics',
    title: 'Analytics Pipeline',
    description: 'Real-time and batch analytics processing with dimensional modeling and OLAP capabilities.',
    icon: 'barChart',
    status: 'in-progress',
    phase: 5,
    difficulty: 'advanced',
    technologies: ['Pandas', 'Star Schema', 'OLAP'],
    implementationStatus: 'Phase 5 current — statistics and BI on analytics warehouse',
  },
  {
    id: 'statistics',
    title: 'Statistics Engine',
    description: 'Hypothesis testing, regression analysis, time series decomposition, and statistical modeling.',
    icon: 'activity',
    status: 'planned',
    phase: 5,
    difficulty: 'expert',
    technologies: ['Statsmodels', 'Scikit-learn', 'SciPy'],
    implementationStatus: 'Statistics Lab placeholder — engine in Phase 5',
  },
  {
    id: 'forecasting',
    title: 'Forecasting Engine',
    description: 'Demand forecasting with ARIMA, Prophet, ML ensembles, and scenario planning capabilities.',
    icon: 'lineChart',
    status: 'planned',
    phase: 6,
    difficulty: 'expert',
    technologies: ['Prophet', 'ARIMA', 'XGBoost'],
    implementationStatus: 'Forecasting Center placeholder — models in Phase 6',
  },
  {
    id: 'database',
    title: 'Database Schema',
    description: 'Normalized retail domain model in PostgreSQL with Flyway migrations, UUID keys, indexes, and CHECK constraints for analytics readiness.',
    icon: 'database',
    status: 'completed',
    phase: 2,
    difficulty: 'intermediate',
    technologies: ['PostgreSQL', 'Flyway', 'JPA'],
    implementationStatus: 'Core retail schema deployed — stores, products, customers, suppliers, inventory, sales, promotions, returns',
  },
  {
    id: 'retail-domain',
    title: 'Core Retail Domain Model',
    description: 'Enterprise domain layer with JPA entities, repositories, DTOs, mappers, and API-ready service skeletons for the Japan retail footprint.',
    icon: 'folderTree',
    status: 'completed',
    phase: 2,
    difficulty: 'intermediate',
    technologies: ['Spring Data JPA', 'DTOs', 'OpenAPI'],
    implementationStatus: '9 domain modules · /api/v1 readiness endpoints · docs/data-model.md',
  },
  {
    id: 'microservices',
    title: 'Microservice Communication',
    description: 'REST APIs, async messaging, service discovery, and circuit breaker patterns for resilience.',
    icon: 'gitBranch',
    status: 'completed',
    phase: 0,
    difficulty: 'intermediate',
    technologies: ['REST', 'JWT', 'Docker Network'],
    implementationStatus: 'REST communication active between all services',
  },
  {
    id: 'events',
    title: 'Event Architecture',
    description: 'Event-driven architecture with message queues, event sourcing, and CQRS patterns.',
    icon: 'boxes',
    status: 'future',
    phase: 10,
    difficulty: 'expert',
    technologies: ['Kafka', 'CQRS', 'Event Sourcing'],
    implementationStatus: 'Designed — implementation in Phase 10',
  },
  {
    id: 'kubernetes',
    title: 'Kubernetes Deployment',
    description: 'Container orchestration with Helm charts, auto-scaling, service mesh, and GitOps deployment.',
    icon: 'cloud',
    status: 'planned',
    phase: 11,
    difficulty: 'advanced',
    technologies: ['Kubernetes', 'Helm', 'ArgoCD'],
    implementationStatus: 'K8s manifests prepared — production deploy in Phase 11',
  },
  {
    id: 'monitoring',
    title: 'Monitoring & Observability',
    description: 'Distributed tracing, metrics collection, log aggregation, and alerting with Prometheus and Grafana.',
    icon: 'monitor',
    status: 'planned',
    phase: 12,
    difficulty: 'advanced',
    technologies: ['Prometheus', 'Grafana', 'Jaeger'],
    implementationStatus: 'Pipeline Monitor placeholder — observability in Phase 12',
  },
  {
    id: 'folder-structure',
    title: 'Folder Structure',
    description: 'Enterprise monorepo with independently deployable services and feature-based organization.',
    icon: 'folderTree',
    status: 'completed',
    phase: 0,
    difficulty: 'beginner',
    technologies: ['Monorepo', 'Feature Packages', 'Docker'],
    implementationStatus: 'Full monorepo structure implemented and documented',
  },
  {
    id: 'timeline',
    title: 'Development Timeline',
    description: 'Enterprise roadmap from foundation through portfolio presentation with incremental delivery.',
    icon: 'settings',
    status: 'completed',
    phase: 0,
    difficulty: 'beginner',
    technologies: ['Roadmap', 'Phased Delivery'],
    implementationStatus: `${ENTERPRISE_PHASE_COUNT}-phase enterprise roadmap — Phases 0–4 complete · Phase 5 current`,
  },
]

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  network: Network,
  layers: Layers,
  code2: Code2,
  server: Server,
  brain: Brain,
  arrow: ArrowRightLeft,
  workflow: Workflow,
  barChart: BarChart3,
  activity: Activity,
  lineChart: LineChart,
  database: Database,
  gitBranch: GitBranch,
  boxes: Boxes,
  cloud: Cloud,
  monitor: Monitor,
  folderTree: FolderTree,
  settings: Settings,
  sparkles: Sparkles,
}

function ArchitectureCard({ section }: { section: ArchitectureSection }) {
  const [expanded, setExpanded] = useState(false)
  const Icon = iconMap[section.icon] ?? Server

  return (
    <motion.div
      layout
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="group overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm transition-all duration-300 hover:border-primary/20 hover:shadow-lg"
    >
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-start gap-4 p-6 text-left"
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-accent/10 text-primary transition-transform duration-300 group-hover:scale-105">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <h3 className="text-base font-semibold tracking-tight text-foreground">{section.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground line-clamp-2">
              {section.description}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={section.status as StatusVariant} />
            <DifficultyBadge level={section.difficulty as DifficultyLevel} />
            <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
              Phase {section.phase}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {section.technologies.slice(0, 3).map((tech) => (
              <TechBadge key={tech} label={tech} />
            ))}
            {section.technologies.length > 3 && (
              <TechBadge label={`+${section.technologies.length - 3}`} />
            )}
          </div>
        </div>
        <ChevronDown
          className={cn(
            'mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300',
            expanded && 'rotate-180',
          )}
        />
      </button>

      {expanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="border-t border-border/60 bg-muted/20 px-6 py-5"
        >
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Implementation Status
              </p>
              <p className="mt-1.5 text-sm text-foreground">{section.implementationStatus}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Technologies
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {section.technologies.map((tech) => (
                  <TechBadge key={tech} label={tech} />
                ))}
              </div>
            </div>
            <div className="flex h-28 items-center justify-center rounded-lg border border-dashed border-border/80 bg-background/60">
              <p className="text-xs text-muted-foreground">
                Interactive diagram — available in Phase {section.phase}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export function EngineeringArchitecture() {
  const completedCount = ARCHITECTURE_SECTIONS.filter((s) => s.status === 'completed').length
  const roadmapProgress = getRoadmapProgress()

  return (
    <div className="space-y-10">
      <PageHeader
        title="Engineering Architecture"
        description="Internal engineering documentation portal for system design, technology decisions, and the complete development roadmap."
        badge={{ status: 'completed', label: 'Phases 0–4 Complete' }}
      />

      <Breadcrumb items={[{ label: 'Engineering Architecture' }]} />

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Sections Documented', value: String(ARCHITECTURE_SECTIONS.length) },
          { label: 'Implemented', value: String(completedCount) },
          { label: 'Enterprise Phases', value: String(ENTERPRISE_PHASE_COUNT) },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border/80 bg-card p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      <SectionContainer
        title="Development Roadmap"
        description={`Complete ${ROADMAP_ITEM_COUNT}-milestone timeline (Phases 0–${ENTERPRISE_PHASE_COUNT} plus UX milestone 0.5). ${roadmapProgress.completed} milestones complete; Phase ${CURRENT_PHASE} is current.`}
      >
        <ArchitectureTimeline />
      </SectionContainer>

      <SectionContainer
        title="System Design Reference"
        description="Expand each card for implementation status, technology stack, and future interactive diagrams."
      >
        <div className="grid gap-5 lg:grid-cols-2">
          {ARCHITECTURE_SECTIONS.map((section, i) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <ArchitectureCard section={section} />
            </motion.div>
          ))}
        </div>
      </SectionContainer>
    </div>
  )
}
