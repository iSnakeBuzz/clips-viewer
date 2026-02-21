import { useRef, useState } from 'react';
import { formatDuration } from '../utils/format';

interface ProgressBarProps {
    current: number;
    duration: number;
    onSeek: (t: number) => void;
}

export function ProgressBar({ current, duration, onSeek }: ProgressBarProps) {
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
                const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                setHoverX(x * 100);
                setHoverTime(x * duration);
            }}
        >
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

            {hovered && duration > 0 && (
                <div
                    className='absolute -top-8 bg-[#1c1c1c] border border-white/8 text-white/80 text-[10px] font-medium px-1.5 py-[3px] rounded pointer-events-none whitespace-nowrap shadow-xl'
                    style={{
                        left: `${hoverX}%`,
                        transform: 'translateX(-50%)',
                    }}
                >
                    {formatDuration(hoverTime)}
                </div>
            )}
        </div>
    );
}
