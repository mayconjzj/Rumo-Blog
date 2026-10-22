"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";

type CommunitySignUpFormProps = { returnTo: string };

export default function CommunitySignUpForm({ returnTo }: CommunitySignUpFormProps) {
  const router = useRouter();
  const [step, setStep] = useState<"signup" | "verify">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSignUp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (password.length < 10) {
      setError("A senha precisa ter pelo menos 10 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setPending(true);
    try {
      const result = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });
      if (result.error) throw new Error(result.error.message || "Não foi possível criar a conta.");

      const user = result.data?.user;
      if (!user) throw new Error("A conta não foi criada. Tente novamente.");

      if (user.emailVerified) {
        router.replace(returnTo);
        router.refresh();
        return;
      }

      const verification = await authClient.sendVerificationEmail({
        email: email.trim().toLowerCase(),
        callbackURL: window.location.origin + "/login",
      });
      if (verification.error) {
        throw new Error("A conta foi criada, mas não foi possível enviar o código. Tente reenviar a confirmação.");
      }

      if (result.data?.session) await authClient.signOut();
      setStep("verify");
      setMessage("Enviamos um código de confirmação para seu e-mail. Ele expira em 15 minutos.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Ocorreu um erro ao criar a conta.");
    } finally {
      setPending(false);
    }
  }

  async function handleVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");

    const normalizedCode = code.trim();
    if (!/^\\d{6}$/.test(normalizedCode)) {
      setError("Digite o código numérico de 6 dígitos recebido por e-mail.");
      return;
    }

    setPending(true);
    try {
      const result = await authClient.emailOtp.verifyEmail({
        email: email.trim().toLowerCase(),
        otp: normalizedCode,
      });
      if (result.error) throw new Error(result.error.message || "Código inválido ou expirado.");

      setMessage("E-mail confirmado com sucesso. Redirecionando…");
      router.replace(returnTo);
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível confirmar o e-mail.");
    } finally {
      setPending(false);
    }
  }

  async function handleResend() {
    setMessage("");
    setError("");
    setPending(true);
    try {
      const result = await authClient.sendVerificationEmail({
        email: email.trim().toLowerCase(),
        callbackURL: window.location.origin + "/login",
      });
      if (result.error) throw new Error(result.error.message || "Não foi possível reenviar o código.");
      setMessage("Enviamos um novo código. Confira também a pasta de spam.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível reenviar o código.");
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      {error && <p className="community-auth-error" role="alert">{error}</p>}
      {message && <p className="community-auth-success" role="status">{message}</p>}

      {step === "signup" ? (
        <form onSubmit={handleSignUp} className="login-form community-login-form">
          <label htmlFor="community-name">Nome público</label>
          <input id="community-name" name="name" type="text" autoComplete="name" minLength={2} maxLength={100} placeholder="Como seu nome será exibido" value={name} onChange={(event) => setName(event.target.value)} required />
          <label htmlFor="community-signup-email">E-mail</label>
          <input id="community-signup-email" name="email" type="email" autoComplete="email" maxLength={254} placeholder="voce@exemplo.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <label htmlFor="community-signup-password">Senha (mínimo 10 caracteres)</label>
          <input id="community-signup-password" name="password" type="password" autoComplete="new-password" minLength={10} placeholder="Crie uma senha segura" value={password} onChange={(event) => setPassword(event.target.value)} required />
          <label htmlFor="community-confirm-password">Confirme a senha</label>
          <input id="community-confirm-password" name="confirmPassword" type="password" autoComplete="new-password" minLength={10} placeholder="Digite a senha novamente" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required />
          <button className="login-submit" type="submit" disabled={pending}>
            {pending ? "Criando conta…" : "Criar conta"} <span aria-hidden="true">↗</span>
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="login-form community-login-form">
          <p className="login-subtitle">Digite o código de 6 dígitos enviado para <strong>{email}</strong>.</p>
          <label htmlFor="community-verification-code">Código de confirmação</label>
          <input id="community-verification-code" name="code" type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} placeholder="000000" value={code} onChange={(event) => setCode(event.target.value.replace(/\\D/g, "").slice(0, 6))} required />
          <button className="login-submit" type="submit" disabled={pending}>
            {pending ? "Confirmando…" : "Confirmar e-mail"} <span aria-hidden="true">↗</span>
          </button>
          <button className="community-auth-resend" type="button" onClick={handleResend} disabled={pending}>Reenviar código</button>
          <button className="community-auth-resend" type="button" onClick={() => { setStep("signup"); setCode(""); setMessage(""); setError(""); }}>Voltar ao cadastro</button>
        </form>
      )}
    </>
  );
}
