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
            <div className='min-h-screen bg-[#0d0d0d] flex items-center justify-center text-white/30 text-sm'>
                No file specified.
            </div>
        );
    }

    const copy = async () => {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className='min-h-screen bg-[#0d0d0d] text-white flex flex-col'>
            <main className='flex-1 flex flex-col items-center justify-center p-6'>
                <div className='w-full max-w-5xl space-y-3'>
                    <div className='w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center'>
                        {type === 'video' && (
                            <video
                                ref={videoRef}
                                src={mediaUrl}
                                controls
                                autoPlay
                                loop
                                playsInline
                                className='w-full max-h-[72vh] rounded-2xl'
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
                                className='max-h-[72vh] max-w-full object-contain rounded-2xl'
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
                            <div className='w-full p-16 flex flex-col items-center gap-6'>
                                <div className='w-20 h-20 rounded-full bg-white/5 flex items-center justify-center'>
                                    <svg
                                        width='28'
                                        height='28'
                                        viewBox='0 0 24 24'
                                        fill='none'
                                        stroke='currentColor'
                                        strokeWidth='1.5'
                                        className='text-white/40'
                                    >
                                        <path d='M9 18V5l12-2v13' />
                                        <circle cx='6' cy='18' r='3' />
                                        <circle cx='18' cy='16' r='3' />
                                    </svg>
                                </div>
                                <audio
                                    src={mediaUrl}
                                    controls
                                    className='w-full max-w-md'
                                />
                            </div>
                        )}
                        {type === 'unknown' && (
                            <div className='p-16 text-white/30 text-sm'>
                                Preview not available for this file type.
                            </div>
                        )}
                    </div>

                    {/* Info bar */}
                    <div className='w-full bg-white/5 rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between'>
                        <div className='min-w-0 space-y-1'>
                            <h1 className='font-semibold text-sm truncate'>
                                {filename}
                            </h1>
                            <div className='flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/35'>
                                {videoInfo && (
                                    <>
                                        <span>
                                            {videoInfo.width}×{videoInfo.height}
                                        </span>
                                        <span>·</span>
                                        <span>
                                            {fmt.duration(videoInfo.duration)}
                                        </span>
                                    </>
                                )}
                                {imgSize && (
                                    <span>
                                        {imgSize.w}×{imgSize.h}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className='flex items-center gap-2 shrink-0'>
                            <button
                                onClick={copy}
                                className='text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 transition-colors'
                            >
                                {copied ? '✓ Copied' : 'Copy link'}
                            </button>
                            <a
                                href={mediaUrl}
                                target='_blank'
                                rel='noreferrer'
                                className='text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 transition-colors'
                            >
                                Raw
                            </a>
                            <a
                                href={mediaUrl}
                                download={filename}
                                className='text-xs px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition-colors'
                            >
                                Download
                            </a>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
