import { Activity, Brain, Focus, ScanSearch } from 'lucide-react'

function ProbabilityRow({ label, value, selected }) {
  const percent = Math.max(0, Math.min(100, Number(value) * 100))
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4 text-sm">
        <span className={`font-semibold ${selected ? 'text-slate-950' : 'text-slate-600'}`}>{label}</span>
        <span className="font-mono font-semibold text-slate-800">{percent.toFixed(2)}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-label={`${label} probability`} aria-valuenow={percent} aria-valuemin="0" aria-valuemax="100">
        <div className={`h-full rounded-full ${selected ? 'bg-teal' : 'bg-slate-300'}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}

export function AnalysisResults({ result }) {
  if (!result) return null
  const confidence = Number(result.confidence) * 100
  const images = [
    ['Original MRI', result.gradcam.original_image, Brain],
    ['Attention heatmap', result.gradcam.heatmap, Focus],
    ['Grad-CAM overlay', result.gradcam.overlay, ScanSearch],
  ]

  return (
    <section className="mt-8 space-y-6" aria-labelledby="results-title">
      <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
        <article className="result-card bg-navy text-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-mint">Model prediction</span>
            <Activity className="text-mint" size={21} />
          </div>
          <h3 id="results-title" className="mt-8 font-display text-4xl font-semibold">{result.prediction}</h3>
          <p className="mt-2 text-slate-300">Predicted class · index {result.class_index}</p>
          <div className="mt-8 border-t border-white/15 pt-6">
            <p className="text-sm text-slate-300">Confidence</p>
            <p className="mt-1 font-mono text-4xl font-semibold text-white">{confidence.toFixed(2)}%</p>
          </div>
        </article>

        <article className="result-card">
          <div className="flex items-end justify-between gap-4">
            <div><span className="eyebrow">Softmax output</span><h3 className="mt-2 font-display text-2xl font-semibold text-slate-950">Class probabilities</h3></div>
            <span className="text-xs text-slate-500">Sum: 100%</span>
          </div>
          <div className="mt-8 space-y-6">
            {Object.entries(result.probabilities).map(([label, value]) => <ProbabilityRow key={label} label={label} value={value} selected={label === result.prediction} />)}
          </div>
        </article>
      </div>

      <article className="result-card">
        <div className="max-w-3xl">
          <span className="eyebrow">Model attention</span>
          <h3 className="mt-2 font-display text-2xl font-semibold text-slate-950">Grad-CAM visualization</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">Grad-CAM highlights image regions that contributed to the model’s prediction. These highlighted regions are not a clinically verified tumor segmentation.</p>
        </div>
        <div className="mt-7 grid gap-5 md:grid-cols-3">
          {images.map(([label, src, Icon]) => (
            <figure key={label} className="overflow-hidden border border-slate-200 bg-[#071521]">
              <div className="aspect-square"><img className="h-full w-full object-contain" src={src} alt={label} /></div>
              <figcaption className="flex items-center gap-2 bg-white px-4 py-3 text-sm font-semibold text-slate-800"><Icon className="text-teal" size={17} />{label}</figcaption>
            </figure>
          ))}
        </div>
      </article>
    </section>
  )
}

