import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "@/lib/db/schema";

type Db = ReturnType<typeof createDb>;

function connectionString(): string {
  const url = process.env.DATABASE_URL;

  if (url === undefined || url === "") {
    throw new Error(
      "DATABASE_URL is not set. Copy .env.example to .env.local and paste the Neon connection string."
    );
  }

  return url;
}

function createDb() {
  return drizzle(neon(connectionString()), {
    schema,
    casing: "snake_case",
  });
}

let instance: Db | undefined;

export const db = new Proxy({} as Db, {
  get(_target, property) {
    instance ??= createDb();
    return Reflect.get(instance, property, instance) as unknown;
  },
});
