import { Component, type ErrorInfo, type ReactNode } from 'react'
import { ErrorState } from '@/components/design-system/ErrorState'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex min-h-[400px] items-center justify-center p-8">
            <ErrorState
              title="Application Error"
              message={this.state.error?.message ?? 'An unexpected error occurred.'}
              onRetry={() => this.setState({ hasError: false, error: undefined })}
            />
          </div>
        )
      )
    }

    return this.props.children
  }
}
