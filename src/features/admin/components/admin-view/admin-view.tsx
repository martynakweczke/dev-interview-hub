import { Card } from "@/components/ui/card";
import { QuestionForm } from "@/features/admin/components/question-form/question-form";
import { QuestionList } from "@/features/admin/components/question-list/question-list";
import { requireAdmin } from "@/features/auth/services/require-admin/require-admin";
import { getAllQuestions } from "@/lib/db/questions";

export async function AdminView() {
  await requireAdmin();

  const questions = await getAllQuestions();

  return (
    <div className="flex max-w-2xl flex-col gap-10">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-section font-semibold text-ink-heading-alt">
          Admin
        </h1>
        <p className="text-meta text-ink-muted">
          Questions are saved straight to the database.
        </p>
      </div>

      <section aria-labelledby="add-question" className="flex flex-col gap-4">
        <h2
          id="add-question"
          className="font-display text-section font-semibold text-ink-secondary"
        >
          Add a question
        </h2>
        <Card>
          <QuestionForm />
        </Card>
      </section>

      <section aria-labelledby="all-questions" className="flex flex-col gap-4">
        <h2
          id="all-questions"
          className="font-display text-section font-semibold text-ink-secondary"
        >
          All questions
        </h2>
        <QuestionList questions={questions} />
      </section>
    </div>
  );
}
