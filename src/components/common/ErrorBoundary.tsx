import * as React from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">Something went wrong</h2>
              <p className="text-xs text-neutral-400 mt-1">
                Aether Analytics encountered an unexpected error while rendering this view.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-left overflow-x-auto text-[11px] font-mono text-rose-400 max-h-32">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                onClick={this.handleReset}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reload Application</span>
              </button>

              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.href = '/';
                }}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Return Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
