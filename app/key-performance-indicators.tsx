export function KeyPerformanceIndicators() {
  return (
    <>
      <DataPair left="Anzahl der Inserate" right="1.234" />
      <DataPair left="Median Größe" right="123 m²" />
      <DataPair left="Durchschn. Größe" right="123 m²" />
      <DataPair left="Median Preis" right="123.456 €" />
      <DataPair left="Durchschn. Preis" right="123.456 €" />
      <DataPair left="Median €/m²" right="1.234 €/m²" />
      <DataPair left="Durchschn. €/m²" right="1.234 €/m²" />
    </>
  );
}

function DataPair({ left, right }: { left: string; right: string }) {
  return (
    <div className="flex justify-between w-full max-w-96">
      <div>{left}</div>
      <div>{right}</div>
    </div>
  );
}
