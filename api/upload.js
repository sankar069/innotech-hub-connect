/* eslint-env node */
import { put } from "@vercel/blob";
import crypto from "node:crypto";

function send(res, statusCode, body) {
  res.status(statusCode).json(body);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return send(res, 405, { success: false, code: "METHOD_NOT_ALLOWED", message: "Method not allowed" });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("Missing BLOB_READ_WRITE_TOKEN environment variable");
    return send(res, 500, { 
      success: false, 
      code: "UPLOAD_CONFIG_MISSING", 
      message: "File storage is not configured. Please set BLOB_READ_WRITE_TOKEN environment variable." 
    });
  }

  const filename = req.headers["x-filename"] || `upload-${Date.now()}`;
  const contentType = req.headers["content-type"] || "application/octet-stream";
  
  // Basic validation
  if (!req.body || req.body.length === 0) {
    return send(res, 400, { success: false, code: "EMPTY_FILE", message: "No file content provided" });
  }

  try {
    const blob = await put(filename, req.body, {
      access: "public",
      contentType,
      addRandomSuffix: true,
    });

    return send(res, 200, { 
      success: true,
      url: blob.url,
      pathname: blob.pathname,
      contentType: blob.contentType,
      size: req.body.length
    });
  } catch (error) {
    console.error("Vercel Blob upload failed:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return send(res, 500, { 
      success: false, 
      code: "UPLOAD_FAILED", 
      message: `Upload failed: ${errorMessage}` 
    });
  }
}
