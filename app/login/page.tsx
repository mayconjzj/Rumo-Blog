"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const { error } = await authClient.signIn.email({ email, password });

    if (error) {
      setMessage("Não foi possível entrar. Confira o e-mail e a senha.");
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return (
    <main className="login-page">
      <div className="login-topbar">
        <Link className="brand" href="/" aria-label="Rumo, voltar à página inicial">
          <span className="brand-mark">R</span>
          <span>rumo<span className="brand-period">.</span></span>
        </Link>
        <Link className="login-back-link" href="/">← Voltar ao site</Link>
      </div>

      <div className="login-layout">
        <section className="login-intro">
          <div className="login-intro-grid" aria-hidden="true" />
          <div className="login-intro-content">
            <span className="login-eyebrow"><span /> AMBIENTE RESTRITO</span>
            <h1>Uma visão clara começa com <em>boas decisões.</em></h1>
            <p>Acesse a área administrativa do Rumo para gerenciar o conteúdo e manter as ideias em movimento.</p>
            <div className="login-motto">
              <span className="login-motto-line" />
              <span>Conhecimento. Estratégia. Longo prazo.</span>
            </div>
          </div>
          <div className="login-visual-note"><span>RUMO / ADMIN</span><span>01 — ACESSO</span></div>
        </section>

        <section className="login-panel" aria-labelledby="login-title">
          <div className="login-panel-inner">
            <span className="login-step">ÁREA ADMINISTRATIVA <span>01 / 01</span></span>
            <h2 id="login-title">Bem-vindo de volta.</h2>
            <p className="login-subtitle">Entre com suas credenciais administrativas para continuar.</p>

            <form className="login-form" onSubmit={handleSubmit}>
              <label htmlFor="admin-email">E-mail</label>
              <input
                id="admin-email"
                name="email"
                type="email"
                autoComplete="username"
                placeholder="voce@exemplo.com"
                value={email}
                onChange={(event) => { setEmail(event.target.value); setMessage(""); }}
                required
              />

              <div className="login-password-label">
                <label htmlFor="admin-password">Senha</label>
              </div>
              <div className="login-password-field">
                <input
                  id="admin-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(event) => { setPassword(event.target.value); setMessage(""); }}
                  required
                />
                <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}>
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>

              <button className="login-submit" type="submit">Entrar no painel <span aria-hidden="true">↗</span></button>
              {message && <p className="login-message" role="status">{message}</p>}
            </form>

            <div className="login-security-note">
              <span className="security-symbol" aria-hidden="true">i</span>
              <p>Área destinada somente a pessoas autorizadas. Nunca compartilhe suas credenciais.</p>
            </div>
            <Link className="login-home-link" href="/">← Retornar à página inicial</Link>
          </div>
        </section>
      </div>

      <footer className="login-footer">
        <span>© 2026 Rumo Blog</span>
        <span>INFORMAÇÃO PARA DECISÕES MELHORES</span>
      </footer>
    </main>
  );
}
