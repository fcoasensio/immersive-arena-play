import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export interface RelatedLink {
  title: string;
  description: string;
  to: string;
}

export default function RelatedLinks({ links }: { links: RelatedLink[] }) {
  if (links.length === 0) return null;

  return (
    <section aria-labelledby="related-content-heading" className="border-t border-border py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <h2 id="related-content-heading" className="mb-6 font-display text-xl font-bold text-foreground md:text-2xl">
            También puede interesarte
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="group border-l-2 border-primary/40 py-2 pl-4 transition-colors hover:border-primary"
              >
                <span className="flex items-center gap-2 font-display text-sm font-bold text-foreground group-hover:text-primary">
                  {link.title}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="mt-1 block font-body text-sm text-muted-foreground">{link.description}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
