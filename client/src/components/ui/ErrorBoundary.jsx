import React, { Component } from 'react';
import { ShieldAlert, RefreshCw, Terminal, Home } from 'lucide-react';
import GlassCard from './GlassCard';
import NeonButton from './NeonButton';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('AEGIS Subsystem Error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#05060F] text-slate-100 flex items-center justify-center p-6 font-sans">
          <div className="max-w-xl w-full">
            <GlassCard variant="magenta" className="space-y-6 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="p-3.5 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 shadow-[0_0_30px_rgba(244,63,94,0.3)]">
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-rose-400">
                    ANOMALY DETECTED // ERROR 0xEF44
                  </div>
                  <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-white">
                    Subsystem Runtime Exception
                  </h1>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                The Aegis cryptographic interface encountered an unexpected execution
                fault. Client memory and local session integrity remain preserved.
              </p>

              {/* Error Details Terminal */}
              <div className="p-3.5 rounded-xl bg-[#03040A] border border-white/10 font-mono text-left text-xs space-y-1.5 text-rose-300 overflow-x-auto max-h-40">
                <div className="flex items-center gap-2 text-slate-400">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>EXCEPTION LOG</span>
                </div>
                <div className="text-[11px] break-all">
                  {this.state.error?.toString() || 'Unknown error'}
                </div>
              </div>

              {/* Recovery Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <NeonButton
                  variant="danger"
                  size="md"
                  leftIcon={<RefreshCw className="w-4 h-4" />}
                  onClick={this.handleReload}
                >
                  Reboot Defense Matrix
                </NeonButton>
                <NeonButton
                  variant="outline"
                  size="md"
                  leftIcon={<Home className="w-4 h-4" />}
                  onClick={this.handleReset}
                >
                  Attempt Soft Recovery
                </NeonButton>
              </div>
            </GlassCard>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
