import express from "express";
import { protect, authorise } from "../middleware/auth.js";
import { getAllRoadmaps, getRoadmapById, createRoadmap, updateRoadmap, deleteRoadmap } from "../controllers/roadmapsController.js";

const router = express.Router();

router.get("/", getAllRoadmaps);
router.get("/:id", getRoadmapById);
router.post("/", protect, authorise("mentor"), createRoadmap);
router.put("/:id", protect, authorise("mentor"), updateRoadmap);
router.delete("/:id", protect, authorise("mentor"), deleteRoadmap);

export default router;
