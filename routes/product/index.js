import express from "express";
import authValidation from "../../validations/product.validation.js";
import validate from "../../middlewares/validate.js";
import controllers from "./controllers.js";
import upload from "../../middlewares/upload.js";

const router = express.Router();
router.get("/", controllers.getAll);
router.get("/:id?", validate(authValidation.id), controllers.getById);
router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "brand_logo", maxCount: 1 },
  ]),
  controllers.post
);
router.patch("/:id?", validate(authValidation.update), controllers.update);
router.delete("/:id?", validate(authValidation.id), controllers.delete);

export default router;
