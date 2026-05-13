/* eslint-env node */
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import crypto from "node:crypto";

const REQUIRED_FIELDS = ["name", "email", "organization", "interest_type", "message"];
const ALLOWED_INTERESTS = new Set([
  "Attend Events",
  "Sponsor Events",
  "Partner With Us",
  "Use SaaS Products",
  "College Collaboration",
  "Investor Discussion",
  "General Inquiry",
]);
const MAX_FIELD_LENGTH = 4000;
const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;
const rateLimit = new Map();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials:
    process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
      ? {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        }
      : undefined,
});

function send(res, statusCode, body) {
  res.status(statusCode).json(body);
}

function getIp(req) {
  const forwardedFor = req.headers["x-forwarded-for"];
  if (typeof forwardedFor === "string" && forwardedFor.length > 0) {
    return forwardedFor.split(",")[0]?.trim();
  }
  return req.socket?.remoteAddress;
}

function isRateLimited(ip) {
  const now = Date.now();
  const record = rateLimit.get(ip) ?? { count: 0, resetAt: now + WINDOW_MS };

  if (record.resetAt <= now) {
    record.count = 0;
    record.resetAt = now + WINDOW_MS;
  }

  record.count += 1;
  rateLimit.set(ip, record);
  return record.count > MAX_REQUESTS_PER_WINDOW;
}

function clean(value) {
  return typeof value === "string" ? value.trim().slice(0, MAX_FIELD_LENGTH) : "";
}

function safeEmailPart(email) {
  return email
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function validate(data) {
  const fields = {
    name: clean(data?.name),
    email: clean(data?.email),
    organization: clean(data?.organization),
    role: clean(data?.role),
    interest_type: clean(data?.interest_type),
    message: clean(data?.message),
  };

  const missing = REQUIRED_FIELDS.filter((field) => !fields[field]);
  if (missing.length > 0) {
    return { ok: false, error: "Missing required fields", missing };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    return { ok: false, error: "Invalid email" };
  }

  if (!ALLOWED_INTERESTS.has(fields.interest_type)) {
    return { ok: false, error: "Invalid interest type" };
  }

  return { ok: true, fields };
}

function getBody(req) {
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return undefined;
    }
  }

  return req.body;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return send(res, 405, { error: "Method not allowed" });
  }

  const ip = getIp(req) ?? "unknown";
  if (isRateLimited(ip)) {
    return send(res, 429, { error: "Too many requests" });
  }

  const body = getBody(req);

  if (typeof body?.company === "string" && body.company.trim() !== "") {
    return send(res, 400, { error: "Invalid submission" });
  }

  const validation = validate(body);
  if (!validation.ok) {
    return send(res, 400, validation);
  }

  const bucket = process.env.AWS_S3_BUCKET_NAME;
  if (!process.env.AWS_REGION || !bucket) {
    console.error("Missing AWS_REGION or AWS_S3_BUCKET_NAME");
    return send(res, 500, { error: "Server is not configured" });
  }

  const now = new Date();
  const id = crypto.randomUUID();
  const createdAt = now.toISOString();
  const year = String(now.getUTCFullYear());
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const day = String(now.getUTCDate()).padStart(2, "0");
  const prefix = (process.env.AWS_S3_PREFIX || "contact-leads").replace(/^\/+|\/+$/g, "");
  const emailPart = safeEmailPart(validation.fields.email) || id;
  const key = `${prefix}/${year}/${month}/${day}/${now.getTime()}-${emailPart}.json`;

  const payload = {
    id,
    name: validation.fields.name,
    email: validation.fields.email,
    organization: validation.fields.organization,
    role: validation.fields.role,
    interest_type: validation.fields.interest_type,
    message: validation.fields.message,
    source: "landing_page",
    created_at: createdAt,
    user_agent: req.headers["user-agent"] ?? "",
    ip,
  };

  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: JSON.stringify(payload, null, 2),
        ContentType: "application/json",
      }),
    );

    return send(res, 200, { ok: true, id });
  } catch (error) {
    console.error("S3 contact upload failed", error);
    return send(res, 500, { error: "Upload failed" });
  }
}
