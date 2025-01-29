import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import axiosInstance from "../../../utils/axiosInstance";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          // Remplacez par l'URL de votre API backend PHP
          const res = await axiosInstance.post("/login.php", {
            username: credentials.username,
            password: credentials.password,
          });

          const user = res.data; // Assurez-vous que votre API renvoie un objet utilisateur

          if (user && user.id) {
            return user;
          }
          return null;
        } catch (error) {
          console.error("Authentication error:", error.response?.data || error.message);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login", // Page de connexion personnalisée (optionnel)
  },
  secret: process.env.NEXTAUTH_SECRET,
});
