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
        <div className='flex items-center gap-2'>
            <button
                onClick={onToggleMute}
                className='text-white/70 hover:text-white transition-colors duration-150 flex items-center p-1 cursor-pointer'
            >
                <VolumeIcon level={volume} muted={muted} />
            </button>

            <div
                className='w-[112px] flex items-center py-1 cursor-pointer select-none'
                onPointerDown={handleSlider}
            >
                <div className='relative w-full h-[4px] rounded-full bg-white/20'>
                    <div
                        className='absolute inset-y-0 left-0 rounded-full'
                        style={{
                            width: `${display * 100}%`,
                            background: 'rgba(255,255,255,0.75)',
                        }}
                    />
                    <div
                        className='pointer-events-none absolute top-1/2 h-3 w-3 rounded-full border border-white/60 bg-white shadow-[0_4px_10px_rgba(0,0,0,0.18)] transition-transform duration-150'
                        style={{
                            left: `${display * 100}%`,
                            transform: 'translate(-50%, -50%)',
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
