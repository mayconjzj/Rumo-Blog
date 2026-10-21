"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth/client";

export default function ResetPasswordForm() {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setToken(params.get("token") ?? "");
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!token) {
      setError("O link de redefinição está ausente ou inválido. Solicite outro e-mail.");
      return;
    }
    if (password.length < 8) {
      setError("A nova senha precisa ter pelo menos 8 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setPending(true);
    try {
      const result = await authClient.resetPassword({ token, newPassword: password });
      if (result.error) {
        setError("Não foi possível alterar a senha. O link pode ter expirado; solicite outro.");
        return;
      }
      setComplete(true);
      setMessage("Senha alterada com sucesso. Agora você pode entrar com a nova senha.");
    } catch {
      setError("Não foi possível alterar a senha. O link pode ter expirado; solicite outro.");
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
            <span className="login-eyebrow"><span /> NOVA SENHA</span>
            <h1>Um novo acesso começa com uma <em>nova senha.</em></h1>
            <p>Escolha uma senha segura para proteger a área administrativa da Revista Rumo.</p>
            <div className="login-motto">
              <span className="login-motto-line" />
              <span>Conhecimento. Estratégia. Longo prazo.</span>
            </div>
          </div>
          <div className="login-visual-note"><span>RUMO / ADMIN</span><span>RECUPERAÇÃO</span></div>
        </section>

        <section className="login-panel" aria-labelledby="reset-title">
          <div className="login-panel-inner">
            <span className="login-step">DEFINIR NOVA SENHA <span>02 / 02</span></span>
            <h2 id="reset-title">{complete ? "Acesso recuperado." : "Crie sua nova senha."}</h2>
            <p className="login-subtitle">Use pelo menos 8 caracteres. Não reutilize uma senha de outro serviço.</p>

            {complete ? (
              <>
                <p className="login-message" role="status">{message}</p>
                <Link className="login-submit" href="/login">Ir para o login <span aria-hidden="true">↗</span></Link>
              </>
            ) : (
              <form className="login-form" onSubmit={handleSubmit}>
                <label htmlFor="new-password">Nova senha</label>
                <input
                  id="new-password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Mínimo de 8 caracteres"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  minLength={8}
                  required
                />
                <label htmlFor="confirm-password">Confirmar nova senha</label>
                <input
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Digite a senha novamente"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  minLength={8}
                  required
                />
                <button className="login-submit" type="submit" disabled={pending}>
                  {pending ? "Salvando..." : "Alterar senha"} <span aria-hidden="true">↗</span>
                </button>
                {error && <p className="login-message" role="alert">{error}</p>}
              </form>
            )}

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
