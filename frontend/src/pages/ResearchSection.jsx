const rows = [
  ['B0', '99.94', '99.90', '97.39', '96.77', '97.35', '98.76', '97.04'],
  ['B1', '100.00', '99.72', '98.70', '98.43', '98.59', '99.36', '98.51'],
  ['B2', '100.00', '99.91', '98.86', '98.65', '98.77', '99.34', '98.71'],
  ['B3', '99.97', '99.98', '98.21', '97.82', '97.99', '99.17', '97.98'],
  ['B4', '99.76', '99.52', '98.05', '97.81', '97.81', '99.04', '97.81'],
]

const headers = ['Model', 'Train acc.', 'Val. acc.', 'Test acc.', 'Precision', 'Sensitivity', 'Specificity', 'F1-score']

export function ResearchSection() {
  return (
    <section id="research" className="section-space bg-slate-50">
      <div className="page-shell">
        <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
          <div><span className="eyebrow">Published paper results</span><h2 className="section-title mt-3">EfficientNet comparison.</h2></div>
          <p className="max-w-2xl text-base leading-7 text-slate-600 lg:justify-self-end">Reported in “Multi-class classification of brain tumor types from MR images using EfficientNets” by Fatima Zulfiqar, Usama Ijaz Bajwa, and Yasar Mehmood. These are paper results—not measurements produced by this website.</p>
        </div>
        <div className="mt-10 overflow-x-auto border border-slate-200 bg-white">
          <table className="w-full min-w-[850px] border-collapse text-left text-sm">
            <caption className="sr-only">Published EfficientNet B0 through B4 performance results in percent</caption>
            <thead className="bg-navy text-white"><tr>{headers.map((header) => <th key={header} className="px-4 py-4 font-semibold">{header}</th>)}</tr></thead>
            <tbody>{rows.map((row) => <tr key={row[0]} className={row[0] === 'B2' ? 'bg-mint/15' : 'border-t border-slate-200'}>{row.map((cell, index) => <td key={index} className={`px-4 py-4 ${index === 0 ? 'font-bold text-slate-950' : 'font-mono text-slate-700'}`}>{index === 0 ? `EfficientNet${cell}` : `${cell}%`}{row[0] === 'B2' && index === 0 && <span className="ml-2 text-xs font-sans font-bold uppercase tracking-wider text-teal">Deployed</span>}</td>)}</tr>)}</tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

