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
    implementationStatus: 'Health endpoint · Module structure prepared',
  },
  {
    id: 'data-flow',
    title: 'Data Flow',
    description: 'End-to-end data movement from ingestion through transformation, analytics, and visualization layers.',
    icon: 'arrow',
    status: 'planned',
    phase: 4,
    difficulty: 'advanced',
    technologies: ['Polars', 'DuckDB', 'PostgreSQL'],
    implementationStatus: 'Architecture documented — implementation in Phase 4',
  },
  {
    id: 'etl',
    title: 'ETL Pipeline',
    description: 'Batch and streaming ETL pipelines with validation, error handling, and pipeline orchestration.',
    icon: 'workflow',
    status: 'planned',
    phase: 4,
    difficulty: 'advanced',
    technologies: ['Python', 'SQLAlchemy', 'Airflow'],
    implementationStatus: 'Placeholder UI ready — pipeline engine pending',
  },
  {
    id: 'analytics',
    title: 'Analytics Pipeline',
    description: 'Real-time and batch analytics processing with dimensional modeling and OLAP capabilities.',
    icon: 'barChart',
    status: 'planned',
    phase: 5,
    difficulty: 'advanced',
    technologies: ['Pandas', 'Star Schema', 'OLAP'],
    implementationStatus: 'Module shell created — analytics engine pending',
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
    phase: 7,
    difficulty: 'expert',
    technologies: ['Prophet', 'ARIMA', 'XGBoost'],
    implementationStatus: 'Forecasting Center placeholder — models in Phase 7',
  },
  {
    id: 'database',
    title: 'Database Schema',
    description: 'Normalized retail data model with star schema for analytics, audit trails, and temporal tables.',
    icon: 'database',
    status: 'planned',
    phase: 3,
    difficulty: 'intermediate',
    technologies: ['PostgreSQL', 'Flyway', 'Star Schema'],
    implementationStatus: 'Bootstrap schema only — business tables in Phase 3',
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
    phase: 12,
    difficulty: 'advanced',
    technologies: ['Kubernetes', 'Helm', 'ArgoCD'],
    implementationStatus: 'K8s manifests prepared — production deploy in Phase 12',
  },
  {
    id: 'monitoring',
    title: 'Monitoring & Observability',
    description: 'Distributed tracing, metrics collection, log aggregation, and alerting with Prometheus and Grafana.',
    icon: 'monitor',
    status: 'planned',
    phase: 13,
    difficulty: 'advanced',
    technologies: ['Prometheus', 'Grafana', 'Jaeger'],
    implementationStatus: 'Pipeline Monitor placeholder — observability in Phase 13',
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
    description: 'Fifteen-phase roadmap from foundation through portfolio polish with incremental delivery.',
    icon: 'settings',
    status: 'completed',
    phase: 0,
    difficulty: 'beginner',
    technologies: ['Roadmap', 'Phased Delivery'],
    implementationStatus: '15-phase roadmap defined — Phase 0 complete',
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

  return (
    <div className="space-y-10">
      <PageHeader
        title="Engineering Architecture"
        description="Internal engineering documentation portal for system design, technology decisions, and the complete development roadmap."
        badge={{ status: 'completed', label: 'Phase 0 Complete' }}
      />

      <Breadcrumb items={[{ label: 'Engineering Architecture' }]} />

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Sections Documented', value: String(ARCHITECTURE_SECTIONS.length) },
          { label: 'Implemented', value: String(completedCount) },
          { label: 'Total Phases', value: '15' },
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
        description="Complete project timeline from enterprise foundation through portfolio polish. Phase 0 is complete; future phases are locked until prior dependencies are delivered."
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
