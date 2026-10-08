import { AlertCircle, BrainCircuit, ChevronDown, Microscope, ScanLine, ShieldCheck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { AnalysisResults } from './components/AnalysisResults'
import { Disclaimer } from './components/Disclaimer'
import { Header } from './components/Header'
import { UploadPanel } from './components/UploadPanel'
import { ModelSection } from './pages/ModelSection'
import { ResearchSection } from './pages/ResearchSection'
import { WorkflowSection } from './pages/WorkflowSection'
import { analyzeMri } from './services/api'

const stages = ['Uploading…', 'Processing…', 'Running EfficientNetB2…', 'Generating Grad-CAM…']

export default function App() {
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [stageIndex, setStageIndex] = useState(0)

  useEffect(() => () => previewUrl && URL.revokeObjectURL(previewUrl), [previewUrl])

  function selectFile(nextFile) {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setFile(nextFile)
    setPreviewUrl(URL.createObjectURL(nextFile))
    setResult(null)
    setError('')
  }

  function removeFile() {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setFile(null)
    setPreviewUrl('')
    setResult(null)
    setError('')
  }

  async function runAnalysis() {
    if (!file || busy) return
    setBusy(true)
    setError('')
    setResult(null)
    setStageIndex(0)
    const timer = window.setInterval(() => setStageIndex((value) => Math.min(value + 1, stages.length - 1)), 900)
    try {
      const data = await analyzeMri(file)
      setResult(data)
      window.setTimeout(() => document.getElementById('results-title')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50)
    } catch (requestError) {
      const message = requestError.response?.data?.error || 'Unable to analyze this image. Confirm that the Flask API and trained model are available, then try again.'
      setError(message)
    } finally {
      window.clearInterval(timer)
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Header />
      <main>
        <section id="home" className="hero-grid overflow-hidden bg-navy text-white">
          <div className="page-shell grid min-h-[560px] items-center gap-10 py-16 lg:grid-cols-[1.08fr_.92fr] lg:py-20">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.17em] text-mint"><Microscope size={17} /> Academic MRI research interface</div>
              <h1 className="mt-6 max-w-3xl font-display text-5xl font-semibold leading-[1.04] tracking-tight sm:text-6xl">Brain tumor classification, with model attention made visible.</h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">AI-assisted classification of brain MRI images into Glioma, Meningioma, and Pituitary tumor classes using the trained EfficientNetB2 model.</p>
              <div className="mt-8 flex flex-wrap gap-3"><a className="button-light" href="#analysis"><ScanLine size={19} /> Analyze MRI</a><a className="button-dark" href="#workflow">How it works <ChevronDown size={18} /></a></div>
              <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/15 pt-6 text-sm text-slate-300"><span className="flex items-center gap-2"><ShieldCheck className="text-mint" size={18} /> No diagnosis claims</span><span className="flex items-center gap-2"><BrainCircuit className="text-mint" size={18} /> Notebook-matched inference</span></div>
            </div>
            <div className="relative border border-white/15 bg-white/[0.06] p-5 shadow-2xl shadow-black/20 sm:p-7">
              <div className="flex items-center justify-between border-b border-white/15 pb-4"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-mint">Analysis pipeline</p><p className="mt-1 text-sm text-slate-300">EfficientNetB2 · 240 × 240 × 3</p></div><span className="h-2.5 w-2.5 rounded-full bg-mint shadow-[0_0_0_6px_rgba(85,214,190,.12)]" /></div>
              <div className="py-6">
                <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-5">
                  {[['01', 'OpenCV decode', 'BGR input retained'], ['02', 'EfficientNetB2', 'Three-class softmax'], ['03', 'Grad-CAM', 'top_activation layer']].map(([num, title, detail]) => <div className="contents" key={num}><span className="grid h-10 w-10 place-items-center border border-mint/40 font-mono text-xs font-bold text-mint">{num}</span><div><p className="font-semibold text-white">{title}</p><p className="mt-1 text-sm text-slate-400">{detail}</p></div></div>)}
                </div>
              </div>
              <div className="border-t border-white/15 pt-4 text-xs leading-5 text-slate-400">The highlighted regions indicate areas that influenced the model prediction; they are not tumor segmentation.</div>
            </div>
          </div>
        </section>

        <section id="analysis" className="section-space">
          <div className="page-shell">
            <div className="mx-auto max-w-3xl text-center"><span className="eyebrow">MRI analysis</span><h2 className="section-title mt-3">Analyze one scan at a time.</h2><p className="mt-4 text-base leading-7 text-slate-600">Upload a valid brain MRI image to run the saved checkpoint and generate a prediction with Grad-CAM.</p></div>
            <div className="mx-auto mt-10 max-w-5xl"><Disclaimer compact /><div className="mt-5"><UploadPanel file={file} previewUrl={previewUrl} onFile={selectFile} onAnalyze={runAnalysis} onRemove={removeFile} busy={busy} stage={stages[stageIndex]} /></div>{error && <div className="mt-5 flex items-start gap-3 border border-red-200 bg-red-50 p-4 text-sm text-red-900" role="alert"><AlertCircle className="mt-0.5 shrink-0" size={19} /><span>{error}</span></div>}<AnalysisResults result={result} /></div>
          </div>
        </section>

        <WorkflowSection />
        <ModelSection />
        <ResearchSection />
      </main>
      <footer className="bg-[#051521] py-10 text-slate-400">
        <div className="page-shell grid gap-7 md:grid-cols-[1fr_1.4fr] md:items-start"><div className="flex items-center gap-3 text-white"><BrainCircuit className="text-mint" /><span className="font-display text-xl font-semibold">NeuroScope</span></div><div><p className="text-sm leading-6">This application is developed for academic and research purposes. Its predictions are not a medical diagnosis and are not a substitute for professional medical advice, diagnosis, or treatment.</p><p className="mt-4 text-xs text-slate-500">EfficientNetB2 research deployment · Glioma · Meningioma · Pituitary</p></div></div>
      </footer>
    </div>
  )
}

