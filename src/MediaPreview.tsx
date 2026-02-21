import { useState, useRef, useCallback, useEffect } from 'react';

interface VideoInfo {
    duration: number;
    width: number;
    height: number;
}

const fmt = {
    duration(s: number) {
        if (!s || isNaN(s)) return '0:00';
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
const PlayIcon = () => (
    <svg width='13' height='13' viewBox='0 0 24 24' fill='currentColor'>
        <polygon points='5 3 19 12 5 21 5 3' />
    </svg>
);
const PauseIcon = () => (
    <svg width='13' height='13' viewBox='0 0 24 24' fill='currentColor'>
        <rect x='6' y='4' width='4' height='16' rx='1' />
        <rect x='14' y='4' width='4' height='16' rx='1' />
    </svg>
);
const MusicNoteIcon = () => (
    <svg
        width='28'
        height='28'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
        className='text-white/20'
    >
        <path d='M9 18V5l12-2v13' />
        <circle cx='6' cy='18' r='3' />
        <circle cx='18' cy='16' r='3' />
    </svg>
);
const VolumeIcon = ({ level, muted }: { level: number; muted: boolean }) => {
    if (muted || level === 0)
        return (
            <svg
                width='14'
                height='14'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
            >
                <polygon points='11 5 6 9 2 9 2 15 6 15 11 19 11 5' />
                <line x1='23' y1='9' x2='17' y2='15' />
                <line x1='17' y1='9' x2='23' y2='15' />
            </svg>
        );
    if (level > 0.5)
        return (
            <svg
                width='14'
                height='14'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
            >
                <polygon points='11 5 6 9 2 9 2 15 6 15 11 19 11 5' />
                <path d='M19.07 4.93a10 10 0 0 1 0 14.14' />
                <path d='M15.54 8.46a5 5 0 0 1 0 7.07' />
            </svg>
        );
    return (
        <svg
            width='14'
            height='14'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
        >
            <polygon points='11 5 6 9 2 9 2 15 6 15 11 19 11 5' />
            <path d='M15.54 8.46a5 5 0 0 1 0 7.07' />
        </svg>
    );
};
const FullscreenIcon = () => (
    <svg
        width='13'
        height='13'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
    >
        <polyline points='15 3 21 3 21 9' />
        <polyline points='9 21 3 21 3 15' />
        <line x1='21' y1='3' x2='14' y2='10' />
        <line x1='3' y1='21' x2='10' y2='14' />
    </svg>
);
const ExitFullscreenIcon = () => (
    <svg
        width='13'
        height='13'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
    >
        <polyline points='4 14 10 14 10 20' />
        <polyline points='20 10 14 10 14 4' />
        <line x1='10' y1='14' x2='3' y2='21' />
        <line x1='21' y1='3' x2='14' y2='10' />
    </svg>
);

// ── Progress Bar ───────────────────────────────────────────────────────────

function ProgressBar({
    current,
    duration,
    onSeek,
}: {
    current: number;
    duration: number;
    onSeek: (t: number) => void;
}) {
    const barRef = useRef<HTMLDivElement>(null);
    const [hovered, setHovered] = useState(false);
    const [hoverX, setHoverX] = useState(0);
    const [hoverTime, setHoverTime] = useState(0);

    const pct = duration > 0 ? (current / duration) * 100 : 0;

    const getTime = (clientX: number) => {
        const bar = barRef.current;
        if (!bar || !duration) return 0;
        const rect = bar.getBoundingClientRect();
        return (
            Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)) *
            duration
        );
    };

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        e.preventDefault();
        onSeek(getTime(e.clientX));
        const onMove = (ev: PointerEvent) => {
            ev.preventDefault();
            onSeek(getTime(ev.clientX));
        };
        const onUp = () => {
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerup', onUp);
        };
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
    };

    return (
        <div
            ref={barRef}
            className='relative flex-1 flex items-center cursor-pointer select-none group'
            style={{ paddingBlock: 8 }}
            onPointerDown={handlePointerDown}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onMouseMove={(e) => {
                const bar = barRef.current;
                if (!bar) return;
                const rect = bar.getBoundingClientRect();
                const x = Math.max(
                    0,
                    Math.min(1, (e.clientX - rect.left) / rect.width),
                );
                setHoverX(x * 100);
                setHoverTime(x * duration);
            }}
        >
            {/* Track */}
            <div
                className='w-full rounded-full overflow-hidden'
                style={{
                    height: hovered ? 4 : 3,
                    background: 'rgba(255,255,255,0.15)',
                    transition: 'height 0.15s ease',
                }}
            >
                <div
                    className='h-full bg-indigo-500 rounded-full transition-none'
                    style={{ width: `${pct}%` }}
                />
            </div>

            {/* Scrubber dot */}
            <div
                className='absolute w-[11px] h-[11px] rounded-full bg-white pointer-events-none'
                style={{
                    left: `${pct}%`,
                    transform: 'translateX(-50%)',
                    opacity: hovered ? 1 : 0,
                    transition: 'opacity 0.15s ease',
                    boxShadow: '0 0 0 3px rgba(99,102,241,0.3)',
                }}
            />

            {/* Time tooltip */}
            {hovered && duration > 0 && (
                <div
                    className='absolute -top-8 bg-[#1c1c1c] border border-white/8 text-white/80 text-[10px] font-medium px-1.5 py-[3px] rounded pointer-events-none whitespace-nowrap shadow-xl'
                    style={{
                        left: `${hoverX}%`,
                        transform: 'translateX(-50%)',
                    }}
                >
                    {fmt.duration(hoverTime)}
                </div>
            )}
        </div>
    );
}

