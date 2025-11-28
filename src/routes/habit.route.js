habit.route.js;

import express from "express";
import {
  getStudyHabits,
  createHabit,
  updateHabit,
} from "../controllers/habit.controller.js";

const router = express.Router();

router.get("/:studyId/habits", getStudyHabits);
router.post("/:studyId/habits", createHabit);
router.patch("/:habitId", updateHabit);

export default router;
