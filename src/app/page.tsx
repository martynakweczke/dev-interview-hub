import { HomeView } from "@/features/home/components/home-view/home-view";
import { PageShell } from "@/features/shell/components/page-shell/page-shell";

export default function HomePage() {
  return (
    <PageShell ambient="home">
      <main id="main" className="page-enter flex flex-1 flex-col">
        <HomeView />
      </main>
    </PageShell>
  );
}
