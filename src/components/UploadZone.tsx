import { cn } from '../utils/cn';
import { ArrowUpFromLine, ImagePlus, LoaderCircle, Sparkles, CheckCircle2, X } from 'lucide-react';

type UploadZoneProps = {
  className?: string;
  isDragActive?: boolean;
  previewImageUrl?: string | null;
  fileName?: string | null;
  progress?: number;
  status?: 'idle' | 'uploading' | 'analyzing' | 'complete';
  isAnalyzing?: boolean;
  primaryActionLabel?: string;
  isPrimaryActionDisabled?: boolean;
  onBrowse: () => void;
  onPrimaryAction: () => void;
  onClear?: () => void;
};

export function UploadZone({
  className,
  isDragActive = false,
  previewImageUrl,
  fileName,
  progress = 0,
  status = 'idle',
  isAnalyzing = false,
  primaryActionLabel = 'Analyze plant',
  isPrimaryActionDisabled = false,
  onBrowse,
  onPrimaryAction,
  onClear,
}: UploadZoneProps) {
  const hasPreview = Boolean(previewImageUrl);
  const statusLabel =
    status === 'uploading' ? 'Uploading' : status === 'analyzing' ? 'Analyzing' : status === 'complete' ? 'Complete' : 'Idle';

  return (
    <section className={cn('rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-soft backdrop-blur-xl transition duration-300', isDragActive && 'border-leaf-400/40 bg-leaf-400/10', className)}>
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/65 p-7 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-leaf-400/20 to-brand-400/20 text-leaf-200 ring-1 ring-inset ring-white/10">
            <ImagePlus className="h-8 w-8" />
          </div>
          <div className="mx-auto max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              {isDragActive ? 'Release to upload' : 'Upload workspace'}
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-cream sm:text-3xl">Drag and drop your plant photo</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
              Add a crisp plant image to preview the upload experience, progress states, and analysis flow used across the app.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={onBrowse}
              className="inline-flex items-center gap-2 rounded-full bg-cream px-5 py-3 text-sm font-semibold text-brand-900 transition duration-300 hover:-translate-y-0.5 hover:shadow-lift"
            >
              <ArrowUpFromLine className="h-4 w-4" />
              Browse image
            </button>
            <button
              type="button"
              onClick={onPrimaryAction}
              disabled={isPrimaryActionDisabled}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-cream transition duration-300 hover:border-leaf-400/30 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4 text-leaf-300" />
              {primaryActionLabel}
            </button>
          </div>
          {fileName ? (
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-leaf-400/20 bg-leaf-400/10 px-4 py-2 text-sm text-leaf-100">
              <CheckCircle2 className="h-4 w-4" />
              {fileName}
              {onClear ? (
                <button type="button" onClick={onClear} className="ml-1 inline-flex h-6 w-6 items-center justify-center rounded-full text-leaf-100 transition hover:bg-leaf-400/15" aria-label="Remove selected file">
                  <X className="h-4 w-4" />
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
        <div className="space-y-4 rounded-[1.75rem] border border-white/10 bg-slate-950/65 p-6">
          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-4">
            <div className="flex items-center justify-between text-sm text-slate-400">
              <span>Image preview</span>
              <span>{hasPreview ? 'Ready' : 'Placeholder'}</span>
            </div>
            <div className="mt-3 overflow-hidden rounded-2xl border border-dashed border-white/10 bg-[radial-gradient(circle_at_top,rgba(91,136,178,0.18),transparent_55%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))]">
              {hasPreview ? (
                <img src={previewImageUrl ?? ''} alt="Selected plant preview" className="aspect-[4/3] h-full w-full object-cover" />
              ) : (
                <div className="flex aspect-[4/3] items-center justify-center px-6 text-center text-sm leading-6 text-slate-400">
                  Your uploaded image will appear here with a crisp, app-style preview frame.
                </div>
              )}
            </div>
            <p className="mt-3 text-sm text-slate-400">{fileName ?? 'No file selected yet'}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-4">
            <div className="mb-3 flex items-center justify-between text-sm text-slate-400">
              <span>Upload progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-gradient-to-r from-leaf-400 to-brand-300 transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-cream">
              <LoaderCircle className="h-4 w-4 animate-spin text-leaf-300" />
              {isAnalyzing ? 'Analysis in progress' : 'Analysis loading state'}
            </div>
            <p className="mb-3 text-xs uppercase tracking-[0.22em] text-slate-500">State: {statusLabel}</p>
            <div className="space-y-3">
              <div className="h-3 w-3/4 rounded-full bg-white/10" />
              <div className="h-3 w-1/2 rounded-full bg-white/10" />
              <div className="h-3 w-5/6 rounded-full bg-white/10" />
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              {isAnalyzing
                ? 'The upload is being prepared for analysis and the interface will reflect progress in real time.'
                : 'This panel is designed to show the status while the upload and analysis pipeline runs.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}