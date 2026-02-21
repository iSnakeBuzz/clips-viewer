import { useState, useRef } from 'react';

interface VideoInfo {
    duration: number;
    width: number;
    height: number;
}

const fmt = {
    duration(s: number) {
        const m = Math.floor(s / 60);
        const sec = Math.floor(s % 60);
        return `${m}:${String(sec).padStart(2, '0')}`;
    },
};

function getType(filename: string): 'video' | 'image' | 'audio' | 'unknown' {
    const ext = filename.split('.').pop()?.toLowerCase() ?? '';
    if (['mp4', 'mkv', 'webm', 'mov', 'avi'].includes(ext)) return 'video';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif'].includes(ext))
        return 'image';
    if (['mp3', 'ogg', 'wav', 'flac', 'm4a'].includes(ext)) return 'audio';
    return 'unknown';
}

// ── Icons ──────────────────────────────────────────────────────────────────
const CopyIcon = () => (
    <svg
        width='12'
        height='12'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
    >
        <rect x='9' y='9' width='13' height='13' rx='2' ry='2' />
        <path d='M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1' />
    </svg>
);
const CheckIcon = () => (
    <svg
        width='12'
        height='12'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2.5'
        strokeLinecap='round'
        strokeLinejoin='round'
    >
        <polyline points='20 6 9 17 4 12' />
    </svg>
);
const ExternalIcon = () => (
    <svg
        width='12'
        height='12'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
    >
        <path d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' />
        <polyline points='15 3 21 3 21 9' />
        <line x1='10' y1='14' x2='21' y2='3' />
    </svg>
);
const DownloadIcon = () => (
    <svg
        width='12'
        height='12'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2.5'
        strokeLinecap='round'
        strokeLinejoin='round'
    >
        <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
        <polyline points='7 10 12 15 17 10' />
        <line x1='12' y1='15' x2='12' y2='3' />
    </svg>
);
const MusicIcon = () => (
    <svg
        width='20'
        height='20'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
        className='text-white/25'
    >
        <path d='M9 18V5l12-2v13' />
        <circle cx='6' cy='18' r='3' />
        <circle cx='18' cy='16' r='3' />
    </svg>
);

// ── MediaPreview ───────────────────────────────────────────────────────────
export default function MediaPreview() {
    const path = window.location.pathname.replace(/^\//, '');
    const mediaUrl = `https://i.snake.rip/${path}`;
    const filename = path.split('/').pop() ?? path;
    const type = getType(filename);

    const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
    const [imgSize, setImgSize] = useState<{ w: number; h: number } | null>(
        null,
    );
    const [copied, setCopied] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    if (!path) {
        return (
            <div className='min-h-screen bg-[#0d0d0d] flex items-center justify-center text-white/20 text-xs tracking-widest uppercase'>
                No file specified.
            </div>
        );
    }

    const copy = async () => {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Single meta string — only rendered when data is available
    const metaParts = [
        videoInfo && `${videoInfo.width}×${videoInfo.height}`,
        videoInfo && fmt.duration(videoInfo.duration),
        imgSize && `${imgSize.w}×${imgSize.h}`,
    ].filter(Boolean);

    return (
        <div className='min-h-screen bg-[#0d0d0d] text-white flex flex-col'>
            {/* ── Media ── */}
            <main className='flex-1 flex items-center justify-center p-6 pb-3'>
                {type === 'video' && (
                    <video
                        ref={videoRef}
                        src={mediaUrl}
                        controls
                        autoPlay
                        loop
                        playsInline
                        className='max-h-[80vh] max-w-full rounded-lg'
                        onLoadedMetadata={() => {
                            const v = videoRef.current;
                            if (v)
                                setVideoInfo({
                                    duration: v.duration,
                                    width: v.videoWidth,
                                    height: v.videoHeight,
                                });
                        }}
                    />
                )}

                {type === 'image' && (
                    <img
                        src={mediaUrl}
                        alt={filename}
                        className='max-h-[80vh] max-w-full object-contain rounded-lg'
                        onLoad={(e) => {
                            const img = e.currentTarget;
                            setImgSize({
                                w: img.naturalWidth,
                                h: img.naturalHeight,
                            });
                        }}
                    />
                )}

                {type === 'audio' && (
                    <div className='flex flex-col items-center gap-6'>
                        <div className='w-14 h-14 rounded-2xl border border-white/[0.07] bg-white/3 flex items-center justify-center'>
                            <MusicIcon />
                        </div>
                        <audio
                            src={mediaUrl}
                            controls
                            className='w-72 opacity-60'
                        />
                    </div>
                )}

                {type === 'unknown' && (
                    <p className='text-white/20 text-xs tracking-widest uppercase'>
                        Preview unavailable.
                    </p>
                )}
            </main>

            {/* ── Bottom bar ── */}
            <footer className='border-t border-white/6 px-5 py-3 flex items-center gap-4'>
                {/* File info */}
                <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium text-white/75 truncate leading-snug'>
                        {filename}
                    </p>
                    {metaParts.length > 0 && (
                        <p className='text-[11px] text-white/25 mt-0.5 tracking-wide'>
                            {metaParts.join('  ·  ')}
                        </p>
                    )}
                </div>

                {/* Actions */}
                <div className='flex items-center gap-0.5 shrink-0'>
                    <button
                        onClick={copy}
                        title='Copy link'
                        className={`flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1.5 rounded-md transition-all duration-150 cursor-pointer ${
                            copied
                                ? 'text-emerald-400 bg-emerald-400/10'
                                : 'text-white/35 hover:text-white/65 hover:bg-white/6'
                        }`}
                    >
                        {copied ? <CheckIcon /> : <CopyIcon />}
                        {copied ? 'Copied' : 'Copy'}
                    </button>

                    <a
                        href={mediaUrl}
                        target='_blank'
                        rel='noreferrer'
                        title='Open raw file'
                        className='flex items-center gap-1.5 text-[11px] font-medium text-white/35 hover:text-white/65 hover:bg-white/6 px-2.5 py-1.5 rounded-md transition-all duration-150'
                    >
                        <ExternalIcon />
                        Raw
                    </a>

                    <a
                        href={mediaUrl}
                        download={filename}
                        title='Download'
                        className='flex items-center gap-1.5 text-[11px] font-semibold text-white bg-indigo-500 hover:bg-indigo-400 px-2.5 py-1.5 rounded-md transition-all duration-150 ml-1'
                    >
                        <DownloadIcon />
                        Download
                    </a>
                </div>
            </footer>
        </div>
    );
}
