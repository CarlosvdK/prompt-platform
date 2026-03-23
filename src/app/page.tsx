import Link from "next/link";
import { listCategories } from "@/services/category.service";

const howItWorks = [
  {
    step: "1",
    title: "Browse",
    description: "Explore our curated collection of high-quality AI prompts across categories.",
  },
  {
    step: "2",
    title: "Preview",
    description: "See example outputs and previews before unlocking the full prompt.",
  },
  {
    step: "3",
    title: "Unlock",
    description: "Unlock the complete prompt to use in your own AI workflows.",
  },
];

export default async function HomePage() {
  const categories = await listCategories();

  return (
    <div className="flex flex-col flex-1">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-6 py-24 text-center bg-gradient-to-b from-secondary to-background">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Discover AI Prompts That Work
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Browse, preview, and unlock expertly crafted prompts for ChatGPT,
          Claude, Midjourney, and more. Save hours of prompt engineering.
        </p>
        <Link
          href="/browse"
          className="mt-8 inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Browse Prompts
        </Link>
      </section>

      {/* Featured Categories */}
      <section className="mx-auto w-full max-w-6xl px-6 py-16">
        <h2 className="text-2xl font-semibold text-center mb-10">
          Browse by Category
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.slice(0, 6).map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group flex flex-col items-center rounded-xl border border-border bg-card p-6 text-center transition-colors hover:bg-accent"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-xl">
                {category.icon ?? "📝"}
              </div>
              <h3 className="font-medium text-card-foreground group-hover:text-accent-foreground">
                {category.name}
              </h3>
              {category.description && (
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                  {category.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-secondary/50 px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-semibold text-center mb-10">
            How It Works
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {howItWorks.map((item) => (
              <div key={item.step} className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  {item.step}
                </div>
                <h3 className="text-lg font-medium">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
