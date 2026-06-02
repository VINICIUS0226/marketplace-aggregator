import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const currentDirectory = dirname(fileURLToPath(import.meta.url));
const backendDirectory = resolve(currentDirectory, "../../../backend");
const isWindows = process.platform === "win32";
const command = isWindows ? process.env.ComSpec || "cmd.exe" : "npm";
const args = isWindows
  ? ["/d", "/s", "/c", "npm run dev"]
  : ["run", "dev"];

const backend = spawn(command, args, {
  cwd: backendDirectory,
  env: {
    ...process.env,
    PORT: "3001",
    PRODUCTS_API_URL: "http://127.0.0.1:3101/products",
  },
  stdio: "inherit",
});

function stopBackend() {
  backend.kill();
}

process.on("SIGINT", stopBackend);
process.on("SIGTERM", stopBackend);
backend.on("exit", (code) => process.exit(code ?? 0));
