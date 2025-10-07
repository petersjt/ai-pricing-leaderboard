'use client';

import type { LeaderboardModel } from '@ai-pricing-leaderboard/types';
import { formatUsd } from '@ai-pricing-leaderboard/utils';
import { useMemo, useState } from 'react';

export type LeaderboardTableProps = {
  models: LeaderboardModel[];
};

type SortKey = 'provider' | 'model' | 'inputPrice' | 'outputPrice';

type SortState = {
  key: SortKey;
  direction: 'asc' | 'desc';
};

const headers: { label: string; key: SortKey; align?: 'right' }[] = [
  { label: 'Provider', key: 'provider' },
  { label: 'Model', key: 'model' },
  { label: 'Input / 1M tokens', key: 'inputPrice', align: 'right' },
  { label: 'Output / 1M tokens', key: 'outputPrice', align: 'right' }
];

export function LeaderboardTable({ models }: LeaderboardTableProps) {
  const [sortState, setSortState] = useState<SortState>({ key: 'inputPrice', direction: 'asc' });

  const sortedModels = useMemo(() => {
    return [...models].sort((a, b) => {
      const { key, direction } = sortState;
      const multiplier = direction === 'asc' ? 1 : -1;

      if (key === 'provider' || key === 'model') {
        return a[key].localeCompare(b[key]) * multiplier;
      }

      return (a[key] - b[key]) * multiplier;
    });
  }, [models, sortState]);

  const handleSort = (key: SortKey) => {
    setSortState((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }

      return { key, direction: key === 'provider' || key === 'model' ? 'asc' : 'desc' };
    });
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/70 shadow-xl shadow-primary-950/40">
      <table className="min-w-full divide-y divide-slate-800 text-sm">
        <thead className="bg-slate-900/60 text-left text-xs uppercase tracking-wide text-slate-400">
          <tr>
            {headers.map(({ label, key, align }) => (
              <th
                key={key}
                scope="col"
                className={`px-4 py-3 font-semibold ${align === 'right' ? 'text-right' : 'text-left'}`}
              >
                <button
                  type="button"
                  onClick={() => handleSort(key)}
                  className="inline-flex items-center gap-1 text-slate-300 transition hover:text-white"
                >
                  {label}
                  {sortState.key === key && (
                    <span aria-hidden className="text-xs text-primary-300">
                      {sortState.direction === 'asc' ? '▲' : '▼'}
                    </span>
                  )}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/80">
          {sortedModels.map((model) => (
            <tr key={model.id} className="bg-slate-950/20 hover:bg-slate-900/80">
              <td className="px-4 py-4 font-medium text-white">{model.provider}</td>
              <td className="px-4 py-4 text-slate-200">{model.model}</td>
              <td className="px-4 py-4 text-right font-mono text-slate-100">
                {formatUsd(model.inputPrice)}
              </td>
              <td className="px-4 py-4 text-right font-mono text-slate-100">
                {formatUsd(model.outputPrice)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
