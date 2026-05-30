import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import productRoutes from "./modules/products/routes/productRoutes";
import { errorHandler } from "./shared/middlewares/errorHandler";

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use(express.json());

app.get("/health", (_, res) => {
  res.json({
    status: "ok"
  });
});

app.use("/products", productRoutes);

app.use(errorHandler);

export default app;