// Environment variable types for webpack build
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  // Add other env variables here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
