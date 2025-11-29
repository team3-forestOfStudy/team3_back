habit.route.js;

import express from "express";
import {
  getStudyHabits,
  createHabit,
  updateHabit,
  getTodayHabits,
  updateTodayHabitCheck,
  deleteHabit,
} from "../controllers/habit.controller.js";

const router = express.Router();

router.get("/studies/:studyId/habits", getStudyHabits);
router.post("/studies/:studyId/habits", createHabit);
router.patch("/habits/:habitId", updateHabit);
router.delete("/habits/:habitId", deleteHabit);
router.get("/studies/:studyId/habits/today", getTodayHabits);
router.patch("/habits/:habitId/today-check", updateTodayHabitCheck);

export default router;
