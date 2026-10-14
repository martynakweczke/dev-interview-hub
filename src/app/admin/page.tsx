import { Suspense } from "react";
import type { Metadata } from "next";

import { AdminView } from "@/features/admin/components/admin-view/admin-view";
import { PageShell } from "@/features/shell/components/page-shell/page-shell";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false },
};

export default function AdminPage() {
  return (
    <PageShell ambient="home">
      <main
        id="main"
        className="page-enter flex flex-1 flex-col px-gutter-compact py-8 sm:px-gutter sm:py-12"
      >
        <Suspense fallback={null}>
          <AdminView />
        </Suspense>
      </main>
    </PageShell>
  );
}
