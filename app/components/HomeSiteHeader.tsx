import { Suspense } from "react";
import { connection } from "next/server";
import { auth } from "@/lib/auth/server";
import Skeleton from "./ui/Skeleton";
import HomeSiteHeaderClient from "./HomeSiteHeaderClient";

async function SessionAwareHeader() {
  await connection();
  const { data } = await auth.getSession();
  return <HomeSiteHeaderClient isAuthenticated={Boolean(data?.user)} />;
}

function HeaderFallback() {
  return (
    <>
      <div className="top-strip header-fallback-strip" aria-hidden="true">
        <div className="container top-strip-inner">
          <Skeleton width={180} height={8} />
          <Skeleton width={230} height={8} />
        </div>
      </div>
      <header className="site-header" aria-busy="true" aria-label="Carregando navegação">
        <div className="container nav-wrap header-fallback-nav">
          <div className="header-fallback-brand">
            <Skeleton width={35} height={35} />
            <Skeleton width={86} height={22} />
          </div>
          <div className="header-fallback-links">
            <Skeleton width={48} height={11} />
            <Skeleton width={52} height={11} />
            <Skeleton width={68} height={11} />
          </div>
          <Skeleton width={142} height={40} />
        </div>
      </header>
    </>
  );
}

export default function HomeSiteHeader() {
  return (
    <Suspense fallback={<HeaderFallback />}>
      <SessionAwareHeader />
    </Suspense>
  );
}
