
import { Session } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    access?: {
      token?: string;
    };
  }
}
