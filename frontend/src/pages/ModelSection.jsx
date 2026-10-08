import { Check, Cpu, Layers3 } from 'lucide-react'

export function ModelSection() {
  return (
    <section id="model" className="section-space bg-white">
      <div className="page-shell grid gap-10 lg:grid-cols-[.85fr_1.15fr] lg:items-start">
        <div>
          <span className="eyebrow">Deployment model</span>
          <h2 className="section-title mt-3">The trained architecture, preserved.</h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">The API loads the existing <code>effnetb2_best.keras</code> checkpoint once at startup. It does not recreate or retrain the network.</p>
          <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden border border-slate-200 bg-slate-200">
            {[['Input', '240 × 240 × 3'], ['Output', '3 classes'], ['Color input', 'OpenCV BGR'], ['Grad-CAM layer', 'top_activation']].map(([label, value]) => (
              <div key={label} className="bg-slate-50 p-4"><p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p><p className="mt-1 text-sm font-semibold text-slate-900">{value}</p></div>
            ))}
          </div>
        </div>
        <div className="border border-slate-200 bg-slate-50 p-6 sm:p-8">
          <div className="flex items-center gap-3 border-b border-slate-200 pb-5"><Layers3 className="text-teal" /><h3 className="font-display text-xl font-semibold">EfficientNetB2 classifier head</h3></div>
          <div className="mt-6 space-y-3">
            {['EfficientNetB2 · ImageNet backbone · include_top=False', 'Global Average Pooling 2D', 'Dropout · rate 0.5', 'Dense · 3 outputs · softmax'].map((item, index) => (
              <div key={item} className="flex items-center gap-4 border border-slate-200 bg-white p-4"><span className="grid h-8 w-8 shrink-0 place-items-center bg-navy font-mono text-xs font-bold text-mint">{index + 1}</span><span className="text-sm font-semibold text-slate-800">{item}</span></div>
            ))}
          </div>
          <div className="mt-6 flex items-start gap-3 bg-mint/15 p-4 text-sm leading-6 text-slate-700"><Check className="mt-0.5 shrink-0 text-teal" size={18} /><span>Class order: <strong>Glioma → Meningioma → Pituitary</strong></span></div>
        </div>
      </div>
    </section>
  )
}

