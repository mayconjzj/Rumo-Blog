import { Suspense } from "react";
import { connection } from "next/server";
import { auth } from "@/lib/auth/server";
import { communitySignOutAction } from "../comunidade/actions";
import Brand from "./ui/Brand";
import Button from "./ui/Button";
import HomeSiteHeaderClient from "./HomeSiteHeaderClient";

async function DesktopSessionActions() {
  await connection();
  const { data } = await auth.getSession();
  return (
    <div className="public-auth-actions">
      {data?.user ? (
        <form action={communitySignOutAction}>
          <Button type="submit" variant="outline" className="public-login-link public-logout-button">Sair</Button>
        </form>
      ) : (
        <>
          <Button href="/login" variant="outline" className="public-login-link">Entrar</Button>
          <Button href="/sign-up" variant="navy" className="public-signup-link" arrow="up-right">Criar conta</Button>
        </>
      )}
    </div>
  );
}

async function MobileSessionActions() {
  await connection();
  const { data } = await auth.getSession();
  return (
    <div className="mobile-auth-actions">
      {data?.user ? (
        <form action={communitySignOutAction}>
          <Button type="submit" variant="outline" className="mobile-logout-button">Sair da conta</Button>
        </form>
      ) : (
        <>
          <Button href="/login" variant="outline" className="mobile-login-link">Entrar</Button>
          <Button href="/sign-up" variant="navy" className="mobile-signup-link" arrow="up-right">Criar conta</Button>
        </>
      )}
    </div>
  );
}

function AuthFallback({ mobile = false }: { mobile?: boolean }) {
  return mobile ? (
    <div className="mobile-auth-actions">
      <Button href="/login" variant="outline" className="mobile-login-link">Entrar</Button>
      <Button href="/sign-up" variant="navy" className="mobile-signup-link" arrow="up-right">Criar conta</Button>
    </div>
  ) : (
    <div className="public-auth-actions">
      <Button href="/login" variant="outline" className="public-login-link">Entrar</Button>
      <Button href="/sign-up" variant="navy" className="public-signup-link" arrow="up-right">Criar conta</Button>
    </div>
  );
}

export default function HomeSiteHeader() {
  return (
    <>
      <div className="top-strip">
        <div className="container top-strip-inner">
          <span>REVISTA CIENTÍFICA MULTIDISCIPLINAR</span>
          <span>Ciência aberta · leitura gratuita · submissões gratuitas</span>
        </div>
      </div>
      <header className="site-header">
        <div className="container nav-wrap">
          <Brand label="Rumo, página inicial" />
          <HomeSiteHeaderClient
            mobileActions={
              <Suspense fallback={<AuthFallback mobile />}>
                <MobileSessionActions />
              </Suspense>
            }
          />
          <Suspense fallback={<AuthFallback />}>
            <DesktopSessionActions />
          </Suspense>
          <Button href="/submeter" variant="outline" className="admin-link" arrow="up-right">Submeter artigo</Button>
        </div>
      </header>
    </>
  );
}
