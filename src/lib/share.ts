export async function shareDesign(title: string, text: string) {
  const url = typeof window !== 'undefined' ? window.location.href : '';

  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({ title, text, url });
      return true;
    } catch {
      return false;
    }
  }

  const encodedText = encodeURIComponent(`${text} ${url}`);
  window.open(`https://twitter.com/intent/tweet?text=${encodedText}`, '_blank', 'noopener,noreferrer');
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
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  link.href = dataUrl;
  link.download = `${filenamePrefix}-${stamp}.png`;
  link.click();
  return true;
}
