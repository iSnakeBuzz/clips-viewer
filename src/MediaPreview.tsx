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
            <main className='relative flex-1 flex items-center justify-center p-6 pb-20 md:pb-24'>
                {/* Floating info/action pod */}
                <div className='pointer-events-none absolute inset-x-0 bottom-4 flex justify-center md:bottom-6'>
                    <div className='pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl bg-[rgba(255,255,255,0.06)] backdrop-blur-xl border border-white/10 shadow-[0_18px_40px_rgba(0,0,0,0.45)] max-w-3xl w-[90%] md:w-auto md:px-5 md:py-4'>
                        <div className='min-w-0'>
                            <p className='text-sm font-semibold text-white/90 truncate'>
                                {filename}
                            </p>
                            {metaParts.length > 0 && (
                                <p className='text-[11px] text-white/50 mt-0.5 tracking-wide truncate'>
                                    {metaParts.join('  ·  ')}
                                </p>
                            )}
                        </div>

                        <div className='flex-1' />

                        <div className='flex items-center gap-2'>
                            <button
                                onClick={copy}
                                title='Copy link'
                                className={`flex items-center gap-1.5 text-[11px] font-medium px-3 py-2 rounded-xl transition-all duration-150 border border-white/10 bg-white/5 hover:bg-white/10 ${
                                    copied
                                        ? 'text-emerald-300 border-emerald-400/40'
                                        : 'text-white/75'
                                }`}
                            >
                                {copied ? <CheckIcon /> : <CopyIcon />}
                                {copied ? 'Copied' : 'Copy'}
                            </button>

                            <a
                                href={mediaUrl}
                                download={filename}
                                title='Download'
                                className='flex items-center gap-1.5 text-[11px] font-semibold text-[#0d0d0d] bg-white hover:bg-white/90 px-3 py-2 rounded-xl transition-all duration-150 shadow-lg shadow-black/15 border border-white/20'
                            >
                                <DownloadIcon />
                                Download
                            </a>
                        </div>
                    </div>
                </div>

                {type === 'video' && (
                    <VideoPlayer src={mediaUrl} onMetadata={setVideoInfo} />
                )}

                {type === 'image' && (
                    <img
                        src={mediaUrl}
                        alt={filename}
                        className='max-h-[70vh] max-w-full object-contain rounded-xl shadow-[0_20px_55px_rgba(0,0,0,0.38)]'
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
        </div>
    );
}
