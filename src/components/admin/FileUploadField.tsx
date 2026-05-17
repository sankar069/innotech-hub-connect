import type React from "react";
import { FileText, Upload, X } from "lucide-react";

const defaultMaxSizeMb = 8;

export type StoredFileMeta = {
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  uploadedAt: string;
};

function isImage(value: string) {
  return value.startsWith("data:image/") || /\.(png|jpe?g|webp|gif|svg)(\?.*)?$/i.test(value);
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function formatSize(size: number) {
  if (!size) return "";
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileUploadField({
  label,
  value,
  onChange,
  accept = "image/jpeg,image/png,image/webp",
  helper,
  required,
  fallbackUrl = true,
  maxSizeMb = defaultMaxSizeMb,
  meta,
  onMetaChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  accept?: string;
  helper?: string;
  required?: boolean;
  fallbackUrl?: boolean;
  maxSizeMb?: number;
  meta?: Partial<StoredFileMeta>;
  onMetaChange?: (meta?: StoredFileMeta) => void;
}) {
  const [error, setError] = React.useState("");
  const inputId = React.useId();
  const fileName = meta?.fileName || (value && !value.startsWith("data:") ? value.split("/").pop() : "");

  const chooseFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setError("");
    if (file.size > maxSizeMb * 1024 * 1024) {
      setError(`File size should be under ${maxSizeMb} MB for now.`);
      event.target.value = "";
      return;
    }
    const accepted = accept.split(",").map((item) => item.trim()).filter(Boolean);
    const typeOk = accepted.some((item) => item.endsWith("/*") ? file.type.startsWith(item.replace("/*", "/")) : file.type === item || file.name.toLowerCase().endsWith(item.replace(".", "").toLowerCase()));
    if (accepted.length && !typeOk) {
      setError("Please choose an accepted file type.");
      event.target.value = "";
      return;
    }

    // TODO: Upload this file to Cloudinary/Vercel Blob/S3 and store the URL in MongoDB.
    // TODO: Store returned fileName, fileType, fileSize, fileUrl, and uploadedAt in the MongoDB document.
    // TODO: Replace the local preview data URL with the permanent storage URL.
    const fileUrl = await fileToDataUrl(file);
    onChange(fileUrl);
    onMetaChange?.({ fileName: file.name, fileType: file.type, fileSize: file.size, fileUrl, uploadedAt: new Date().toISOString() });
    event.target.value = "";
  };

  const remove = () => {
    onChange("");
    onMetaChange?.(undefined);
    setError("");
  };

  return (
    <label className="block">
      <span className="block text-xs uppercase font-mono tracking-widest text-muted-foreground mb-2">{label}{required ? " *" : ""}</span>
      <div className="rounded-xl border border-border bg-background/40 p-4">
        {value ? (
          <div className="mb-3">
            {isImage(value) ? (
              <img src={value} alt={`${label} preview`} className="h-28 w-28 rounded-xl object-cover border border-border" />
            ) : (
              <div className="flex items-center gap-3 rounded-xl border border-border bg-card/50 p-3 text-sm">
                <FileText className="h-5 w-5 text-primary" />
                <span className="min-w-0 truncate">{fileName || "Selected document"}</span>
              </div>
            )}
          </div>
        ) : null}
        <div className="flex flex-wrap items-center gap-3">
          <input id={inputId} type="file" accept={accept} onChange={chooseFile} className="sr-only" />
          <label htmlFor={inputId} className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold cursor-pointer">
            <Upload className="h-4 w-4" /> Choose File
          </label>
          {value ? <button type="button" onClick={remove} className="inline-flex items-center gap-2 rounded-xl border border-destructive/30 px-4 py-2.5 text-sm font-semibold text-destructive"><X className="h-4 w-4" /> Remove</button> : null}
          {fileName ? <span className="text-sm text-muted-foreground min-w-0 truncate">{fileName}{meta?.fileSize ? ` - ${formatSize(meta.fileSize)}` : ""}</span> : null}
        </div>
        {helper ? <p className="mt-3 text-xs text-muted-foreground">{helper}</p> : null}
        {fallbackUrl ? <input value={value.startsWith("data:") ? "" : value} onChange={(event) => onChange(event.target.value)} placeholder="Fallback URL if already hosted" className="mt-3 w-full bg-background/60 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary" /> : null}
        {error ? <p className="mt-3 text-xs text-destructive">{error}</p> : null}
      </div>
    </label>
  );
}

export function MultiFileUploadField({
  label,
  values,
  onChange,
  accept = "image/jpeg,image/png,image/webp",
  helper,
  maxSizeMb = defaultMaxSizeMb,
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  accept?: string;
  helper?: string;
  maxSizeMb?: number;
}) {
  const [error, setError] = React.useState("");
  const inputId = React.useId();

  const chooseFiles = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;
    setError("");
    const tooLarge = files.find((file) => file.size > maxSizeMb * 1024 * 1024);
    if (tooLarge) {
      setError(`Each file should be under ${maxSizeMb} MB for now.`);
      event.target.value = "";
      return;
    }
    // TODO: Upload these files to Cloudinary/Vercel Blob/S3 and store the returned URLs in MongoDB.
    const next = await Promise.all(files.map(fileToDataUrl));
    onChange([...values, ...next]);
    event.target.value = "";
  };

  return (
    <div className="md:col-span-2">
      <span className="block text-xs uppercase font-mono tracking-widest text-muted-foreground mb-2">{label}</span>
      <div className="rounded-xl border border-border bg-background/40 p-4">
        {values.length ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
            {values.map((value, index) => (
              <div key={`${value}-${index}`} className="relative">
                {isImage(value) ? <img src={value} alt="" className="aspect-square w-full rounded-xl object-cover border border-border" /> : <div className="aspect-square rounded-xl border border-border flex items-center justify-center"><FileText className="h-6 w-6 text-primary" /></div>}
                <button type="button" onClick={() => onChange(values.filter((_, itemIndex) => itemIndex !== index))} className="absolute right-2 top-2 rounded-full bg-background/80 border border-border p-1"><X className="h-3.5 w-3.5" /></button>
              </div>
            ))}
          </div>
        ) : null}
        <input id={inputId} type="file" accept={accept} multiple onChange={chooseFiles} className="sr-only" />
        <label htmlFor={inputId} className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold cursor-pointer">
          <Upload className="h-4 w-4" /> Choose Files
        </label>
        {helper ? <p className="mt-3 text-xs text-muted-foreground">{helper}</p> : null}
        {error ? <p className="mt-3 text-xs text-destructive">{error}</p> : null}
      </div>
    </div>
  );
}
