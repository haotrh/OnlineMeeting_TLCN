import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { JwtUtils } from "../../../utils/JwtUtils";

export const refreshToken = async function (refreshToken: string) {
  try {
    const response = await axios.post(
      "http://localhost:3001/api/auth/refresh-token",
      {
        refreshToken,
      }
    );
    const data = response.data;
    return data;
  } catch (err: any) {
    console.log(err?.response.data);
    return null;
  }
};

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID as string,
      clientSecret: process.env.FACEBOOK_SECRET as string,
    }),
    //@ts-ignore
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any, req) {
        try {
          const res = await axios.post("http://localhost:3001/api/auth/login", {
            email: credentials.email,
            password: credentials.password,
          });
          const data = res.data;
          return data;
        } catch (err: any) {
          console.log(err?.response?.data);
          return null;
        }
      },
    }),
  ],
  session: {
    jwt: true,
    maxAge: 24 * 60 * 60 * 7,
  },
  jwt: {
    secret: process.env.JWT_SECRET as string,
  },
  callbacks: {
    async jwt({ token, user, account }: any): Promise<any> {
      console.log(process.env.NEXTAUTH_URL);
      console.log(process.env.GOOGLE_ID);
      console.log("sdwsad");
      if (user) {
        if (account?.provider === "google") {
          const { id_token } = account;

          try {
            const response = await axios.post(
              "http://localhost:3001/api/auth/login-google",
              {
                idToken: id_token,
              }
            );

            const data = response.data;
            token = {
              user: data.user,
              accessToken: data.tokens.access.token,
              refreshToken: data.tokens.refresh.token,
            };

            return token;
          } catch (err: any) {
            console.log(err?.response.data);
            return null;
          }
        }

        if (account?.provider === "facebook") {
          const { access_token } = account;
          try {
            const response = await axios.post(
              "http://localhost:3001/api/auth/login-facebook",
              {
                accessToken: access_token,
              }
            );

            const data = response.data;

            token = {
              user: data.user,
              accessToken: data.tokens.access.token,
              refreshToken: data.tokens.refresh.token,
            };
            return token;
          } catch (err: any) {
            console.log(err?.response.data);
            return { error: err?.response.data };
          }
        }

        //@ts-ignore
        return {
          user: user.user,
          accessToken: user?.tokens?.access.token,
          refreshToken: user?.tokens?.refresh.token,
        };
      }

      if (JwtUtils.isJwtExpired(token.accessToken as string)) {
        const tokens = await refreshToken(token.refreshToken as string);

        if (tokens) {
          token = {
            ...token,
            accessToken: tokens.access.token,
            refreshToken: tokens.refresh.token,
          };

          console.log(token);

          return token;
        }

        return {
          ...token,
          exp: 0,
        };
      }

      return token;
    },
    async session({ token, session }: { session: any; token: any }) {
      console.log("sessioncalled");
      session.user = token.user;
      session.accessToken = token.accessToken;

      return session;
    },
  },
  pages: {
    error: "http://localhost:3000/login",
  },
});
