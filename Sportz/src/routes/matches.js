import { Router } from "express";
import {
  createMatchSchema,
  listMatchesQuerySchema,
} from "../validation/matches.js";
import { matches } from "../db/schema.js";
import { db } from "../db/db.js";
import { getMatchStatus } from "../utils/match-status.js";
import { desc } from "drizzle-orm";

export const matchesRouter = Router();
const MAX_LIMIT = 100;

matchesRouter.get("/", async (req, res) => {
  const parsed = listMatchesQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({
      errors: "Invalid query parameters",
      details: parsed.error.issues,
    });
  }
  const limit = Math.min(parsed.data.limit ?? 50, MAX_LIMIT);
  try {
    const data = await db
      .select()
      .from(matches)
      .orderBy(desc(matches.createdAt))
      .limit(limit);
    res.json({ data });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", message: error.message });
  }
});

matchesRouter.post("/", async (req, res) => {
  const parsed = createMatchSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      errors: "Invalid request body",
      details: parsed.error.issues,
    });
  }
  const { startTime, endTime, homeScore, awayScore } = parsed.data;

  try {
    const status = getMatchStatus(startTime, endTime);

    // console.log("📊 Status calculated:", status);
    const [event] = await db
      .insert(matches)
      .values({
        ...parsed.data,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        homeScore: homeScore ?? 0,
        awayScore: awayScore ?? 0,
        status: getMatchStatus(startTime, endTime),
      })
      .returning();

    const broadcastMatchCreated = req.app.locals.broadcastMatchCreated;
    if (broadcastMatchCreated) {
      broadcastMatchCreated(event);
      console.log("📡 Broadcasted match created:", event.id);
    } else {
      console.log("⚠️ broadcastMatchCreated not available");
    }

    res.status(201).json({ data: event });
  } catch (error) {
    console.error("❌ Error creating match:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});
