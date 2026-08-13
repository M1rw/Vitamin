const path = require('path');
const { fileURLToPath } = require('url');

const INTERNAL_HTML_ROOT = path.resolve(__dirname, 'html');
const MAX_URL_LENGTH = 4096;
const MAX_SEARCH_LENGTH = 512;
const MAX_BOOKMARKLET_LENGTH = 20000;

function getSenderUrl(event) {
  const frameUrl = event?.senderFrame?.url;
  if (typeof frameUrl === 'string' && frameUrl) return frameUrl;

  const senderUrl = event?.sender?.getURL?.();
  return typeof senderUrl === 'string' ? senderUrl : '';
}

function getTrustedInternalFile(event) {
  const senderUrl = getSenderUrl(event);
  if (!senderUrl.startsWith('file://')) return null;

  try {
    const candidate = path.resolve(fileURLToPath(senderUrl));
    const rootPrefix = `${INTERNAL_HTML_ROOT}${path.sep}`;
    if (candidate.startsWith(rootPrefix) && path.extname(candidate) === '.html') {
      return path.basename(candidate);
    }
  } catch {
    return null;
  }

  return null;
}

function requireTrustedInternalSender(event, channel, allowedFiles = null) {
  const fileName = getTrustedInternalFile(event);
  const permitted = Boolean(fileName) && (!allowedFiles || allowedFiles.includes(fileName));

  if (!permitted) {
    console.warn(`[IPC] Rejected ${channel} from untrusted sender: ${getSenderUrl(event) || 'unknown'}`);
  }

  return permitted;
}

function parseHttpUrl(value) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > MAX_URL_LENGTH) return null;

  try {
    const parsed = new URL(trimmed);
    if ((parsed.protocol === 'https:' || parsed.protocol === 'http:') && parsed.hostname) {
      return parsed;
    }
  } catch {
    return null;
  }

  return null;
}

function normaliseNavigationInput(value) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > MAX_URL_LENGTH || /[\u0000-\u001F]/.test(trimmed)) return null;

  const directUrl = parseHttpUrl(trimmed);
  if (directUrl) return directUrl.toString();

  if (/^[a-zA-Z][a-zA-Z\d+.-]*:/.test(trimmed)) return null;

  if (trimmed.includes('.') && !/\s/.test(trimmed)) {
    return parseHttpUrl(`https://${trimmed}`)?.toString() || null;
  }

  return `https://duckduckgo.com/?q=${encodeURIComponent(trimmed)}`;
}

function normaliseSearchQuery(value) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > MAX_SEARCH_LENGTH || /[\u0000-\u001F]/.test(trimmed)) return null;
  return trimmed;
}

function isKnownDownloadPath(value, downloads) {
  if (typeof value !== 'string' || !value.trim() || !Array.isArray(downloads)) return false;
  const requested = path.resolve(value);
  return downloads.some((download) => typeof download?.savePath === 'string' && path.resolve(download.savePath) === requested);
}

function isSafeBookmarklet(value) {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= MAX_BOOKMARKLET_LENGTH;
}

module.exports = {
  getSenderUrl,
  getTrustedInternalFile,
  requireTrustedInternalSender,
  parseHttpUrl,
  normaliseNavigationInput,
  normaliseSearchQuery,
  isKnownDownloadPath,
  isSafeBookmarklet,
};
