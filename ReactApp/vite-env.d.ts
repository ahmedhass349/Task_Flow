// CSS module declarations
declare module '*.css';
declare module '*.scss';
declare module '*.sass';

// Environment variable types for webpack build
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly MODE: string;
  // Add other env variables here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
