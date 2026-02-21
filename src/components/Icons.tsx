export const CopyIcon = () => (
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

export const CheckIcon = () => (
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

export const ExternalIcon = () => (
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

export const DownloadIcon = () => (
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

export const PlayIcon = () => (
    <svg width='13' height='13' viewBox='0 0 24 24' fill='currentColor'>
        <polygon points='5 3 19 12 5 21 5 3' />
    </svg>
);

export const PauseIcon = () => (
    <svg width='13' height='13' viewBox='0 0 24 24' fill='currentColor'>
        <rect x='6' y='4' width='4' height='16' rx='1' />
        <rect x='14' y='4' width='4' height='16' rx='1' />
    </svg>
);

export const MusicNoteIcon = () => (
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

export const VolumeIcon = ({ level, muted }: { level: number; muted: boolean }) => {
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

export const FullscreenIcon = () => (
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

export const ExitFullscreenIcon = () => (
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
