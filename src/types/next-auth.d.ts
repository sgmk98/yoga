import { DefaultSession } from 'next-auth';

export {};

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      id: string;
      role: string;
      approved: boolean;
    };
  }

  interface User {
    role: string;
    approved: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: string;
    approved: boolean;
  }
}