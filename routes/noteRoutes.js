import { Router } from "express";

const router = Router();

import notesController from "../controllers/notesController.js";

router
  .route("/")
  .get(notesController.getAllNotes)
  .post(notesController.createNewNote)
  .patch(notesController.updateNote)
  .delete(notesController.deleteNote);

export default router;
