"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

type Props = { children: ReactNode; label?: string };
type State = { error: Error | null };

/**
 * Class boundary for client islands that should not take down the whole shell.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[ErrorBoundary${this.props.label ? `:${this.props.label}` : ""}]`, error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="rounded-[var(--radius-lg)] border border-danger/30 bg-danger-subtle p-6 text-sm">
          <p className="font-semibold text-danger">This section failed to render</p>
          <p className="mt-1 text-text-secondary">
            {this.state.error.message || "Unknown error"}
          </p>
          <Button
            className="mt-4"
            size="sm"
            variant="secondary"
            onClick={() => this.setState({ error: null })}
          >
            Retry
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}
