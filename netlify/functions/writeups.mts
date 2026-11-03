import type { Config } from "@netlify/functions";
import { getUser } from "@netlify/identity";
import { and, desc, eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { writeups } from "../../db/schema.js";

const CATEGORIES = ["Web", "Crypto", "Pwn", "Rev", "Forensics", "OSINT"];
const DIFFICULTIES = ["Textbook", "Easy", "Medium", "Hard"];

const str = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

export default async (req: Request) => {
  const user = await getUser();
  if (!user) {
    return Response.json({ error: "Not signed in." }, { status: 401 });
  }

  if (req.method === "GET") {
    const rows = await db
      .select()
      .from(writeups)
      .where(eq(writeups.userId, user.id))
      .orderBy(desc(writeups.createdAt));
    return Response.json(rows, { headers: { "Cache-Control": "no-store" } });
  }

  if (req.method === "POST") {
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return Response.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    const ctfName = str(body.ctfName, 200);
    const challengeName = str(body.challengeName, 200);
    if (!ctfName || !challengeName) {
      return Response.json(
        { error: "CTF name and challenge name are required." },
        { status: 400 }
      );
    }
    const category = CATEGORIES.includes(body.category as string)
      ? (body.category as string)
      : CATEGORIES[0];
    const difficulty = DIFFICULTIES.includes(body.difficulty as string)
      ? (body.difficulty as string)
      : DIFFICULTIES[1];

    const [row] = await db
      .insert(writeups)
      .values({
        userId: user.id,
        ctfName,
        challengeName,
        category,
        difficulty,
        summary: str(body.summary, 1000),
        contentHTML: typeof body.contentHTML === "string" ? body.contentHTML : "",
        contentJSON: body.contentJSON ?? null,
      })
      .returning();
    return Response.json(row, { status: 201 });
  }

  if (req.method === "DELETE") {
    const id = Number(new URL(req.url).searchParams.get("id"));
    if (!Number.isInteger(id)) {
      return Response.json({ error: "Missing id." }, { status: 400 });
    }
    await db
      .delete(writeups)
      .where(and(eq(writeups.id, id), eq(writeups.userId, user.id)));
    return new Response(null, { status: 204 });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = {
  path: "/api/writeups",
};
