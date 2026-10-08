export const palette = (token: string) => getComputedStyle(document.documentElement).getPropertyValue(token).trim();
export const accentChannels = () => palette('--accent-rgb').split(',').map(Number);
