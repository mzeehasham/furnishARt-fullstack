import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

/** Example on how to extend the built-in session types */
declare module "next-auth" {
  interface User {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    is_verified: boolean;
    is_admin: boolean;
    email: string;
  }

  interface Session {
    user: {
      id: number;
      username: string;
      first_name: string;
      last_name: string;
      is_verified: boolean;
      is_admin: boolean;
      email: string;
    };
  }
}

/** Example on how to extend the built-in types for JWT */
declare module "next-auth/jwt" {
  interface JWT {
    user: {
      id: number;
      username: string;
      first_name: string;
      last_name: string;
      is_verified: boolean;
      is_admin: boolean;
      email: string;
    };
  }
}
