import { useState } from 'react';
import { AudioPlayer } from './components/AudioPlayer';
import {
    CopyIcon,
    DownloadIcon,
    ExternalIcon,
    CheckIcon,
} from './components/Icons';
import { VideoPlayer } from './components/VideoPlayer';
import { formatDuration } from './utils/format';
import { getType } from './utils/getType';
import type { VideoInfo } from './types/media';

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

    const metaParts = [
        videoInfo && `${videoInfo.width}×${videoInfo.height}`,
        videoInfo && formatDuration(videoInfo.duration),
        imgSize && `${imgSize.w}×${imgSize.h}`,
    ].filter(Boolean);

    return (
        <div className='min-h-screen bg-[#0d0d0d] text-white flex flex-col'>
            {/* ── Media ── */}
            <main className='flex-1 flex items-center justify-center p-6 pb-3'>
                {type === 'video' && (
                    <VideoPlayer src={mediaUrl} onMetadata={setVideoInfo} />
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

                {type === 'audio' && <AudioPlayer src={mediaUrl} />}

                {type === 'unknown' && (
                    <p className='text-white/20 text-xs tracking-widest uppercase'>
                        Preview unavailable.
                    </p>
                )}
            </main>

            {/* ── Bottom bar ── */}
            <footer className='border-t border-white/6 px-5 py-3 flex items-center gap-4'>
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
                        className='flex items-center gap-1.5 text-[11px] font-medium text-white/35 hover:text-white/65 hover:bg-white/6 px-2.5 py-1.5 rounded-md transition-all duration-150 cursor-pointer'
                    >
                        <ExternalIcon />
                        Raw
                    </a>

                    <a
                        href={mediaUrl}
                        download={filename}
                        title='Download'
                        className='flex items-center gap-1.5 text-[11px] font-semibold text-white bg-indigo-500 hover:bg-indigo-400 px-2.5 py-1.5 rounded-md transition-all duration-150 ml-1 cursor-pointer'
                    >
                        <DownloadIcon />
                        Download
                    </a>
                </div>
            </footer>
        </div>
    );
}
