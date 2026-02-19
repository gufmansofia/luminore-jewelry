import { serve } from "bun";
import index from "./index.html";
import { join } from "path";

// MIME type lookup
const mimeTypes: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.pdf': 'application/pdf',
  '.mp4': 'video/mp4',
  '.glb': 'model/gltf-binary',
  '.usdz': 'model/vnd.usdz+zip',
};

function getMimeType(path: string): string {
  const ext = path.substring(path.lastIndexOf('.')).toLowerCase();
  return mimeTypes[ext] || 'application/octet-stream';
}

// Generic static file handler for public folder
async function serveStatic(pathname: string): Promise<Response | null> {
  const decodedPath = decodeURIComponent(pathname);
  const filePath = join(process.cwd(), "public", decodedPath);

  let file = Bun.file(filePath);

  if (await file.exists()) {
    return new Response(file, {
      headers: {
        "Content-Type": getMimeType(filePath),
        "Cache-Control": "public, max-age=3600",
      },
    });
  }

  // Fallback: try .jpg if .png was requested (handles .jpg.png double extension issue)
  if (filePath.endsWith('.png')) {
    const jpgPath = filePath.replace(/\.png$/, '.jpg');
    file = Bun.file(jpgPath);
    if (await file.exists()) {
      return new Response(file, {
        headers: {
          "Content-Type": "image/jpeg",
          "Cache-Control": "public, max-age=3600",
        },
      });
    }
  }

  return null;
}

const server = serve({
  routes: {
    // Serve product images from public/Products folder
    "/Products/*": async (req) => {
      const pathname = new URL(req.url).pathname;
      const response = await serveStatic(pathname);
      return response || new Response("Not found", { status: 404 });
    },

    // Serve 3D model files
    "/models/*": async (req) => {
      const pathname = new URL(req.url).pathname;
      const response = await serveStatic(pathname);
      return response || new Response("Not found", { status: 404 });
    },

    // Serve blog images from public/blog-images/ folder
    "/blog-images/*": async (req) => {
      const pathname = new URL(req.url).pathname;
      const response = await serveStatic(pathname);
      return response || new Response("Not found", { status: 404 });
    },

    // Serve root-level static assets (exact paths)
    "/hero-bg.png": async () => await serveStatic("/hero-bg.png") || new Response("Not found", { status: 404 }),
    "/hero-mobile.png": async () => await serveStatic("/hero-mobile.png") || new Response("Not found", { status: 404 }),
    "/logo-hero.svg": async () => await serveStatic("/logo-hero.svg") || new Response("Not found", { status: 404 }),

    // Video: must support HTTP range requests for browser streaming
    "/hero-video.mp4": async (req) => {
      const { join } = await import("path");
      const filePath = join(process.cwd(), "public", "hero-video.mp4");
      const file = Bun.file(filePath);
      if (!await file.exists()) return new Response("Not found", { status: 404 });

      const fileSize = file.size;
      const range = req.headers.get("range");

      if (range) {
        const [startStr, endStr] = range.replace(/bytes=/, "").split("-");
        const start = parseInt(startStr, 10);
        const end = endStr ? parseInt(endStr, 10) : fileSize - 1;
        return new Response(file.slice(start, end + 1), {
          status: 206,
          headers: {
            "Content-Type": "video/mp4",
            "Content-Range": `bytes ${start}-${end}/${fileSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": String(end - start + 1),
          },
        });
      }

      return new Response(file, {
        headers: {
          "Content-Type": "video/mp4",
          "Accept-Ranges": "bytes",
          "Content-Length": String(fileSize),
          "Cache-Control": "public, max-age=3600",
        },
      });
    },
    "/hero.jpg": async () => await serveStatic("/hero.jpg") || new Response("Not found", { status: 404 }),
    "/Hero2.jpg": async () => await serveStatic("/Hero2.jpg") || new Response("Not found", { status: 404 }),
    "/logo-full.png": async () => await serveStatic("/logo-full.png") || new Response("Not found", { status: 404 }),
    "/logo.png": async () => await serveStatic("/logo.png") || new Response("Not found", { status: 404 }),

    // Serve index.html for all unmatched routes - catch-all LAST
    // Must be a direct HTMLBundle value (not returned from async fn) for Bun to bundle it
    "/*": index,
  },

  development: process.env.NODE_ENV !== "production",
});

console.log(`🚀 Server running at ${server.url}`);
