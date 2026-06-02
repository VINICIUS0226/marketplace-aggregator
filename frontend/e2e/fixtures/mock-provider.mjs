import { createServer } from "node:http";

const PORT = 3101;
let available = true;

const products = [
  {
    id: 901,
    title: "Resilient Notebook",
    description: "Product served by the controlled E2E provider",
    category: "notebooks",
    price: 4200,
    rating: 4.8,
    stock: 7,
    thumbnail: "https://example.com/notebook.png",
    images: ["https://example.com/notebook.png"],
  },
];

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json",
  });
  response.end(JSON.stringify(payload));
}

createServer((request, response) => {
  if (request.method === "POST" && request.url === "/reset") {
    available = true;
    return sendJson(response, 200, { available });
  }

  if (request.method === "POST" && request.url === "/fail") {
    available = false;
    return sendJson(response, 200, { available });
  }

  if (request.method === "GET" && request.url === "/products") {
    if (!available) {
      return sendJson(response, 503, {
        message: "Controlled provider unavailable",
      });
    }

    return sendJson(response, 200, { products });
  }

  return sendJson(response, 404, { message: "Not found" });
}).listen(PORT, "127.0.0.1", () => {
  console.log(`Controlled E2E provider listening on ${PORT}`);
});
