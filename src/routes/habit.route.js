// habit.route.js; // 수정사항

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

// /api/studies/:studyId/habits
router.get("/:studyId/habits", getStudyHabits);
router.post("/:studyId/habits", createHabit);

// /api/studies/:studyId/habits/:habitId
router.patch("/:studyId/habits/:habitId", updateHabit);
router.delete("/:studyId/habits/:habitId", deleteHabit);

// /api/studies/:studyId/habits/today
router.get("/:studyId/habits/today", getTodayHabits);

// /api/studies/:studyId/habits/:habitId/check-today
router.patch("/:studyId/habits/:habitId/check-today", updateTodayHabitCheck);

export default router;
