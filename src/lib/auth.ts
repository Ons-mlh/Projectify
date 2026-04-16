import { NextAuthOptions } from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";
import type { JWT } from 'next-auth/jwt'

export const authOptions: NextAuthOptions = {
    providers: [
        KeycloakProvider({
            clientId: process.env.KEYCLOAK_CLIENT_ID!,
            clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
            issuer: process.env.KEYCLOAK_ISSUER!,
        }),
    ],

    pages: {
        signIn: '/signin',
        error: '/error',
    },

    callbacks: {
        async jwt({ token, account }) {

            if (account) {
                return {
                    ...token,
                    accessToken: account.access_token,
                    refreshToken: account.refresh_token,
                    idToken: account.id_token,
                    expiresAt: account.expires_at! * 1000,
                };
            }

            if (Date.now() < (token.expiresAt as number)) {
                return token;
            }

            return await refreshAccessToken(token);
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken as string | undefined;
            session.error = token.error as string | undefined;
            session.refreshToken = token.refreshToken;
            return session;
        },
    },

    events: {
        async signOut({ token }: { token: JWT }) {
            const logoutUrl = `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/logout`
            await fetch(logoutUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    client_id: process.env.KEYCLOAK_CLIENT_ID!,
                    client_secret: process.env.KEYCLOAK_CLIENT_SECRET!,
                    refresh_token: token.refreshToken as string,
                }),
            })
        },
    },
};

async function refreshAccessToken(token: any) {
    try {
        const url = `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                client_id: process.env.KEYCLOAK_CLIENT_ID!,
                client_secret: process.env.KEYCLOAK_CLIENT_SECRET!,
                grant_type: "refresh_token",
                refresh_token: token.refreshToken,
            }),
        });

        const refreshedTokens = await response.json();

        if (!response.ok) {
            throw refreshedTokens;
        }

        return {
            ...token,
            accessToken: refreshedTokens.access_token,
            idToken: refreshedTokens.id_token,
            refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
            expiresAt: Date.now() + refreshedTokens.expires_in * 1000,
        };
    } catch (error) {
        console.error("RefreshAccessTokenError", error);

        return {
            ...token,
            error: "RefreshAccessTokenError",
        };
    }
}
