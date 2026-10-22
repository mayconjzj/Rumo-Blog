"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";

export default function VerifyExistingEmailForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function sendCode(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    setError("");
    setMessage("");
    setPending(true);
    try {
      const result = await authClient.sendVerificationEmail({
        email: email.trim().toLowerCase(),
        callbackURL: window.location.origin + "/login",
      });
      if (result.error) throw new Error(result.error.message || "Não foi possível enviar o código.");
      setStep("code");
      setMessage("Se esse endereço estiver cadastrado, enviaremos um código de confirmação. Confira também a pasta de spam.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível enviar o código.");
    } finally {
      setPending(false);
    }
  }

  async function verifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    if (!/^\d{6}$/.test(code.trim())) {
      setError("Digite o código numérico de 6 dígitos.");
      return;
    }
    setPending(true);
    try {
      const result = await authClient.emailOtp.verifyEmail({
        email: email.trim().toLowerCase(),
        otp: code.trim(),
      });
      if (result.error) throw new Error(result.error.message || "Código inválido ou expirado.");
      setMessage("E-mail confirmado. Redirecionando para o login…");
      router.replace("/login?cadastro=verificado");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível confirmar o e-mail.");
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      {error && <p className="community-auth-error" role="alert">{error}</p>}
      {message && <p className="community-auth-success" role="status">{message}</p>}
      {step === "email" ? (
        <form className="login-form community-login-form" onSubmit={sendCode}>
          <label htmlFor="verify-existing-email">E-mail da conta</label>
          <input id="verify-existing-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="voce@exemplo.com" required />
          <button className="login-submit" type="submit" disabled={pending}>
            {pending ? "Enviando…" : "Enviar código"} <span aria-hidden="true">↗</span>
          </button>
        </form>
      ) : (
        <form className="login-form community-login-form" onSubmit={verifyCode}>
          <label htmlFor="verify-existing-code">Código enviado para {email}</label>
          <input id="verify-existing-code" type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="000000" required />
          <button className="login-submit" type="submit" disabled={pending}>
            {pending ? "Confirmando…" : "Confirmar e-mail"} <span aria-hidden="true">↗</span>
          </button>
          <button className="community-auth-resend" type="button" onClick={() => void sendCode()} disabled={pending}>Reenviar código</button>
          <button className="community-auth-resend" type="button" onClick={() => { setStep("email"); setCode(""); setMessage(""); setError(""); }}>Usar outro e-mail</button>
        </form>
      )}
    </>
  );
}
