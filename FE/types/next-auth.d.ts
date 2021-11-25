import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      email: string;
      firstName: string;
      lastName: string;
      displayName: string;
      profilePic: string;
      isVerified: boolean;
      provider?: string;
    };
  }
}
