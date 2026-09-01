import { Router } from "express";
import { desc, eq } from "drizzle-orm";
import { db } from "../db/db.js";
import { commentary } from "../db/schema.js";
import { matchIdParamSchema } from "../validation/matches.js";
import {
  createCommentarySchema,
  listCommentaryQuerySchema,
} from "../validation/commentary.js";

export const commentaryRouter = Router({ mergeParams: true }); // mergeParams allows access to parent route params
const MAX_LIMIT = 100;

commentaryRouter.get("/", async (req, res) => {
  const paramsResult = matchIdParamSchema.safeParse(req.params);
  if (!paramsResult.success) {
    return res.status(400).json({
      errors: "Invalid route parameters",
      details: paramsResult.error.issues,
    });
  }

  const queryResult = listCommentaryQuerySchema.safeParse(req.query);
  if (!queryResult.success) {
    return res.status(400).json({
      errors: "Invalid query parameters",
      details: queryResult.error.issues,
    });
  }

  const limit = Math.min(queryResult.data.limit ?? 100, MAX_LIMIT);

  try {
    const data = await db
      .select()
      .from(commentary)
      .where(eq(commentary.matchId, paramsResult.data.id))
      .orderBy(desc(commentary.createdAt))
      .limit(limit);

    res.status(200).json({ data });
  } catch (error) {
    console.error("❌ Error fetching commentary:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});

commentaryRouter.post("/", async (req, res) => {
  const paramsResult = matchIdParamSchema.safeParse(req.params);
  if (!paramsResult.success) {
    return res.status(400).json({
      errors: "Invalid route parameters",
      details: paramsResult.error.issues,
    });
  }

  const bodyResult = createCommentarySchema.safeParse(req.body);
  if (!bodyResult.success) {
    return res.status(400).json({
      errors: "Invalid request body",
      details: bodyResult.error.issues,
    });
  }

  try {
    const [newCommentary] = await db
      .insert(commentary)
      .values({
        matchId: paramsResult.data.id,
        ...bodyResult.data,
      })
      .returning();

      if(res.app.locals.broadcastCommentary) {
        res.app.locals.broadcastCommentary(newCommentary.matchId, newCommentary);
      }

    res.status(201).json({ data: newCommentary });
  } catch (error) {
    console.error("❌ Error creating commentary:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});
