import { db } from "@/lib/db/db";
import { questions } from "@/lib/db/schema";
import { getSeedQuestionsForTopic, TOPIC_IDS } from "@/lib/questions";

const rows = TOPIC_IDS.flatMap((topicId) =>
  getSeedQuestionsForTopic(topicId).map((question, index) => ({
    id: question.id,
    topicId,
    position: index,
    prompt: question.prompt,
    options: question.options,
    correctOptionId: question.correctOptionId,
    explanation: question.explanation ?? null,
  }))
);

async function seed() {
  await db.delete(questions);
  await db.insert(questions).values(rows);

  console.log(`Seeded ${rows.length} questions`);

  for (const topicId of TOPIC_IDS) {
    console.log(`  ${topicId}: ${getSeedQuestionsForTopic(topicId).length}`);
  }
}

seed().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
