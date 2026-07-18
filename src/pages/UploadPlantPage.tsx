import { DashboardCard } from '../components/DashboardCard';
import { EmptyState } from '../components/EmptyState';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { PageContainer } from '../components/PageContainer';
import { StatisticCard } from '../components/StatisticCard';
import { UploadZone } from '../components/UploadZone';
import { analyzePlantImage } from '../services/analysisApi';
import { saveLatestAnalysis } from '../services/analysisStorage';
import { cn } from '../utils/cn';
import {
  CheckCircle2,
  ClipboardList,
  CloudUpload,
  FileImage,
  ScanSearch,
  ShieldCheck,
  Sprout,
  TriangleAlert,
  WandSparkles,
} from 'lucide-react';
import { ChangeEvent, DragEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type UploadStatus = 'idle' | 'uploading' | 'analyzing' | 'complete';

type SelectedAsset = {
  name: string;
  sizeLabel: string;
  typeLabel: string;
  previewUrl: string;
  isObjectUrl: boolean;
  file: File;
};

function formatFileSize(size: number) {
  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function getErrorMessage(error: unknown) {
  if (typeof error === 'object' && error && 'response' in error) {
    const response = error.response as { data?: { message?: string; details?: string[] } };
    return response.data?.details?.[0] || response.data?.message || 'Unable to analyze the plant image.';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Unable to analyze the plant image.';
}

export function UploadPlantPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [asset, setAsset] = useState<SelectedAsset | null>(null);

  const isProcessing = status === 'uploading' || status === 'analyzing';

  const uploadStats = useMemo(
    () => [
      { label: 'Accepted formats', value: 'JPG / PNG', detail: 'Optimized for plant photos.', icon: FileImage },
      { label: 'Recommended size', value: 'Under 5 MB', detail: 'Matches backend upload limits.', icon: CloudUpload },
      { label: 'Analysis mode', value: isProcessing ? 'In progress' : 'Ready', detail: 'Upload, analyze, and redirect.', icon: ScanSearch },
      { label: 'Safety', value: 'Backend validation', detail: 'File type and size are checked.', icon: ShieldCheck },
    ],
    [isProcessing]
  );

  useEffect(() => {
    return () => {
      if (asset?.isObjectUrl) {
        URL.revokeObjectURL(asset.previewUrl);
      }
    };
  }, [asset]);

  function setSelectedFile(file: File) {
    if (!file.type.startsWith('image/')) {
      setError('Please choose a JPG or PNG image.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Images must be smaller than 5 MB.');
      return;
    }

    setError(null);
    setProgress(0);
    setStatus('idle');

    setAsset((currentAsset) => {
      if (currentAsset?.isObjectUrl) {
        URL.revokeObjectURL(currentAsset.previewUrl);
      }

      return {
        name: file.name,
        sizeLabel: formatFileSize(file.size),
        typeLabel: file.type.replace('image/', '').toUpperCase(),
        previewUrl: URL.createObjectURL(file),
        isObjectUrl: true,
        file,
      };
    });
  }

  function handleBrowse() {
    fileInputRef.current?.click();
  }

  async function handleAnalyze() {
    if (!asset?.file) {
      setError('Select an image before starting analysis.');
      return;
    }

    setError(null);
    setStatus('uploading');
    setProgress(0);

    try {
      const analysis = await analyzePlantImage(asset.file, (nextProgress) => {
        setProgress(nextProgress);
        setStatus(nextProgress >= 100 ? 'analyzing' : 'uploading');
      });

      setProgress(100);
      setStatus('complete');
      saveLatestAnalysis(analysis);
      navigate('/results', { state: { analysis } });
    } catch (analysisError) {
      setStatus('idle');
      setProgress(0);
      setError(getErrorMessage(analysisError));
    }
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (file) {
      setSelectedFile(file);
    }
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragActive(false);

    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
    }
  }

  function handleClear() {
    setError(null);
    setProgress(0);
    setStatus('idle');

    setAsset((currentAsset) => {
      if (currentAsset?.isObjectUrl) {
        URL.revokeObjectURL(currentAsset.previewUrl);
      }

      return null;
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  const recommendationItems = [
    'Place the plant near a bright window before taking the photo.',
    'Avoid heavy shadows so leaf texture and color stay visible.',
    'Keep the subject centered to help the backend produce a better match.',
  ];

  return (
    <PageContainer className="space-y-8 pb-16 pt-8 sm:space-y-10">
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr] xl:items-end">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-leaf-200">Upload plant</p>
          <h1 className="max-w-3xl font-display text-4xl font-semibold leading-tight text-cream sm:text-5xl lg:text-6xl">
            Connect the upload flow to live backend analysis.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-300">
            Upload a plant image, stream progress into the UI, and redirect to the results view after the backend returns
            PlantNet identification and analysis data.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { title: 'Drag and drop', note: 'Drop an image anywhere in the upload zone.', icon: CloudUpload },
            { title: 'Fast preview', note: 'See your selected image before sending it.', icon: FileImage },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.title} className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-soft transition hover:-translate-y-1 hover:bg-white/[0.07]">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-leaf-400/15 text-leaf-200">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="mt-4 text-lg font-semibold text-cream">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">{item.note}</p>
              </div>
            );
          })}
        </div>
      </div>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {uploadStats.map((item) => (
          <StatisticCard key={item.label} {...item} />
        ))}
      </section>

      <div
        onDragEnter={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setDragActive(false);
        }}
        onDrop={handleDrop}
      >
        <UploadZone
          className={cn('scroll-mt-24')}
          fileName={asset?.name}
          previewImageUrl={asset?.previewUrl}
          progress={progress}
          status={status}
          isDragActive={dragActive}
          isAnalyzing={isProcessing}
          primaryActionLabel={status === 'analyzing' ? 'Analyzing…' : 'Analyze plant'}
          isPrimaryActionDisabled={!asset?.file || isProcessing}
          onBrowse={handleBrowse}
          onPrimaryAction={handleAnalyze}
          onClear={handleClear}
        />
      </div>

      <input ref={fileInputRef} type="file" accept="image/jpeg,image/png" className="hidden" onChange={handleInputChange} />

      {error ? (
        <div className="rounded-3xl border border-amber-400/20 bg-amber-400/10 px-5 py-4 text-sm text-amber-100">
          <div className="flex items-center gap-2 font-semibold">
            <TriangleAlert className="h-4 w-4" />
            Upload issue
          </div>
          <p className="mt-2 leading-6">{error}</p>
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <DashboardCard title="Live preview" action={<span className="text-sm text-slate-400">{asset ? status : 'No file selected'}</span>}>
          {asset ? (
            <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950">
              <img src={asset.previewUrl} alt={asset.name} className="h-[22rem] w-full object-cover sm:h-[28rem]" />
              <div className="grid gap-3 border-t border-white/10 bg-white/[0.03] p-5 sm:grid-cols-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-500">File</p>
                  <p className="mt-2 text-sm font-medium text-cream">{asset.name}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Size</p>
                  <p className="mt-2 text-sm font-medium text-cream">{asset.sizeLabel}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Type</p>
                  <p className="mt-2 text-sm font-medium text-cream">{asset.typeLabel}</p>
                </div>
              </div>
            </div>
          ) : (
            <EmptyState
              icon={Sprout}
              title="No image selected yet"
              description="Browse for a plant image or drop one into the upload area to see the preview card update instantly."
              actionLabel="Browse image"
              onClick={handleBrowse}
            />
          )}
        </DashboardCard>

        <DashboardCard title="Analysis workflow">
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between gap-4 text-sm text-slate-400">
                <span className="inline-flex items-center gap-2 text-slate-300">
                  <FileImage className="h-4 w-4 text-leaf-300" />
                  Upload file
                </span>
                <span>{status === 'idle' ? 'Waiting' : status === 'uploading' ? 'Uploading' : 'Processing'}</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-leaf-400 to-brand-300 transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between gap-4 text-sm text-slate-400">
                <span className="inline-flex items-center gap-2 text-slate-300">
                  <ScanSearch className="h-4 w-4 text-leaf-300" />
                  Backend analysis
                </span>
                <span>{status === 'complete' ? 'Complete' : status === 'analyzing' ? 'Analysis running' : 'Pending'}</span>
              </div>
              <div className="mt-3 space-y-3">
                {isProcessing ? (
                  <>
                    <LoadingSkeleton className="h-3 w-full" />
                    <LoadingSkeleton className="h-3 w-5/6" />
                    <LoadingSkeleton className="h-3 w-2/3" />
                  </>
                ) : (
                  <p className="text-sm leading-6 text-slate-300">
                    Select a plant image, then start analysis to send it through PlantNet identification and analysis.
                  </p>
                )}
              </div>
            </div>

            <div className={cn('rounded-2xl border p-4', status === 'complete' ? 'border-leaf-400/20 bg-leaf-400/10' : 'border-white/10 bg-white/5')}>
              <div className="flex items-center gap-2 text-sm font-semibold text-cream">
                <WandSparkles className="h-4 w-4 text-leaf-300" />
                Analysis outcome
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                {status === 'complete'
                  ? 'Analysis complete. You will be redirected to the results page with the normalized PlantNet and response.'
                  : 'Once the request returns, the app will persist the record and navigate to the results page.'}
              </p>
            </div>
          </div>
        </DashboardCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <DashboardCard title="Upload checklist">
          <div className="space-y-3">
            {recommendationItems.map((item) => (
              <div key={item} className="flex gap-3 rounded-2xl bg-white/5 p-4 text-sm text-slate-300">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-leaf-300" />
                <p className="leading-6">{item}</p>
              </div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard title="Helpful notes">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { title: 'Best results', copy: 'Use a single plant against a calm background with clear leaf edges.', icon: ClipboardList },
              { title: 'Loading states', copy: 'The upload button shows real progress and analysis loading feedback.', icon: ShieldCheck },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-leaf-400/15 text-leaf-200">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-cream">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{item.copy}</p>
                </div>
              );
            })}
          </div>
        </DashboardCard>
      </div>
    </PageContainer>
  );
}
