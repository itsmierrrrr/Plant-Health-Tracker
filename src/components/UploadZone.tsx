import { cn } from '../utils/cn';
import { ArrowUpFromLine, ImagePlus, LoaderCircle, Sparkles, CheckCircle2, X } from 'lucide-react';
import { ResponsiveImage } from './ResponsiveImage';

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
    <section className={cn('rounded-[2rem] border border-[#dfe5d9] bg-[#fffdf7] p-6 shadow-soft transition duration-300', isDragActive && 'border-[#86c4b7] bg-[#eef8f5]', className)}>
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[1.75rem] border border-[#dfe5d9] bg-[#f5f1e7] p-7 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-[#347c70]/20 to-[#86c4b7]/30 text-[#347c70] ring-1 ring-inset ring-[#b5ddd3]">
            <ImagePlus className="h-8 w-8" />
          </div>
          <div className="mx-auto max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#dfe5d9] bg-[#f5f1e7] px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#708079]">
              {isDragActive ? 'Release to upload' : 'Upload workspace'}
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-[#20312f] sm:text-3xl">Drag and drop your plant photo</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#526460] sm:text-base">
              Add a crisp plant image to preview the upload experience, progress states, and analysis flow used across the app.
            </p>
          </div>
          <div className="mt-6 flex flex-col items-center justify-center gap-3">
            <button
              type="button"
              onClick={onBrowse}
              className="meadow-button inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold"
            >
              <ArrowUpFromLine className="h-4 w-4" />
              Browse image
            </button>
            <button
              type="button"
              onClick={onPrimaryAction}
              disabled={isPrimaryActionDisabled}
              className="meadow-button-secondary inline-flex min-w-56 items-center justify-center gap-2 rounded-full border px-8 py-4 text-base font-semibold disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4 text-[#28685e]" />
              {primaryActionLabel}
            </button>
          </div>
          {fileName ? (
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#b5ddd3] bg-[#eef8f5] px-4 py-2 text-sm text-[#347c70]">
              <CheckCircle2 className="h-4 w-4" />
              {fileName}
              {onClear ? (
                <button type="button" onClick={onClear} className="ml-1 inline-flex h-6 w-6 items-center justify-center rounded-full text-[#347c70] transition hover:bg-[#e8f3ef]" aria-label="Remove selected file">
                  <X className="h-4 w-4" />
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
        <div className="space-y-4 rounded-[1.75rem] border border-[#dfe5d9] bg-[#eef8f5] p-6">
          <div className="rounded-3xl border border-[#dfe5d9] bg-[#fffdf7] p-4">
            <div className="flex items-center justify-between text-sm text-[#708079]">
              <span>Image preview</span>
              <span>{hasPreview ? 'Ready' : 'Placeholder'}</span>
            </div>
            <div className="mt-3 overflow-hidden rounded-2xl border border-dashed border-[#b5ddd3] bg-[radial-gradient(circle_at_top,rgba(52,124,112,0.12),transparent_55%),linear-gradient(180deg,rgba(255,255,255,0.7),rgba(238,248,245,0.8))]">
              {hasPreview ? (
                <ResponsiveImage src={previewImageUrl ?? '/plant.png'} alt="Selected plant preview" sizes="(min-width: 1024px) 40vw, 100vw" className="aspect-[4/3]" />
              ) : (
                <div className="flex aspect-[4/3] items-center justify-center px-6 text-center text-sm leading-6 text-[#708079]">
                  Your uploaded image will appear here with a crisp, app-style preview frame.
                </div>
              )}
            </div>
            <p className="mt-3 text-sm text-[#708079]">{fileName ?? 'No file selected yet'}</p>
          </div>
          <div className="rounded-3xl border border-[#dfe5d9] bg-[#fffdf7] p-4">
            <div className="mb-3 flex items-center justify-between text-sm text-[#708079]">
              <span>Upload progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[#eef1eb]">
              <div className="h-full rounded-full bg-gradient-to-r from-leaf-400 to-brand-300 transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <div className="rounded-3xl border border-[#dfe5d9] bg-[#fffdf7] p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#20312f]">
              <LoaderCircle className="h-4 w-4 animate-spin text-[#28685e]" />
              {isAnalyzing ? 'Analysis in progress' : 'Analysis loading state'}
            </div>
            <p className="mb-3 text-xs uppercase tracking-[0.22em] text-[#8a9890]">State: {statusLabel}</p>
            <div className="space-y-3">
              <div className="h-3 w-3/4 rounded-full bg-[#eef1eb]" />
              <div className="h-3 w-1/2 rounded-full bg-[#eef1eb]" />
              <div className="h-3 w-5/6 rounded-full bg-[#eef1eb]" />
            </div>
            <p className="mt-4 text-sm leading-6 text-[#708079]">
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