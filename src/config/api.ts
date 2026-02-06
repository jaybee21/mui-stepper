// Central place for API configuration.
//
// This project uses custom webpack (not CRA/Vite), so environment variables may
// require explicit DefinePlugin wiring. For now, we support an optional runtime
// override via window.__API_BASE_URL__ and fall back to the current default.
declare global {
  interface Window {
    __API_BASE_URL__?: string;
  }
}

const DEFAULT_API_BASE_URL = 'https://apply.wua.ac.zw/dev/api/v1';

export const API_BASE_URL =
  (typeof window !== 'undefined' && window.__API_BASE_URL__) ||
  (typeof process !== 'undefined' && (process as any).env?.API_BASE_URL) ||
  DEFAULT_API_BASE_URL;

