import {
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  uniqueIndex,
} from "drizzle-orm/pg-core";

import { OPTION_IDS, TOPIC_IDS, type Option } from "@/lib/questions/types";


export const topicIdEnum = pgEnum("topic_id", TOPIC_IDS);
export const optionIdEnum = pgEnum("option_id", OPTION_IDS);

export const questions = pgTable(
  "questions",
  {
    id: text().primaryKey(),
    topicId: topicIdEnum().notNull(),
    position: integer().notNull(),
    prompt: text().notNull(),
    options: jsonb().$type<readonly Option[]>().notNull(),
    correctOptionId: optionIdEnum().notNull(),
    explanation: text(),
  },
  (table) => [
    uniqueIndex("questions_topic_position_idx").on(
      table.topicId,
      table.position
    ),
  ]
);
