import { AdminLayout } from "@/components/admin/AdminLayout";
import { useState } from "react";
import { CmsModule, type CmsField } from "@/components/admin/CmsModule";
import type { CmsCollection } from "@/lib/cms";

const commonFields: CmsField[] = [
  { key: "order", label: "Display Order", type: "number" },
  { key: "active", label: "Active", type: "checkbox" },
];

const configs: Record<string, { title: string; description: string; collection: CmsCollection; fields: CmsField[] }> = {
  traction: {
    title: "Website Stats / Traction",
    description: "Manage Live Traction Telemetry and Current Traction values shown on the public website.",
    collection: "tractionStats",
    fields: [
      { key: "sectionLabel", label: "Section Label" },
      { key: "sectionHeading", label: "Section Heading" },
      { key: "title", label: "Stat Title", required: true },
      { key: "value", label: "Stat Value", type: "number", required: true },
      { key: "prefix", label: "Prefix" },
      { key: "suffix", label: "Suffix" },
      { key: "description", label: "Description", type: "textarea" },
      ...commonFields,
    ],
  },
  "hero-stats": {
    title: "Hero / Live Traction Telemetry",
    description: "Manage hero stat cards, support notes, icons, order, and visibility.",
    collection: "siteStats",
    fields: [
      { key: "title", label: "Stat Title", required: true },
      { key: "value", label: "Stat Value", required: true },
      { key: "prefix", label: "Prefix" },
      { key: "suffix", label: "Suffix" },
      { key: "shortLabel", label: "Short Label" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "icon", label: "Icon Name" },
      ...commonFields,
    ],
  },
  "roadmap-stats": {
    title: "Roadmap Overview Stats",
    description: "Manage roadmap overview stat cards.",
    collection: "roadmapStats",
    fields: [
      { key: "title", label: "Stat Title", required: true },
      { key: "value", label: "Value", required: true },
      { key: "description", label: "Description", type: "textarea" },
      ...commonFields,
    ],
  },
  "roadmap-phases": {
    title: "Roadmap Development Phases",
    description: "Manage phase code, title, status, progress, and checklist items.",
    collection: "roadmapPhases",
    fields: [
      { key: "code", label: "Phase Code", required: true },
      { key: "title", label: "Phase Title", required: true },
      { key: "status", label: "Status", required: true },
      { key: "progress", label: "Progress Percentage", type: "number" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "items", label: "Checklist Items", type: "textarea" },
      ...commonFields,
    ],
  },
  "roadmap-milestones": {
    title: "Roadmap Milestones",
    description: "Manage milestone timeline, title, status, and visibility.",
    collection: "roadmapMilestones",
    fields: [
      { key: "timeline", label: "Timeline / Quarter", required: true },
      { key: "title", label: "Milestone Title", required: true },
      { key: "status", label: "Status", required: true },
      { key: "description", label: "Description", type: "textarea" },
      ...commonFields,
    ],
  },
  team: {
    title: "Team Categories",
    description: "Manage public team category cards.",
    collection: "teamCategories",
    fields: [
      { key: "name", label: "Category Name", required: true },
      { key: "slug", label: "Slug", required: true },
      { key: "shortDescription", label: "Short Description", type: "textarea" },
      { key: "icon", label: "Icon" },
      ...commonFields,
    ],
  },
  "team-members": {
    title: "Team Members",
    description: "Manage members shown on dynamic team category pages.",
    collection: "teamMembers",
    fields: [
      { key: "name", label: "Member Name", required: true },
      { key: "role", label: "Role / Designation" },
      { key: "category", label: "Team Category", type: "select", options: ["founders-core", "event-operations", "tech-product", "design-media", "community", "partnerships"], required: true },
      { key: "profileImage", label: "Profile Image Upload", type: "image", helper: "Use square or 4:5 portrait images. JPG, PNG, WebP accepted." },
      { key: "bio", label: "Short Bio", type: "textarea" },
      { key: "message", label: "Motivation / Message / Quote", type: "textarea" },
      { key: "skills", label: "Skills / Responsibilities", type: "textarea" },
      { key: "linkedinUrl", label: "LinkedIn URL" },
      { key: "githubUrl", label: "GitHub URL" },
      { key: "instagramUrl", label: "Instagram URL" },
      { key: "portfolioUrl", label: "Portfolio URL" },
      { key: "email", label: "Email" },
      ...commonFields,
    ],
  },
  partners: {
    title: "Partners",
    description: "Manage partner cards shown in Partners & Sponsors.",
    collection: "partners",
    fields: [
      { key: "name", label: "Partner Name", required: true },
      { key: "logoUrl", label: "Logo/Image Upload", type: "image", helper: "JPG, PNG, WebP accepted. A fallback hosted URL can still be pasted below." },
      { key: "websiteUrl", label: "Website URL" },
      { key: "shortDescription", label: "Short Description", type: "textarea" },
      { key: "category", label: "Category / Type" },
      { key: "contactPerson", label: "Contact Person" },
      { key: "contactEmail", label: "Contact Email" },
      ...commonFields,
    ],
  },
  events: {
    title: "Events CMS",
    description: "Manage event platform entries for future public event listings.",
    collection: "events",
    fields: [
      { key: "title", label: "Event Title", required: true },
      { key: "slug", label: "Slug" },
      { key: "eventType", label: "Event Type" },
      { key: "date", label: "Date" },
      { key: "shortDescription", label: "Short Description", type: "textarea" },
      { key: "coverImage", label: "Cover Image URL", type: "image" },
      { key: "registrationUrl", label: "Registration URL" },
      ...commonFields,
    ],
  },
  sponsors: {
    title: "Sponsors",
    description: "Manage sponsor cards and sponsorship levels.",
    collection: "sponsors",
    fields: [
      { key: "name", label: "Sponsor Name", required: true },
      { key: "logoUrl", label: "Logo/Image Upload", type: "image", helper: "JPG, PNG, WebP accepted. A fallback hosted URL can still be pasted below." },
      { key: "websiteUrl", label: "Website URL" },
      { key: "shortDescription", label: "Short Description", type: "textarea" },
      { key: "sponsorshipLevel", label: "Sponsorship Level", type: "select", options: ["Platinum", "Gold", "Silver", "Bronze", "Community Partner", "Other"] },
      { key: "eventName", label: "Sponsored Event Name" },
      { key: "contactPerson", label: "Contact Person" },
      { key: "contactEmail", label: "Contact Email" },
      ...commonFields,
    ],
  },
  "media-categories": {
    title: "Media Categories",
    description: "Manage media category cards.",
    collection: "mediaCategories",
    fields: [
      { key: "name", label: "Category Name", required: true },
      { key: "slug", label: "Slug", required: true },
      { key: "shortDescription", label: "Short Description", type: "textarea" },
      ...commonFields,
    ],
  },
  "media-posts": {
    title: "Media Posts",
    description: "Manage media posts shown on category pages.",
    collection: "mediaPosts",
    fields: [
      { key: "title", label: "Media Title", required: true },
      { key: "category", label: "Category", type: "select", options: ["event-highlights", "student-testimonials", "podcast-clips", "hackathon-stories", "tech-fest-moments", "partner-shoutouts"], required: true },
      { key: "slug", label: "Post Slug" },
      { key: "thumbnail", label: "Cover Image Upload", type: "image", helper: "JPG, PNG, WebP accepted." },
      { key: "gallery", label: "Multiple Image Upload / Gallery", type: "gallery", helper: "Choose one or more JPG, PNG, or WebP images." },
      { key: "shortDescription", label: "Short Description", type: "textarea" },
      { key: "content", label: "Full Description / Content", type: "textarea" },
      { key: "videoFile", label: "Video Upload Placeholder", type: "video", helper: "Mock preview only until storage is connected." },
      { key: "videoUrl", label: "Video URL" },
      { key: "audioFile", label: "Podcast / Audio Upload Placeholder", type: "audio", helper: "Mock preview only until storage is connected." },
      { key: "audioUrl", label: "Podcast / Audio URL" },
      { key: "externalLink", label: "External Link" },
      { key: "eventName", label: "Event Name" },
      { key: "date", label: "Date" },
      { key: "author", label: "Author / Contributor" },
      { key: "tags", label: "Tags" },
      ...commonFields,
    ],
  },
  pages: {
    title: "Static Pages",
    description: "Manage Privacy Policy, Terms & Conditions, and Rules & Regulations.",
    collection: "pages",
    fields: [
      { key: "title", label: "Page Title", required: true },
      { key: "slug", label: "Page Slug", required: true },
      { key: "content", label: "Page Content", type: "textarea", required: true },
      { key: "lastUpdated", label: "Last Updated Date" },
      ...commonFields,
    ],
  },
};

