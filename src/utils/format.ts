export function formatDuration(seconds: number): string {
    if (!seconds || isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${minutes}:${String(sec).padStart(2, '0')}`;
}
