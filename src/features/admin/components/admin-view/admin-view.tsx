import { requireAdmin } from "@/features/auth/services/require-admin/require-admin";

export async function AdminView() {
  await requireAdmin();

  return (
    <div className="flex flex-col gap-2">
      <h1 className="font-display text-section font-semibold text-ink-heading-alt">
        Admin
      </h1>
      <p className="text-meta text-ink-muted">
        Question management lands here next.
      </p>
    </div>
  );
}
