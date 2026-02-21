export type MediaType = 'video' | 'image' | 'audio' | 'unknown';

const videoExt = ['mp4', 'mkv', 'webm', 'mov', 'avi'];
const imageExt = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif'];
const audioExt = ['mp3', 'ogg', 'wav', 'flac', 'm4a'];

export function getType(filename: string): MediaType {
    const ext = filename.split('.').pop()?.toLowerCase() ?? '';
    if (videoExt.includes(ext)) return 'video';
    if (imageExt.includes(ext)) return 'image';
    if (audioExt.includes(ext)) return 'audio';
    return 'unknown';
}
