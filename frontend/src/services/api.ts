import axios from "axios";

/**
 * Cliente HTTP compartilhado pelo frontend.
 *
 * No Docker, a URL precisa ser acessível pelo browser do usuário. Por isso o
 * compose usa http://localhost:3000 em vez do nome interno do serviço. O
 * fallback atende desenvolvimento e E2E executados fora do compose.
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
});
