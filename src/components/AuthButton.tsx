"use client";
import { useSession, signIn, signOut } from "next-auth/react";

export default function AuthButtons() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <button disabled>Loading...</button>;
  }

  if (session) {
    return (
      <div>
        <span>{session.user?.name}</span>
        <button onClick={() => signOut({ callbackUrl: "/" })}>Sign out</button>
      </div>
    );
  }

  return <button onClick={() => signIn('keycloak', { callbackUrl: '/' })}>Sign in</button>;
}
