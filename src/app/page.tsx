import { HomeView } from "@/components/home/home-view"
import { PageShell } from "@/components/shell/page-shell"

export default function HomePage() {
  return (
    <PageShell ambient="home">
      <main id="main" className="page-enter flex flex-1 flex-col">
        <HomeView />
      </main>
    </PageShell>
  )
}
