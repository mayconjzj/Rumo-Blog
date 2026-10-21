"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth/client";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    setPending(true);

    try {
      const result = await authClient.requestPasswordReset({
        email: email.trim(),
        redirectTo: `${window.location.origin}/redefinir-senha`,
      });

      if (result.error) {
        setError("Não foi possível solicitar a redefinição agora. Tente novamente em alguns minutos.");
        return;
      }

      setMessage("Se este e-mail estiver cadastrado, você receberá uma mensagem com as instruções para criar uma nova senha. Confira também o spam.");
    } catch {
      setError("Não foi possível solicitar a redefinição agora. Tente novamente em alguns minutos.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="login-page">
      <div className="login-topbar">
        <Link className="brand" href="/" aria-label="Rumo, voltar à página inicial">
          <span className="brand-mark">R</span>
          <span>rumo<span className="brand-period">.</span></span>
        </Link>
        <Link className="login-back-link" href="/login">Voltar ao login</Link>
      </div>

      <div className="login-layout">
        <section className="login-intro">
          <div className="login-intro-grid" aria-hidden="true" />
          <div className="login-intro-content">
            <span className="login-eyebrow"><span /> RECUPERAÇÃO DE ACESSO</span>
            <h1>Retome o acesso à sua <em>área administrativa.</em></h1>
            <p>Enviaremos as instruções para o e-mail informado, caso ele esteja cadastrado.</p>
            <div className="login-motto">
              <span className="login-motto-line" />
              <span>Conhecimento. Estratégia. Longo prazo.</span>
            </div>
          </div>
          <div className="login-visual-note"><span>RUMO / ADMIN</span><span>RECUPERAÇÃO</span></div>
        </section>

        <section className="login-panel" aria-labelledby="recovery-title">
          <div className="login-panel-inner">
            <span className="login-step">RECUPERAR SENHA <span>01 / 02</span></span>
            <h2 id="recovery-title">Vamos recuperar seu acesso.</h2>
            <p className="login-subtitle">Informe o mesmo e-mail usado no painel administrativo.</p>

            <form className="login-form" onSubmit={handleSubmit}>
              <label htmlFor="recovery-email">E-mail</label>
              <input
                id="recovery-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="voce@exemplo.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
              <button className="login-submit" type="submit" disabled={pending}>
                {pending ? "Enviando..." : "Enviar instruções"} <span aria-hidden="true">↗</span>
              </button>
              {message && <p className="login-message" role="status">{message}</p>}
              {error && <p className="login-message" role="alert">{error}</p>}
            </form>

            <Link className="login-home-link" href="/login">← Voltar ao login</Link>
          </div>
        </section>
      </div>

      <footer className="login-footer">
        <span>© 2026 Revista Rumo</span>
        <span>ACESSO RESTRITO</span>
      </footer>
    </main>
  );
}
