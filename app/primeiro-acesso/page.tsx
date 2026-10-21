"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";

export default function FirstAccessPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (password.length < 8) {
      setMessage("Crie uma senha com pelo menos 8 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("As senhas não são iguais.");
      return;
    }

    setBusy(true);
    try {
      const { error } = await authClient.signUp.email({ name, email, password });
      if (error) {
        setMessage("Não foi possível criar a conta. Talvez esse e-mail já esteja cadastrado; nesse caso, será necessário recuperar a senha.");
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setMessage("O cadastro falhou. Confira sua conexão e tente novamente.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="login-page">
      <div className="login-topbar">
        <Link className="brand" href="/" aria-label="Rumo, voltar à página inicial">
          <span className="brand-mark">R</span>
          <span>rumo<span className="brand-period">.</span></span>
        </Link>
        <Link className="login-back-link" href="/login">← Já tenho uma conta</Link>
      </div>
      <div className="login-layout">
        <section className="login-intro">
          <div className="login-intro-grid" aria-hidden="true" />
          <div className="login-intro-content">
            <span className="login-eyebrow"><span /> CONFIGURAÇÃO INICIAL</span>
            <h1>Seu acesso começa com <em>uma boa escolha.</em></h1>
            <p>Crie as credenciais que serão usadas para entrar no painel administrativo do Rumo Blog.</p>
            <div className="login-motto">
              <span className="login-motto-line" />
              <span>Conhecimento. Estratégia. Longo prazo.</span>
            </div>
          </div>
          <div className="login-visual-note"><span>RUMO / ADMIN</span><span>01 — CADASTRO</span></div>
        </section>
        <section className="login-panel" aria-labelledby="setup-title">
          <div className="login-panel-inner">
            <span className="login-step">PRIMEIRO ACESSO <span>01 / 01</span></span>
            <h2 id="setup-title">Criar sua conta.</h2>
            <p className="login-subtitle">Use o mesmo e-mail definido na variável ADMIN_EMAIL da Vercel.</p>
            <form className="login-form" onSubmit={handleSubmit}>
              <label htmlFor="setup-name">Nome</label>
              <input id="setup-name" name="name" autoComplete="name" value={name} onChange={e => setName(e.target.value)} placeholder="Seu nome" required />
              <label htmlFor="setup-email">E-mail administrativo</label>
              <input id="setup-email" name="email" type="email" autoComplete="username" value={email} onChange={e => { setEmail(e.target.value); setMessage(""); }} placeholder="O mesmo e-mail da Vercel" required />
              <label htmlFor="setup-password">Criar senha</label>
              <input id="setup-password" name="password" type="password" autoComplete="new-password" minLength={8} value={password} onChange={e => { setPassword(e.target.value); setMessage(""); }} placeholder="Pelo menos 8 caracteres" required />
              <label htmlFor="setup-confirm-password">Confirmar senha</label>
              <input id="setup-confirm-password" name="confirmPassword" type="password" autoComplete="new-password" minLength={8} value={confirmPassword} onChange={e => { setConfirmPassword(e.target.value); setMessage(""); }} placeholder="Digite a senha novamente" required />
              <button className="login-submit" type="submit" disabled={busy}>{busy ? "Criando conta..." : "Criar conta e entrar"} <span aria-hidden="true">↗</span></button>
              {message && <p className="login-message" role="status">{message}</p>}
            </form>
            <div className="login-security-note">
              <span className="security-symbol" aria-hidden="true">i</span>
              <p>Somente o e-mail autorizado na configuração do site terá acesso ao painel administrativo.</p>
            </div>
            <Link className="login-home-link" href="/login">← Voltar ao login</Link>
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
