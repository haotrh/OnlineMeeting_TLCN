import axios from "../../../lib/serverAxios";
import _ from "lodash";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import urljoin from "url-join";
import { JwtUtils } from "../../../utils/JwtUtils";

export const refreshToken = async function (refreshToken: string) {
  try {
    const response = await axios.post("auth/refresh-token", {
      refreshToken,
    });
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
          const res = await axios.post("auth/login", {
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
      if (user) {
        if (account?.provider === "google") {
          const { id_token } = account;
          try {
            const response = await axios.post("auth/login-google", {
              idToken: id_token,
            });

            const data = response.data;
            token = {
              user: data.user,
              accessToken: data.tokens.access.token,
              refreshToken: data.tokens.refresh.token,
            };

            return token;
          } catch (err: any) {
            console.log(err);
            return null;
          }
        }

        if (account?.provider === "facebook") {
          const { access_token } = account;
          try {
            const response = await axios.post("auth/login-facebook", {
              accessToken: access_token,
            });

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

          return token;
        }

        return null;
      }

      const updatedUser = (
        await axios.post("auth/me", null, {
          headers: { Authorization: `Bearer ${token.accessToken}` },
        })
      ).data;

      if (!updatedUser) {
        return null;
      }

      return { ...token, user: updatedUser };
    },
    async session({ token, session }: { session: any; token: any }) {
      if (_.isNull(token)) {
        return null;
      }

      session.user = token.user;
      session.accessToken = token.accessToken;

      return session;
    },
  },
  pages: {
    error: urljoin(process.env.FRONTEND_URL as string, "login"),
  },
});
