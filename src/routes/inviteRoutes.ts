import express from "express";
import { respondToInvite } from "../controllers/inviteController";

const router = express.Router();

// Example: PATCH /api/invite/123/456 { status: "accepted" }
router.patch("/:eventId/:userId", respondToInvite);

export default router;

