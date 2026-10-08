import { FileImage, ImagePlus, LoaderCircle, RotateCcw, ScanLine, Trash2, UploadCloud } from 'lucide-react'
import { useRef, useState } from 'react'

const ACCEPTED_TYPES = ['image/png', 'image/jpeg']
const MAX_SIZE = 10 * 1024 * 1024

export function UploadPanel({ file, previewUrl, onFile, onAnalyze, onRemove, busy, stage }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [localError, setLocalError] = useState('')

  function validate(nextFile) {
    if (!nextFile) return
    if (!ACCEPTED_TYPES.includes(nextFile.type)) {
      setLocalError('Please choose a PNG, JPG, or JPEG image.')
      return
    }
    if (nextFile.size > MAX_SIZE) {
      setLocalError('The image must be smaller than 10 MB.')
      return
    }
    setLocalError('')
    onFile(nextFile)
  }

  function handleDrop(event) {
    event.preventDefault()
    setDragging(false)
    validate(event.dataTransfer.files?.[0])
  }

  if (file && previewUrl) {
    return (
      <div className="analysis-panel overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <FileImage className="shrink-0 text-teal" size={20} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">{file.name}</p>
              <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB · ready for analysis</p>
            </div>
          </div>
          <button className="icon-button" onClick={onRemove} disabled={busy} aria-label="Remove selected image"><Trash2 size={18} /></button>
        </div>
        <div className="grid gap-0 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,.85fr)]">
          <div className="relative grid min-h-[330px] place-items-center bg-[#071521] p-5">
            <img className="max-h-[430px] w-auto max-w-full object-contain" src={previewUrl} alt="Selected MRI preview" />
            <span className="absolute left-4 top-4 border border-white/20 bg-slate-950/75 px-2.5 py-1 text-xs font-bold uppercase tracking-[0.15em] text-white">Input preview</span>
          </div>
          <div className="flex flex-col justify-between bg-white p-6 sm:p-8">
            <div>
              <span className="eyebrow">Ready to process</span>
              <h3 className="mt-3 font-display text-2xl font-semibold text-slate-950">Run EfficientNetB2 inference</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">The image will be decoded with OpenCV, resized to 240 × 240, and analyzed using the saved model checkpoint.</p>
              <ul className="mt-6 space-y-3 text-sm text-slate-700">
                <li className="flex gap-3"><ScanLine className="shrink-0 text-teal" size={18} /> Three-class probability output</li>
                <li className="flex gap-3"><ImagePlus className="shrink-0 text-teal" size={18} /> Grad-CAM attention visualization</li>
              </ul>
            </div>
            <div className="mt-8 space-y-3">
              <button className="button-primary w-full justify-center" onClick={onAnalyze} disabled={busy}>
                {busy ? <><LoaderCircle className="animate-spin" size={19} /> {stage}</> : <><ScanLine size={19} /> Analyze MRI</>}
              </button>
              <button className="button-secondary w-full justify-center" onClick={() => inputRef.current?.click()} disabled={busy}><RotateCcw size={18} /> Choose another image</button>
            </div>
          </div>
        </div>
        <input ref={inputRef} className="sr-only" type="file" accept=".png,.jpg,.jpeg,image/png,image/jpeg" onChange={(e) => validate(e.target.files?.[0])} />
      </div>
    )
  }

  return (
    <div className="analysis-panel p-4 sm:p-6">
      <div
        className={`upload-zone ${dragging ? 'upload-zone-active' : ''}`}
        onDragEnter={(e) => { e.preventDefault(); setDragging(true) }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-mint/20 text-teal"><UploadCloud size={30} /></div>
        <h3 className="mt-5 font-display text-2xl font-semibold text-slate-950">Upload a brain MRI image</h3>
        <p className="mt-2 max-w-md text-center text-slate-600">Drag and drop a scan here, or browse your device. Your image is processed for this analysis only.</p>
        <button className="button-primary mt-6" onClick={() => inputRef.current?.click()}><ImagePlus size={19} /> Browse image</button>
        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">PNG, JPG or JPEG · maximum 10 MB</p>
        {localError && <p className="mt-4 text-sm font-semibold text-red-700" role="alert">{localError}</p>}
        <input ref={inputRef} className="sr-only" type="file" accept=".png,.jpg,.jpeg,image/png,image/jpeg" onChange={(e) => validate(e.target.files?.[0])} />
      </div>
    </div>
  )
}

