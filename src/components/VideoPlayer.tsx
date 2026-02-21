import { useCallback, useEffect, useRef, useState } from 'react';
import { formatDuration } from '../utils/format';
import type { VideoInfo } from '../types/media';
import {
    ExitFullscreenIcon,
    FullscreenIcon,
    PauseIcon,
    PlayIcon,
} from './Icons';
import { ProgressBar } from './ProgressBar';
import { VolumeControl } from './VolumeControl';

interface VideoPlayerProps {
    src: string;
    onMetadata: (info: VideoInfo) => void;
}

export function VideoPlayer({ src, onMetadata }: VideoPlayerProps) {
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
                    <button
                        onClick={togglePlay}
                        className='flex items-center justify-center w-7 h-7 text-white/80 hover:text-white transition-colors duration-150 cursor-pointer'
                    >
                        {playing ? <PauseIcon /> : <PlayIcon />}
                    </button>

                    <span className='text-[11px] text-white/60 tabular-nums font-medium'>
                        {formatDuration(currentTime)}
                        <span className='text-white/20 mx-1'>/</span>
                        {formatDuration(duration)}
                    </span>

                    <div className='flex-1' />

                    <VolumeControl
                        volume={volume}
                        muted={muted}
                        onToggleMute={toggleMute}
                        onVolumeChange={handleVolumeChange}
                    />

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
