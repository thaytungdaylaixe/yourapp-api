import { Router } from "express";
const router = Router();

import registerController from "../controllers/registerController.js";

router.route("/").post(registerController.Register);

export default router;
