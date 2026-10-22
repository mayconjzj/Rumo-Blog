"use client";

import { useState } from "react";
import { communitySignInAction } from "../comunidade/actions";
import GoogleAuthButton from "../components/GoogleAuthButton";

export default function CommunityLoginForm({ returnTo }: { returnTo: string }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <div className="google-auth-section">
        <GoogleAuthButton returnTo={returnTo} />
        <div className="auth-divider"><span>ou entre com e-mail</span></div>
      </div>
      <form action={communitySignInAction} className="login-form community-login-form">
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

      <button className="login-submit" type="submit">
        Entrar <span aria-hidden="true">↗</span>
      </button>
      </form>
    </>
  );
}
