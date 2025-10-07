import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Pricing Leaderboard',
  description: 'Compare AI model pricing across providers at a glance.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100">
        <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-10">
          <header className="flex flex-col gap-2 pb-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary-300">
              AI Pricing Leaderboard
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Track model pricing across providers
            </h1>
            <p className="max-w-2xl text-sm text-slate-300">
              Stay informed about the latest input and output token pricing across major AI providers. This
              lightweight MVP pulls seeded data and sets the stage for automated scrapers and richer analytics.
            </p>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="pt-10 text-xs text-slate-500">
            Data shown is mocked for development purposes. Connect your database and scrapers to go live.
          </footer>
        </div>
      </body>
    </html>
  );
}
