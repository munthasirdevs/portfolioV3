import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="text-lg font-bold text-foreground">
              {"<MR />"}
            </Link>
            <p className="text-sm text-muted-foreground">
              Software engineer who builds and scales real products.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Navigate</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/projects"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/case-studies"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Case Studies
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Live Tools</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/tools/url-shortener"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  URL Shortener
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/code-playground"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Code Playground
                </Link>
              </li>
              <li>
                <Link
                  href="/api-docs"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  API Docs
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Connect</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href="https://github.com/munthasir"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com/in/munthasir"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} Munthasir Rahman. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-success" />
            <span className="text-xs text-muted-foreground">
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
