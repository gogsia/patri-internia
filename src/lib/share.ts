export async function shareDesign(title: string, text: string) {
  const hasWindow = typeof globalThis.window === 'object';
  const url = hasWindow ? globalThis.window.location.href : '';

  if (typeof globalThis.navigator === 'object' && globalThis.navigator.share) {
    try {
      await globalThis.navigator.share({ title, text, url });
      return true;
    } catch {
      return false;
    }
  }

  if (!hasWindow) {
    return false;
  }

  const encodedText = encodeURIComponent(`${text} ${url}`);
  globalThis.window.open(
    `https://twitter.com/intent/tweet?text=${encodedText}`,
    '_blank',
    'noopener,noreferrer'
  );
  return true;
}

export function downloadCanvasScreenshot(filenamePrefix = 'solarpunk-layout') {
  if (typeof document === 'undefined') {
    return false;
  }

  const canvas = document.querySelector('canvas');
  if (!(canvas instanceof HTMLCanvasElement)) {
    return false;
  }

  const dataUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  const stamp = new Date().toISOString().replaceAll(':', '-').replaceAll('.', '-');
  link.href = dataUrl;
  link.download = `${filenamePrefix}-${stamp}.png`;
  link.click();
  return true;
}
