import { Router } from "express";
import { ProductController } from "../controllers/ProductController";
import { asyncHandler } from "../../../shared/utils/asyncHandler";

const router = Router();

const controller = new ProductController();

router.get(
  "/",
  asyncHandler(controller.list)
);
router.get(
  "/:id",
  asyncHandler(controller.show)
);
export default router;