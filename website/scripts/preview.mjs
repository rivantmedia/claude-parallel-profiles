/*
 * Serves the static export in out/ the way GitHub Pages will: mounted under
 * NEXT_PUBLIC_BASE_PATH (empty = site root), folders resolved to their
 * index.html, a redirect that adds the trailing slash, and out/404.html (with
 * a 404 status) for anything missing. No dependencies.
 *
 *   npm run preview                                   build, then serve at /
 *   NEXT_PUBLIC_BASE_PATH=/claude-parallel-profiles npm run preview
 *   PORT=4000 npm start                               serve the existing out/
 *
 * `npm start` must be given the same NEXT_PUBLIC_BASE_PATH the build had.
 */
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import http from "node:http";
import path from "node:path";

const root = path.resolve("out");
const base = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");
const port = Number(process.env.PORT ?? 4173);

/** @type {Record<string, string>} */
const TYPES = {
	".html": "text/html; charset=utf-8",
	".js": "text/javascript; charset=utf-8",
	".css": "text/css; charset=utf-8",
	".json": "application/json",
	".txt": "text/plain; charset=utf-8",
	".xml": "application/xml",
	".svg": "image/svg+xml",
	".png": "image/png",
	".jpg": "image/jpeg",
	".webp": "image/webp",
	".ico": "image/x-icon",
	".woff2": "font/woff2",
	".ttf": "font/ttf"
};

/** @param {string} file */
const kind = async (file) => {
	try {
		const info = await stat(file);
		return info.isDirectory() ? "dir" : "file";
	} catch {
		return null;
	}
};

/**
 * @param {import("node:http").ServerResponse} res
 * @param {string} file
 */
const send = (res, file, status = 200) => {
	res.writeHead(status, {
		"Content-Type": TYPES[path.extname(file)] ?? "application/octet-stream"
	});
	createReadStream(file).pipe(res);
};

/** @param {import("node:http").ServerResponse} res */
const notFound = async (res) => {
	const page = path.join(root, "404.html");
	if ((await kind(page)) === "file") return send(res, page, 404);
	res.writeHead(404, { "Content-Type": "text/plain" }).end("Not found");
};

http.createServer(async (req, res) => {
	try {
		await handle(req, res);
	} catch (error) {
		// A malformed address (a bad %-escape) is the client's mistake; answer
		// it rather than let the rejection take the server down.
		if (!res.headersSent)
			res.writeHead(error instanceof URIError ? 400 : 500, {
				"Content-Type": "text/plain"
			});
		res.end(error instanceof URIError ? "Bad request" : "Server error");
	}
}).listen(port, () => {
	console.log(`Serving out/ at http://localhost:${port}${base}/`);
});

/**
 * @param {import("node:http").IncomingMessage} req
 * @param {import("node:http").ServerResponse} res
 */
async function handle(req, res) {
	const url = new URL(req.url ?? "/", "http://localhost");
	const pathname = decodeURIComponent(url.pathname);

	if (base && (pathname === "/" || pathname === base)) {
		res.writeHead(301, { Location: `${base}/` }).end();
		return;
	}
	if (!pathname.startsWith(`${base}/`)) return notFound(res);

	const file = path.join(root, pathname.slice(base.length));
	// Inside out/ itself, not merely a sibling whose name starts with "out".
	if (file !== root && !file.startsWith(root + path.sep))
		return notFound(res);

	const found = await kind(file);
	if (found === "file") return send(res, file);
	if (found === "dir") {
		if (!pathname.endsWith("/")) {
			res.writeHead(301, { Location: `${pathname}/${url.search}` }).end();
			return;
		}
		const index = path.join(file, "index.html");
		if ((await kind(index)) === "file") return send(res, index);
	}
	return notFound(res);
}
