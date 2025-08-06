// Type declarations for better compatibility
declare module 'express-async-wrap' {
  import { RequestHandler } from 'express';
  function asyncWrap(handler: any): RequestHandler;
  export default asyncWrap;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined;
    }
  }
}

export {};
