import { useMemo, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { FileUploadField, MultiFileUploadField, type StoredFileMeta } from "@/components/admin/FileUploadField";
import { type CmsCollection, type CmsItem, slugify, upsertCmsItem, useCmsCollection } from "@/lib/cms";

export type CmsField = {
  key: string;
  label: string;
  type?: "text" | "number" | "textarea" | "checkbox" | "select" | "image" | "file" | "document" | "video" | "audio" | "gallery";
  required?: boolean;
  options?: string[];
  helper?: string;
  accept?: string;
};

export function CmsModule({
  title,
  description,
  collection,
  fields,
}: {
  title: string;
  description: string;
  collection: CmsCollection;
  fields: CmsField[];
}) {
  const { items, setItems } = useCmsCollection(collection);
  const [editing, setEditing] = useState<CmsItem | null>(null);
  const [message, setMessage] = useState("");
  const sortedItems = useMemo(() => [...items].sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0)), [items]);

  const startNew = () => {
    setEditing({
      id: crypto.randomUUID(),
      active: true,
      order: sortedItems.length + 1,
    });
    setMessage("");
  };

  const updateEditing = (key: string, value: unknown) => {
    setEditing((current) => {
      if (!current) return current;
      const next = { ...current, [key]: value };
      if (key === "name" && !next.slug) next.slug = slugify(String(value));
      if (key === "title" && !next.slug) next.slug = slugify(String(value));
      return next;
    });
  };

  const save = () => {
    if (!editing) return;
    const missing = fields.find((field) => field.required && !editing[field.key]);
    if (missing) {
      setMessage(`${missing.label} is required.`);
      return;
    }
    setItems(upsertCmsItem(items, editing));
    setMessage("Saved successfully.");
    setEditing(null);
  };

  const remove = (item: CmsItem) => {
    if (!window.confirm("Delete this item?")) return;
    setItems(items.filter((current) => current.id !== item.id));
    setMessage("Deleted successfully.");
  };

  const toggle = (item: CmsItem) => {
    setItems(items.map((current) => (current.id === item.id ? { ...current, active: current.active === false } : current)));
  };

  return (
    <div className="space-y-6">
      <div className="glass-strong rounded-2xl p-6 racing-border">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          </div>
          <button onClick={startNew} className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">
            <Plus className="h-4 w-4" /> Create first item
          </button>
        </div>
        {message && <p className="mt-4 text-sm text-primary">{message}</p>}
      </div>

      {editing && (
        <div className="glass-strong rounded-2xl p-6 racing-border">
          <h3 className="text-xl font-bold mb-5">Edit Item</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {fields.map((field) => (
              <FieldEditor key={field.key} field={field} value={editing[field.key]} onChange={(value) => updateEditing(field.key, value)} onMetaChange={(meta) => updateEditing(`${field.key}Meta`, meta ?? null)} />
            ))}
          </div>
          <div className="flex flex-wrap gap-3 mt-6">
            <button onClick={save} className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-5 py-3 text-sm font-semibold text-primary-foreground">
              <Save className="h-4 w-4" /> Save Changes
            </button>
            <button onClick={() => setEditing(null)} className="rounded-xl border border-border px-5 py-3 text-sm font-semibold text-foreground">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {sortedItems.length === 0 && (
          <div className="glass rounded-2xl p-6 text-sm text-muted-foreground">No items added yet</div>
        )}
        {sortedItems.map((item) => (
          <div key={item.id} className="glass-strong rounded-2xl p-5 racing-border">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-bold">{String(item.title ?? item.name ?? item.sectionHeading ?? item.email ?? item.id)}</h3>
                <p className="mt-1 text-xs text-muted-foreground">Order {String(item.order ?? "-")} · {item.active === false ? "Inactive" : "Active"}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setEditing(item)} className="rounded-lg border border-border px-3 py-2 text-sm">Edit</button>
                <button onClick={() => toggle(item)} className="rounded-lg border border-border px-3 py-2 text-sm">{item.active === false ? "Activate" : "Deactivate"}</button>
                <button onClick={() => remove(item)} className="inline-flex items-center gap-1 rounded-lg border border-destructive/30 px-3 py-2 text-sm text-destructive">
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FieldEditor({ field, value, onChange, onMetaChange }: { field: CmsField; value: unknown; onChange: (value: unknown) => void; onMetaChange: (meta?: StoredFileMeta) => void }) {
  const baseClass = "w-full bg-background/60 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors";

  return (
    <label className={field.type === "textarea" ? "md:col-span-2" : ""}>
      <span className="block text-xs uppercase font-mono tracking-widest text-muted-foreground mb-2">{field.label}</span>
      {field.type === "textarea" ? (
        <textarea value={String(value ?? "")} onChange={(event) => onChange(event.target.value)} rows={5} className={baseClass} />
      ) : field.type === "checkbox" ? (
        <input type="checkbox" checked={value !== false} onChange={(event) => onChange(event.target.checked)} className="h-5 w-5 accent-primary" />
      ) : field.type === "select" ? (
        <select value={String(value ?? "")} onChange={(event) => onChange(event.target.value)} className={baseClass}>
          <option value="">Select</option>
          {field.options?.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      ) : field.type === "image" || field.type === "file" || field.type === "document" || field.type === "video" || field.type === "audio" ? (
        <FileUploadField
          label={field.label}
          value={String(value ?? "")}
          onChange={onChange}
          accept={field.accept ?? (field.type === "document" ? ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" : field.type === "video" ? "video/*" : field.type === "audio" ? "audio/*" : "image/jpeg,image/png,image/webp")}
          helper={field.helper}
          onMetaChange={onMetaChange}
        />
      ) : field.type === "gallery" ? (
        <MultiFileUploadField label={field.label} values={Array.isArray(value) ? value.map(String) : []} onChange={onChange} accept={field.accept ?? "image/jpeg,image/png,image/webp"} helper={field.helper} />
      ) : (
        <>
          <input type={field.type === "number" ? "number" : "text"} value={String(value ?? "")} onChange={(event) => onChange(field.type === "number" ? Number(event.target.value) : event.target.value)} className={baseClass} />
        </>
      )}
    </label>
  );
}
