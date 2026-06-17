import express from "express";
import { protect, authorise } from "../middleware/auth.js";
import { getApplications, reviewApplication, getUsers, getDashboard, editUser, deleteUser } from "../controllers/adminController.js";

const router = express.Router();
const isAdmin = [protect, authorise("admin")];

router.get("/dashboard", ...isAdmin, getDashboard);
router.get("/applications", ...isAdmin, getApplications);
router.put("/applications/:id", ...isAdmin, reviewApplication);
router.get("/users", ...isAdmin, getUsers);
router.put("/users/:id", ...isAdmin, editUser);
router.delete("/users/:id", ...isAdmin, deleteUser);
router.get("/sessions", ...isAdmin, (req, res) => res.json({ message: "TODO: admin sessions" }));
router.get("/revenue", ...isAdmin, (req, res) => res.json({ message: "TODO: admin revenue" }));
router.get("/analytics", ...isAdmin, (req, res) => res.json({ message: "TODO: analytics" }));
router.get("/roadmaps", ...isAdmin, (req, res) => res.json({ message: "TODO: moderate roadmaps" }));
router.get("/reviews", ...isAdmin, (req, res) => res.json({ message: "TODO: moderate reviews" }));
router.get("/settings", ...isAdmin, (req, res) => res.json({ message: "TODO: get settings" }));
router.put("/settings", ...isAdmin, (req, res) => res.json({ message: "TODO: update settings" }));

export default router;