// ── Volume Control ─────────────────────────────────────────────────────────

function VolumeControl({
    volume,
    muted,
    onToggleMute,
    onVolumeChange,
}: {
    volume: number;
    muted: boolean;
    onToggleMute: () => void;
    onVolumeChange: (v: number) => void;
}) {
    const [show, setShow] = useState(false);
    const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

    const reveal = () => {
        clearTimeout(timer.current);
        setShow(true);
    };
    const conceal = () => {
        timer.current = setTimeout(() => setShow(false), 250);
    };

    const handleSlider = (e: React.PointerEvent<HTMLDivElement>) => {
        e.preventDefault();
        const bar = e.currentTarget;
        const get = (ev: { clientX: number }) => {
            const r = bar.getBoundingClientRect();
            return Math.max(0, Math.min(1, (ev.clientX - r.left) / r.width));
        };
        onVolumeChange(get(e));
        const mv = (ev: PointerEvent) => onVolumeChange(get(ev));
        const up = () => {
            window.removeEventListener('pointermove', mv);
            window.removeEventListener('pointerup', up);
        };
        window.addEventListener('pointermove', mv);
        window.addEventListener('pointerup', up);
    };

    const display = muted ? 0 : volume;

    return (
        <div
            className='flex items-center gap-1'
            onMouseEnter={reveal}
            onMouseLeave={conceal}
        >
            <button
                onClick={onToggleMute}
                className='text-white/60 hover:text-white transition-colors duration-150 flex items-center p-1 cursor-pointer'
            >
                <VolumeIcon level={volume} muted={muted} />
            </button>

            <div
                className='overflow-hidden transition-all duration-200 ease-out'
                style={{ width: show ? 52 : 0, opacity: show ? 1 : 0 }}
            >
                <div
                    className='w-[52px] flex items-center py-2 cursor-pointer'
                    onPointerDown={handleSlider}
                >
                    <div
                        className='w-full h-[3px] rounded-full relative'
                        style={{ background: 'rgba(255,255,255,0.2)' }}
                    >
                        <div
                            className='h-full rounded-full'
                            style={{
                                width: `${display * 100}%`,
                                background: 'rgba(255,255,255,0.8)',
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Video Player ───────────────────────────────────────────────────────────

function VideoPlayer({
    src,
    onMetadata,
}: {
    src: string;
    onMetadata: (info: VideoInfo) => void;
}) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [playing, setPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [muted, setMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [controlsVisible, setControlsVisible] = useState(true);

    const hideTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

    const scheduleHide = useCallback(() => {
        clearTimeout(hideTimer.current);
        hideTimer.current = setTimeout(() => setControlsVisible(false), 2800);
    }, []);

    const showControls = useCallback(() => {
        setControlsVisible(true);
        if (playing) scheduleHide();
    }, [playing, scheduleHide]);

    useEffect(() => {
        if (playing) {
            scheduleHide();
        } else {
            clearTimeout(hideTimer.current);
            setControlsVisible(true);
        }
        return () => clearTimeout(hideTimer.current);
    }, [playing, scheduleHide]);

    useEffect(() => {
        const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', onFsChange);
        return () =>
            document.removeEventListener('fullscreenchange', onFsChange);
    }, []);

    const togglePlay = useCallback(() => {
        const v = videoRef.current;
        if (!v) return;
        v.paused ? v.play() : v.pause();
    }, []);

    const handleSeek = useCallback((t: number) => {
        const v = videoRef.current;
        if (v) v.currentTime = t;
    }, []);

    const handleVolumeChange = useCallback((vol: number) => {
        const v = videoRef.current;
        if (!v) return;
        v.volume = vol;
        setVolume(vol);
        if (vol > 0) {
            v.muted = false;
            setMuted(false);
        }
    }, []);

    const toggleMute = useCallback(() => {
        const v = videoRef.current;
        if (!v) return;
        v.muted = !v.muted;
        setMuted(v.muted);
    }, []);

    const toggleFullscreen = useCallback(() => {
        const c = containerRef.current;
        if (!c) return;
        document.fullscreenElement
            ? document.exitFullscreen()
            : c.requestFullscreen();
    }, []);

    return (
        <div
            ref={containerRef}
            className='relative overflow-hidden bg-black rounded-xl group'
            style={{ cursor: controlsVisible ? 'default' : 'none' }}
            onMouseMove={showControls}
            onMouseEnter={showControls}
            onMouseLeave={() => playing && setControlsVisible(false)}
        >
            <video
                ref={videoRef}
                src={src}
                autoPlay
                loop
                playsInline
                className='block max-w-full cursor-pointer'
                style={{ maxHeight: isFullscreen ? '100vh' : '80vh' }}
                onClick={togglePlay}
                onLoadedMetadata={() => {
                    const v = videoRef.current;
                    if (!v) return;
                    setDuration(v.duration);
                    onMetadata({
                        duration: v.duration,
                        width: v.videoWidth,
                        height: v.videoHeight,
                    });
                }}
                onTimeUpdate={() => {
                    const v = videoRef.current;
                    if (v) setCurrentTime(v.currentTime);
                }}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
            />

            {/* Blurred Controls Pill */}
            <div
                className='absolute inset-x-3 bottom-3 md:inset-x-5 md:bottom-5 flex flex-col gap-1.5 px-4 py-2.5 bg-black/50 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl'
                style={{
                    opacity: controlsVisible ? 1 : 0,
                    transition: 'opacity 0.3s ease, transform 0.3s ease',
                    transform: controlsVisible
                        ? 'translateY(0)'
                        : 'translateY(8px)',
                    pointerEvents: controlsVisible ? 'auto' : 'none',
                }}
            >
                <ProgressBar
                    current={currentTime}
                    duration={duration}
                    onSeek={handleSeek}
                />

                <div className='flex items-center gap-2'>
                    {/* Play / Pause */}
                    <button
                        onClick={togglePlay}
                        className='flex items-center justify-center w-7 h-7 text-white/80 hover:text-white transition-colors duration-150 cursor-pointer'
                    >
                        {playing ? <PauseIcon /> : <PlayIcon />}
                    </button>

                    {/* Time */}
                    <span className='text-[11px] text-white/60 tabular-nums font-medium'>
                        {fmt.duration(currentTime)}
                        <span className='text-white/20 mx-1'>/</span>
                        {fmt.duration(duration)}
                    </span>

                    <div className='flex-1' />

                    <VolumeControl
                        volume={volume}
                        muted={muted}
                        onToggleMute={toggleMute}
                        onVolumeChange={handleVolumeChange}
                    />

                    {/* Fullscreen */}
                    <button
                        onClick={toggleFullscreen}
                        className='flex items-center justify-center p-1.5 text-white/60 hover:text-white transition-colors duration-150 cursor-pointer'
                    >
                        {isFullscreen ? (
                            <ExitFullscreenIcon />
                        ) : (
                            <FullscreenIcon />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Audio Player ───────────────────────────────────────────────────────────

function AudioPlayer({ src }: { src: string }) {
    const audioRef = useRef<HTMLAudioElement>(null);

    const [playing, setPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [muted, setMuted] = useState(false);

    const togglePlay = useCallback(() => {
        const a = audioRef.current;
        if (!a) return;
        a.paused ? a.play() : a.pause();
    }, []);

    const handleSeek = useCallback((t: number) => {
        const a = audioRef.current;
        if (a) a.currentTime = t;
    }, []);

    const handleVolumeChange = useCallback((vol: number) => {
        const a = audioRef.current;
        if (!a) return;
        a.volume = vol;
        setVolume(vol);
        if (vol > 0) {
            a.muted = false;
            setMuted(false);
        }
    }, []);

    const toggleMute = useCallback(() => {
        const a = audioRef.current;
        if (!a) return;
        a.muted = !a.muted;
        setMuted(a.muted);
    }, []);

    return (
        <div className='flex flex-col items-center gap-7 w-full max-w-xs'>
            {/* Art placeholder */}
            <div className='w-28 h-28 rounded-2xl border border-white/7 bg-white/2.5 flex items-center justify-center'>
                <MusicNoteIcon />
            </div>

            <audio
                ref={audioRef}
                src={src}
                onLoadedMetadata={() => {
                    const a = audioRef.current;
                    if (a) setDuration(a.duration);
                }}
                onTimeUpdate={() => {
                    const a = audioRef.current;
                    if (a) setCurrentTime(a.currentTime);
                }}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
            />

            {/* Controls */}
            <div className='w-full flex flex-col gap-3.5'>
                <ProgressBar
                    current={currentTime}
                    duration={duration}
                    onSeek={handleSeek}
                />

                <div className='flex items-center gap-3'>
                    {/* Play button — indigo accent */}
                    <button
                        onClick={togglePlay}
                        className='w-8 h-8 rounded-full bg-indigo-500 hover:bg-indigo-400 flex items-center justify-center text-white transition-colors duration-150 shrink-0 pl-0.5 cursor-pointer'
                    >
                        {playing ? <PauseIcon /> : <PlayIcon />}
                    </button>

                    {/* Current time */}
                    <span className='text-[11px] text-white/50 tabular-nums font-medium'>
                        {fmt.duration(currentTime)}
                    </span>

                    <div className='flex-1' />

                    {/* Total time */}
                    <span className='text-[11px] text-white/30 tabular-nums'>
                        {fmt.duration(duration)}
                    </span>

                    <VolumeControl
                        volume={volume}
                        muted={muted}
                        onToggleMute={toggleMute}
                        onVolumeChange={handleVolumeChange}
                    />
                </div>
            </div>
        </div>
    );
}

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
        videoInfo && fmt.duration(videoInfo.duration),
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
