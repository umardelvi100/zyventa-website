import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      sellerId: string | null;
      sellerVerificationStatus: string | null;
      isAdmin: boolean;
    } & DefaultSession["user"];
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    sellerId: string | null;
    sellerVerificationStatus: string | null;
    isAdmin: boolean;
  }
}
