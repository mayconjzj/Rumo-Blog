"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";
import { getCommunityPostSignInPath } from "../comunidade/actions";
import GoogleAuthButton from "../components/GoogleAuthButton";

export default function CommunityLoginForm({ returnTo }: { returnTo: string }) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function handleSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");

    try {
      const result = await authClient.signIn.email({ email, password });
      if (result.error) {
        throw new Error(result.error.message || "Não foi possível entrar. Confira o e-mail e a senha.");
      }

      const destination = await getCommunityPostSignInPath(returnTo);
      if (destination.startsWith("/login?")) {
        throw new Error("O login foi aceito, mas a sessão não foi reconhecida. Tente novamente.");
      }

      router.replace(destination);
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível entrar. Tente novamente.");
      setPending(false);
    }
  }

  return (
    <>
      <div className="google-auth-section">
        <GoogleAuthButton returnTo={returnTo} />
        <div className="auth-divider"><span>ou entre com e-mail</span></div>
      </div>
      {error && <p className="community-auth-error" role="alert">{error}</p>}
      <form onSubmit={handleSignIn} className="login-form community-login-form">
        <input type="hidden" name="returnTo" value={returnTo} />
        <label htmlFor="community-email">E-mail</label>
        <input
          id="community-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="voce@exemplo.com"
          required
        />

        <div className="login-password-label">
          <label htmlFor="community-password">Senha</label>
        </div>
        <div className="login-password-field">
          <input
            id="community-password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Digite sua senha"
            required
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
          >
            {showPassword ? "Ocultar" : "Mostrar"}
          </button>
        </div>

        <button className="login-submit" type="submit" disabled={pending}>
          {pending ? "Entrando…" : "Entrar"} <span aria-hidden="true">↗</span>
        </button>
      </form>
    </>
  );
}
