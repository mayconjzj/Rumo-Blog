"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth/client";

type GoogleAuthButtonProps = {
  returnTo: string;
  label?: string;
};

export default function GoogleAuthButton({
  returnTo,
  label = "Continuar com Google",
}: GoogleAuthButtonProps) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function handleGoogleSignIn() {
    setPending(true);
    setError("");

    try {
      const safeReturnTo =
        returnTo === "/submeter" ||
        (returnTo.startsWith("/pesquisas/") && !returnTo.startsWith("//"))
          ? returnTo
          : "/pesquisas";
      const callbackURL = new URL("/auth/callback", window.location.origin);
      callbackURL.searchParams.set("returnTo", safeReturnTo);

      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: callbackURL.toString(),
      });

      if (result.error) {
        throw new Error(result.error.message || "Não foi possível continuar com o Google.");
      }
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Não foi possível continuar com o Google. Tente novamente.",
      );
      setPending(false);
    }
  }

  return (
    <div className="google-auth-wrap">
      <button
        type="button"
        className="google-auth-button"
        onClick={handleGoogleSignIn}
        disabled={pending}
      >
        <svg aria-hidden="true" viewBox="0 0 48 48" width="19" height="19">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 3.07 13.22l7.98 6.19C12.97 13.72 18.01 9.5 24 9.5Z" transform="translate(0 4)" />
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.76 7.18l7.73 6C44.42 37.96 46.98 31.9 46.98 24.55Z" />
          <path fill="#FBBC05" d="M10.65 28.59A14.4 14.4 0 0 1 9.9 24c0-1.59.27-3.13.75-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.57 10.78l8.08-6.19Z" transform="translate(0 0)" />
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.14 1.44-4.88 2.3-8.18 2.3-5.99 0-11.03-4.22-12.95-9.91l-8.08 6.19C6.44 42.62 14.62 48 24 48Z" />
        </svg>
        <span>{pending ? "Conectando…" : label}</span>
      </button>
      {error && <p className="community-auth-error" role="alert">{error}</p>}
    </div>
  );
}
