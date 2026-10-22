"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth/client";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");

    try {
      const result = await authClient.requestPasswordReset({
        email: email.trim().toLowerCase(),
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (result.error) {
        setError("Não foi possível solicitar a redefinição agora. Tente novamente mais tarde.");
      } else {
        setSent(true);
      }
    } catch {
      setError("Não foi possível solicitar a redefinição agora. Tente novamente mais tarde.");
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      {sent ? (
        <p className="community-auth-success" role="status">
          Se houver uma conta cadastrada com esse e-mail, enviaremos um link para redefinir a senha. Confira também a pasta de spam.
        </p>
      ) : (
        <form className="community-auth-form" onSubmit={handleSubmit}>
          <label htmlFor="recovery-email">E-mail da sua conta</label>
          <input id="recovery-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} maxLength={254} required />
          {error && <p className="community-auth-error" role="alert">{error}</p>}
          <button type="submit" disabled={pending}>{pending ? "Enviando..." : "Enviar link de redefinição ↗"}</button>
        </form>
      )}
      <p className="community-auth-switch"><Link href="/login">Voltar para entrar</Link></p>
    </>
  );
}

export function ResetPasswordForm({ token }: { token: string }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password.length < 10) {
      setError("A senha precisa ter pelo menos 10 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }
    if (!token) {
      setError("Este link está incompleto ou inválido. Solicite outro link de redefinição.");
      return;
    }

    setPending(true);
    try {
      const result = await authClient.resetPassword({ newPassword: password, token });
      if (result.error) {
        setError("Este link é inválido ou expirou. Solicite um novo link de redefinição.");
      } else {
        setSuccess(true);
      }
    } catch {
      setError("Não foi possível redefinir a senha. Solicite um novo link e tente novamente.");
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      {success ? (
        <>
          <p className="community-auth-success" role="status">Senha redefinida com sucesso. Agora você pode entrar com a nova senha.</p>
          <p className="community-auth-switch"><Link href="/login">Ir para o login</Link></p>
        </>
      ) : (
        <>
          {!token && <p className="community-auth-error" role="alert">O link está incompleto. Solicite outro na página de recuperação de senha.</p>}
          <form className="community-auth-form" onSubmit={handleSubmit}>
            <label htmlFor="new-password">Nova senha (mínimo 10 caracteres)</label>
            <input id="new-password" type="password" autoComplete="new-password" minLength={10} value={password} onChange={(event) => setPassword(event.target.value)} required />
            <label htmlFor="confirm-new-password">Confirme a nova senha</label>
            <input id="confirm-new-password" type="password" autoComplete="new-password" minLength={10} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required />
            {error && <p className="community-auth-error" role="alert">{error}</p>}
            <button type="submit" disabled={pending || !token}>{pending ? "Salvando..." : "Redefinir senha ↗"}</button>
          </form>
          <p className="community-auth-switch"><Link href="/forgot-password">Solicitar outro link</Link></p>
        </>
      )}
    </>
  );
}
