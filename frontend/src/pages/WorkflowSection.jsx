import { BrainCircuit, ChartNoAxesColumnIncreasing, FileImage, Focus, ScanLine } from 'lucide-react'

const steps = [
  [FileImage, 'MRI upload', 'A PNG or JPEG image is validated and decoded with OpenCV.'],
  [ScanLine, 'Image preparation', 'The BGR image is resized to 240 × 240 and converted to float32.'],
  [BrainCircuit, 'EfficientNetB2', 'The saved checkpoint returns three softmax probabilities.'],
  [ChartNoAxesColumnIncreasing, 'Prediction', 'The highest probability selects the reported class and confidence.'],
  [Focus, 'Grad-CAM', 'The predicted class is traced through the top_activation feature maps.'],
]

export function WorkflowSection() {
  return (
    <section id="workflow" className="section-space bg-navy text-white">
      <div className="page-shell">
        <span className="eyebrow text-mint">Transparent pipeline</span>
        <div className="mt-3 grid gap-6 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
          <h2 className="section-title text-white">From uploaded scan to visual explanation.</h2>
          <p className="max-w-2xl text-base leading-7 text-slate-300 lg:justify-self-end">The deployment path mirrors the B2 notebook. No retraining, augmentation, contour cropping, or dataset comparison occurs when a user uploads an image.</p>
        </div>
        <div className="mt-12 grid border-l border-t border-white/15 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map(([Icon, title, text], index) => (
            <article key={title} className="border-b border-r border-white/15 p-6">
              <div className="flex items-center justify-between"><Icon className="text-mint" size={23} /><span className="font-mono text-xs text-slate-500">0{index + 1}</span></div>
              <h3 className="mt-8 text-base font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

