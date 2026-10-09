"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, MessageCircle, RefreshCw, ChevronDown, ChevronUp, Copy, Check } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
  copied: boolean;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
      copied: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    console.error("[Dutt ErrorBoundary] Caught error:", error, errorInfo);

    // Silently log to server analytics
    try {
      fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "client_error",
          path: typeof window !== "undefined" ? window.location.pathname : "",
          error: error.message,
          stack: error.stack?.substring(0, 300),
          time: new Date().toISOString(),
        }),
      }).catch(() => {});
    } catch {}
  }

  handleReload = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  handleCopy = () => {
    const errorText = `Hata: ${this.state.error?.message || "Bilinmiyor"}\nKonum: ${
      typeof window !== "undefined" ? window.location.href : ""
    }\nZaman: ${new Date().toLocaleString("tr-TR")}`;

    navigator.clipboard?.writeText(errorText);
    this.setState({ copied: true });
    setTimeout(() => this.setState({ copied: false }), 2000);
  };

  render() {
    if (this.state.hasError) {
      const agencyWp = "905535891629";
      const errorMsg = encodeURIComponent(
        `Merhaba Moka Works Yazılım Destek, Dutt Meyhane QR Menüde bir aksaklık fark ettim:\n\n• Hata: ${
          this.state.error?.message || "Bilinmiyor"
        }\n• Sayfa: ${typeof window !== "undefined" ? window.location.pathname : ""}\n• Saat: ${new Date().toLocaleTimeString(
          "tr-TR"
        )}\n\nLütfen kontrol edebilir misiniz?`
      );
      const wpUrl = `https://wa.me/${agencyWp}?text=${errorMsg}`;

      return (
        <div
          className="min-h-screen flex items-center justify-center p-4 transition-colors font-sans"
          style={{ background: "#120D18", color: "#F3EEF8" }}
        >
          <div
            className="w-full max-w-md rounded-3xl p-6 sm:p-8 border shadow-2xl relative overflow-hidden"
            style={{
              background: "rgba(25, 17, 34, 0.95)",
              borderColor: "rgba(255, 99, 99, 0.4)",
              backdropFilter: "blur(20px)",
            }}
          >
            {/* Ambient Red Glow */}
            <div
              className="absolute -top-16 -right-16 w-36 h-36 rounded-full blur-3xl pointer-events-none opacity-20"
              style={{ background: "#FF4D4D" }}
            />

            {/* Icon Header */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 border"
                style={{
                  background: "rgba(255, 77, 77, 0.15)",
                  borderColor: "rgba(255, 77, 77, 0.35)",
                  color: "#FF6B6B",
                }}
              >
                <AlertTriangle className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-[11px] font-bold tracking-wider uppercase text-red-400">
                  Sistem Bildirimi
                </span>
                <h2 className="text-lg font-bold leading-tight text-white">
                  Geçici Bir Aksaklık Oluştu
                </h2>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs leading-relaxed mb-5" style={{ color: "rgba(243, 238, 248, 0.8)" }}>
              Menüyü görüntülerken beklenmedik bir durum tespit edildi. Sayfayı yenileyebilir veya teknik ekibimizin
              anında müdahale edebilmesi için aşağıdaki butondan{" "}
              <strong className="text-purple-300">yazılım firmasına (Moka Works)</strong> doğrudan bildirebilirsiniz.
            </p>

            {/* Action Buttons */}
            <div className="space-y-2.5">
              <a
                href={wpUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 text-white"
                style={{
                  background: "linear-gradient(135deg, #25D366, #128C7E)",
                }}
              >
                <MessageCircle className="w-4 h-4" />
                <span>Yazılım Firmasına Bildir (WhatsApp)</span>
              </a>

              <button
                type="button"
                onClick={this.handleReload}
                className="w-full py-3 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 border transition-all hover:bg-white/5 active:scale-95 text-purple-200"
                style={{
                  background: "rgba(166, 108, 255, 0.12)",
                  borderColor: "rgba(166, 108, 255, 0.3)",
                }}
              >
                <RefreshCw className="w-4 h-4" />
                <span>Menüyü Yenile</span>
              </button>
            </div>

            {/* Collapsible Tech Details */}
            <div className="mt-5 pt-4 border-t" style={{ borderColor: "rgba(255, 255, 255, 0.08)" }}>
              <button
                type="button"
                onClick={() => this.setState({ showDetails: !this.state.showDetails })}
                className="w-full flex items-center justify-between text-[11px] opacity-60 hover:opacity-100 transition-opacity"
              >
                <span>Teknik Hata Detayları</span>
                {this.state.showDetails ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>

              {this.state.showDetails && (
                <div
                  className="mt-3 p-3 rounded-xl text-[10px] font-mono leading-relaxed break-all space-y-2"
                  style={{ background: "rgba(0, 0, 0, 0.4)", color: "#FF8E8E" }}
                >
                  <p>{this.state.error?.message || "Tanımlanmamış istemci hatası"}</p>
                  <button
                    type="button"
                    onClick={this.handleCopy}
                    className="flex items-center gap-1 text-[10px] text-purple-300 hover:text-white transition-colors"
                  >
                    {this.state.copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                    <span>{this.state.copied ? "Kopyalandı" : "Hata Metnini Kopyala"}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