export function AdminCmsPage({ module }: { module: keyof typeof configs }) {
  const config = configs[module];

  return (
    <AdminLayout title={config.title}>
      {() => <CmsModule {...config} />}
    </AdminLayout>
  );
}

export function AdminRoadmapCmsPage() {
  return (
    <AdminLayout title="Roadmap CMS">
      {() => (
        <div className="space-y-8">
          <CmsModule {...configs["roadmap-stats"]} />
          <CmsModule {...configs["roadmap-phases"]} />
          <CmsModule {...configs["roadmap-milestones"]} />
        </div>
      )}
    </AdminLayout>
  );
}

export function AdminTeamCmsPage() {
  const [tab, setTab] = useState<"categories" | "members">("categories");
  return (
    <AdminLayout title="Team CMS">
      {() => (
        <div className="space-y-6">
          <Tabs active={tab} onChange={setTab} tabs={[["categories", "Team Categories"], ["members", "Team Members"]]} />
          {tab === "categories" ? <CmsModule {...configs.team} /> : <CmsModule {...configs["team-members"]} />}
        </div>
      )}
    </AdminLayout>
  );
}

export function AdminMediaCmsPage() {
  const [tab, setTab] = useState<"categories" | "posts">("categories");
  return (
    <AdminLayout title="Media & Outreach CMS">
      {() => (
        <div className="space-y-6">
          <Tabs active={tab} onChange={setTab} tabs={[["categories", "Media Categories"], ["posts", "Media Posts"]]} />
          {tab === "categories" ? <CmsModule {...configs["media-categories"]} /> : <CmsModule {...configs["media-posts"]} />}
        </div>
      )}
    </AdminLayout>
  );
}

export function AdminTractionCmsPage() {
  return (
    <AdminLayout title="Website Stats / Traction">
      {() => (
        <div className="space-y-8">
          <CmsModule {...configs["hero-stats"]} />
          <CmsModule {...configs.traction} />
        </div>
      )}
    </AdminLayout>
  );
}

function Tabs<T extends string>({ active, onChange, tabs }: { active: T; onChange: (tab: T) => void; tabs: Array<[T, string]> }) {
  return (
    <div className="inline-grid grid-cols-2 rounded-xl border border-border bg-card/50 p-1">
      {tabs.map(([value, label]) => (
        <button key={value} type="button" onClick={() => onChange(value)} className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${active === value ? "bg-gradient-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
          {label}
        </button>
      ))}
    </div>
  );
}
