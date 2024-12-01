import { formatNumber } from '@/lib/utils';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '../button';

type RentVsBuyTableProps = {
  data: {
    postalCode: string;
    buyPrice: number;
    rentPrice: number;
    ratio: number;
  }[];
};

export function RentVsBuyTable({ data }: RentVsBuyTableProps) {
  const pageSize = 5;
  const [pageIdx, setPageIdx] = useState(0);
  const pageCount = Math.ceil(data.length / pageSize);

  const sortedData = useMemo(() => data.sort((a, b) => (a.ratio ?? 0) - (b.ratio ?? 0)), [data]);

  return (
    <div>
      <table className="w-full text-sm">
        <thead>
          <tr className="[&_th]:px-1 [&_th]:py-2">
            <th className="text-left">PLZ</th>
            <th className="text-left">⌀ Kaufpreis</th>
            <th className="text-left">⌀ Mietpreis</th>
            <th className="text-left">Verhältnis</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.slice(pageIdx * pageSize, pageIdx * pageSize + pageSize).map((d) => (
            <tr key={d.postalCode} className="[&_td]:px-1 [&_td]:py-2">
              <td>{d.postalCode}</td>
              <td>{formatNumber(d.buyPrice, { unit: '€/m²', decimalPlaces: 0 })}</td>
              <td>{formatNumber(d.rentPrice, { unit: '€/m²', decimalPlaces: 1 })}</td>
              <td className="font-semibold">{d.ratio?.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {renderTablePagination()}
    </div>
  );

  function renderTablePagination() {
    return (
      <div className="mt-2 flex items-center justify-between gap-1">
        <Button
          variant="ghost"
          onClick={() => setPageIdx((prev) => Math.max(0, prev - 1))}
          disabled={pageIdx === 0}
          className="px-0"
        >
          <ChevronLeftIcon /> Vorherige
        </Button>
        <span className="text-sm text-muted-foreground">
          {pageIdx + 1} / {pageCount}
        </span>
        <Button
          variant="ghost"
          onClick={() => setPageIdx((prev) => Math.min(prev + 1, pageCount - 1))}
          disabled={pageIdx === pageCount - 1}
          className="px-0"
        >
          Nächste <ChevronRightIcon />
        </Button>
      </div>
    );
  }
}
