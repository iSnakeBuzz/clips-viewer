import { useCallback, useRef, useState } from 'react';
import { formatDuration } from '../utils/format';
import { MusicNoteIcon, PauseIcon, PlayIcon } from './Icons';
import { ProgressBar } from './ProgressBar';
import { VolumeControl } from './VolumeControl';

interface AudioPlayerProps {
    src: string;
}

export function AudioPlayer({ src }: AudioPlayerProps) {
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
            <div className='w-28 h-28 rounded-2xl border border-white/7 bg-white/2.5 flex items-center justify-center'>
                <MusicNoteIcon />
            </div>

            <audio
                ref={audioRef}
                src={src}
                autoPlay
                onLoadedMetadata={() => {
                    const a = audioRef.current;
                    if (a) {
                        setDuration(a.duration);
                        // Kick off playback once metadata is ready
                        a.play()
                            .then(() => setPlaying(true))
                            .catch(() => {});
                    }
                }}
                onTimeUpdate={() => {
                    const a = audioRef.current;
                    if (a) setCurrentTime(a.currentTime);
                }}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
            />

            <div className='w-full flex flex-col gap-3.5'>
                <ProgressBar
                    current={currentTime}
                    duration={duration}
                    onSeek={handleSeek}
                />

                <div className='flex items-center gap-3'>
                    <button
                        onClick={togglePlay}
                        className='w-8 h-8 rounded-full bg-indigo-500 hover:bg-indigo-400 flex items-center justify-center text-white transition-colors duration-150 shrink-0 pl-0.5 cursor-pointer'
                    >
                        {playing ? <PauseIcon /> : <PlayIcon />}
                    </button>

                    <span className='text-[11px] text-white/50 tabular-nums font-medium'>
                        {formatDuration(currentTime)}
                    </span>

                    <div className='flex-1' />

                    <span className='text-[11px] text-white/30 tabular-nums'>
                        {formatDuration(duration)}
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
