interface Env {
    ASSETS: Fetcher;
}

// ── Bots ──────────────────────────────────────────────────────────────────────

const BOTS = [
    'discordbot',
    'twitterbot',
    'facebookexternalhit',
    'linkedinbot',
    'slackbot',
    'telegrambot',
    'whatsapp',
    'iframely',
    'embedly',
    'unfurler',
];
const isBot = (ua: string) => BOTS.some((b) => ua.toLowerCase().includes(b));

// ── Media types ───────────────────────────────────────────────────────────────

const EXT_TYPE: Record<string, 'video' | 'image' | 'audio'> = {
    mp4: 'video',
    mkv: 'video',
    webm: 'video',
    mov: 'video',
    avi: 'video',
    jpg: 'image',
    jpeg: 'image',
    png: 'image',
    gif: 'image',
    webp: 'image',
    avif: 'image',
    mp3: 'audio',
    ogg: 'audio',
    wav: 'audio',
    flac: 'audio',
    m4a: 'audio',
};
const EXT_MIME: Record<string, string> = {
    mp4: 'video/mp4',
    mkv: 'video/x-matroska',
    webm: 'video/webm',
    mov: 'video/mp4',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    mp3: 'audio/mpeg',
    ogg: 'audio/ogg',
    wav: 'audio/wav',
    flac: 'audio/flac',
    m4a: 'audio/mp4',
};

function getExt(filename: string) {
    return filename.split('.').pop()?.toLowerCase() ?? '';
}
function esc(s: string) {
    return s
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;');
}

// ── OG HTML ───────────────────────────────────────────────────────────────────

function buildOGResponse(pageUrl: string, filename: string): Response {
    const ext = getExt(filename);
    const type = EXT_TYPE[ext];
    const mime = EXT_MIME[ext] ?? 'application/octet-stream';
    const mediaUrl = `https://i.snake.rip${new URL(pageUrl).pathname}`;

    const safeName = esc(filename);
    const safeMedia = esc(mediaUrl);
    const safePage = esc(pageUrl);
    const safeMime = esc(mime);

    const siteTitle = 'Snake Media Share';
    const siteDescription = 'Preview of the media shared by Snake <3';
    const siteLogo = 'https://snake.rip/favicon.svg';

    const metas = {
        video: `
  <meta property="og:type"             content="video.other" />
  <meta property="og:video"            content="${safeMedia}" />
  <meta property="og:video:secure_url" content="${safeMedia}" />
  <meta property="og:video:type"       content="${safeMime}" />
  <meta property="og:video:width"      content="1280" />
  <meta property="og:video:height"     content="720" />
  <meta property="og:image"            content="${safeMedia}" />
  <meta name="twitter:card"            content="player" />
  <meta name="twitter:player"          content="${safePage}" />
  <meta name="twitter:player:width"    content="1280" />
  <meta name="twitter:player:height"   content="720" />
  <meta property="og:image:alt"        content="${safeName}" />`,

        image: `
  <meta property="og:type"              content="website" />
  <meta property="og:image"            content="${safeMedia}" />
  <meta property="og:image:secure_url" content="${safeMedia}" />
  <meta property="og:image:alt"        content="${safeName}" />
  <meta name="twitter:card"            content="summary_large_image" />
  <meta name="twitter:image"           content="${safeMedia}" />`,

        audio: `
  <meta property="og:type"             content="music.song" />
  <meta property="og:audio"            content="${safeMedia}" />
  <meta property="og:audio:type"       content="${safeMime}" />
  <meta property="og:image"            content="${siteLogo}" />
  <meta property="og:image:alt"        content="${siteTitle} logo" />
  <meta name="twitter:card"            content="summary" />
  <meta name="twitter:image"           content="${siteLogo}" />`,
    };

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${safeName} — ${siteTitle}</title>
  <meta name="description"        content="${siteDescription}" />
  <link rel="icon"                href="${siteLogo}" type="image/svg+xml" />
  <meta property="og:title"       content="${safeName}" />
  <meta property="og:description" content="${siteDescription}" />
  <meta property="og:url"         content="${safePage}" />
  <meta property="og:site_name"   content="${siteTitle}" />
  <meta name="twitter:title"      content="${safeName}" />
  <meta name="twitter:description"content="${siteDescription}" />
  ${
      type
          ? metas[type]
          : `
  <meta property="og:type"            content="website" />
  <meta property="og:image"           content="${siteLogo}" />
  <meta property="og:image:alt"       content="${siteTitle} logo" />
  <meta name="twitter:card"           content="summary" />
  <meta name="twitter:image"          content="${siteLogo}" />`
  }
</head>
<body>
  <script>window.location.replace("${safePage}")</script>
  <a href="${safePage}">${safeName}</a>
</body>
</html>`;

    return new Response(html, {
        headers: {
            'Content-Type': 'text/html;charset=UTF-8',
            'Cache-Control': 'public, max-age=60',
        },
    });
}

// ── Handler ───────────────────────────────────────────────────────────────────

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        const url = new URL(request.url);
        const filename = url.pathname.split('/').pop() ?? '';
        const ext = getExt(filename);
        const ua = request.headers.get('user-agent') ?? '';

        // Bot solicitando un archivo de media → OG HTML para el embed
        if (ext in EXT_TYPE && isBot(ua)) {
            return buildOGResponse(request.url, filename);
        }

        // Servir asset estático (el SPA React en todos los demás casos)
        const asset = await env.ASSETS.fetch(request);

        // Si el asset no existe, retornar el index.html del SPA
        if (asset.status === 404) {
            return env.ASSETS.fetch(
                new Request(new URL('/index.html', url.origin)),
            );
        }

        return asset;
    },
} satisfies ExportedHandler<Env>;
