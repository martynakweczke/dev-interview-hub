import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "@/lib/db/schema";

function connectionString(): string {
  const url = process.env.DATABASE_URL;

  if (url === undefined || url === "") {
    throw new Error(
      "DATABASE_URL is not set. Copy .env.example to .env.local and paste the Neon connection string."
    );
  }

  return url;
}

export const db = drizzle(neon(connectionString()), {
  schema,
  casing: "snake_case",
});
