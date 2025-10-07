import { getLeaderboardModels } from '@ai-pricing-leaderboard/db';
import { formatUsd } from '@ai-pricing-leaderboard/utils';
import { LeaderboardTable } from '@/components/LeaderboardTable';

export default async function HomePage() {
  const models = await getLeaderboardModels();
  const providerCount = new Set(models.map((m) => m.provider)).size;
  const lowestInput = models.length > 0 ? Math.min(...models.map((m) => m.inputPrice)) : null;

  return (
    <section className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Providers" value={providerCount.toString()} />
        <StatCard label="Models" value={models.length.toString()} />
        <StatCard label="Lowest input" value={lowestInput !== null ? formatUsd(lowestInput) : '—'} />
      </div>
      <LeaderboardTable models={models} />
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}
