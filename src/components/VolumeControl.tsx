import { useRef, useState } from 'react';
import { VolumeIcon } from './Icons';

interface VolumeControlProps {
    volume: number;
    muted: boolean;
    onToggleMute: () => void;
    onVolumeChange: (v: number) => void;
}

export function VolumeControl({
    volume,
    muted,
    onToggleMute,
    onVolumeChange,
}: VolumeControlProps) {
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
