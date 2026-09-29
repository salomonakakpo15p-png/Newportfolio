import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Application crash:', error, info.componentStack)
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-[#020817] px-6 text-center">
          <div className="flex flex-col items-center gap-3">
            <span className="inline-flex size-14 items-center justify-center rounded-full bg-cyan/10 text-2xl">
              !
            </span>
            <h1 className="font-display text-2xl font-semibold text-white">Something went wrong</h1>
            <p className="max-w-md text-sm leading-relaxed text-slate-400">
              An unexpected error occurred. Your messages are still being processed — reloading
              usually fixes it.
            </p>
          </div>
          <button
            type="button"
            onClick={this.handleReload}
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan to-cyan-bright px-6 py-3 text-sm font-semibold text-[#020817] transition-transform hover:-translate-y-0.5"
          >
            Reload the page
          </button>
          <details className="max-w-lg text-left text-xs text-slate-500">
            <summary className="cursor-pointer select-none">Technical details</summary>
            <pre className="mt-2 whitespace-pre-wrap break-words">{String(this.state.error)}</pre>
          </details>
        </div>
      )
    }
    return this.props.children
  }
}
