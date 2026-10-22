import { auth } from "@/lib/auth/server";
import HomeSiteHeaderClient from "./HomeSiteHeaderClient";

export default async function HomeSiteHeader() {
  const { data } = await auth.getSession();
  return <HomeSiteHeaderClient isAuthenticated={Boolean(data?.user)} />;
}
