import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const secret = process.env.NEXTAUTH_SECRET;
if (!secret) {
  throw new Error("Falta la variable de entorno NEXTAUTH_SECRET");
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Correo y contraseña",
      credentials: {
        email: {
          label: "Correo",
          type: "email",
          placeholder: "correo@ejemplo.com",
        },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Correo y contraseña requeridos");
        }
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) throw new Error("Usuario o contraseña incorrectos");
        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) throw new Error("Usuario o contraseña incorrectos");
        return { id: user.id, email: user.email };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 8, // 8 horas
  },
  jwt: {
    secret,
    maxAge: 60 * 60 * 8, // 8 horas
    // Algoritmo explícito para compatibilidad
    encode: async ({ token, secret }) => {
      const { SignJWT } = await import("jose");
      return await new SignJWT(token)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("8h")
        .sign(new TextEncoder().encode(secret));
    },
    decode: async ({ token, secret }) => {
      const { jwtVerify } = await import("jose");
      try {
        const { payload } = await jwtVerify(
          token,
          new TextEncoder().encode(secret)
        );
        return payload;
      } catch {
        return null;
      }
    },
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = { id: token.id, email: token.email };
      }
      return session;
    },
  },
  secret,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
