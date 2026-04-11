import { useEffect, useState } from 'react';
import { api } from '../utils/api';

export const READY_REPO_STATUS = 'READY';
export const FAILED_REPO_STATUS = 'FAILED';

const TERMINAL_REPO_STATUSES = new Set([READY_REPO_STATUS, FAILED_REPO_STATUS]);

const REPO_STATUS_LABELS = {
  RECEIVED: 'Analysis queued',
  CLONING: 'Cloning repository',
  SCANNING: 'Scanning files',
  PARSING: 'Parsing functions and symbols',
  GRAPHING: 'Building graphs and summaries',
  READY: 'Analysis complete',
  FAILED: 'Analysis failed',
};

export function getRepoStatusLabel(status) {
  return REPO_STATUS_LABELS[status] || 'Preparing analysis';
}

export function useRepoStatus(repoId, options = {}) {
  const { enabled = true, pollIntervalMs = 3000 } = options;
  const [status, setStatus] = useState(null);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(Boolean(enabled && repoId));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enabled || !repoId) {
      setLoading(false);
      return undefined;
    }

    let active = true;
    let timeoutId = null;

    const scheduleNextPoll = () => {
      if (!active) return;
      timeoutId = window.setTimeout(loadStatus, pollIntervalMs);
    };

    const loadStatus = async () => {
      try {
        const response = await api.get(`/${repoId}/status`, { cache: 'no-store' });

        if (!active) return;

        const nextMeta = response?.data || null;
        const nextStatus = nextMeta?.status || null;

        setMeta(nextMeta);
        setStatus(nextStatus);
        setError(null);
        setLoading(false);

        if (!TERMINAL_REPO_STATUSES.has(nextStatus)) {
          scheduleNextPoll();
        }
      } catch (err) {
        if (!active) return;
        setError(err.message || 'Failed to load repository status.');
        setLoading(false);
      }
    };

    setLoading(true);
    loadStatus();

    return () => {
      active = false;
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [enabled, pollIntervalMs, repoId]);

  return {
    status,
    meta,
    loading,
    error,
    isReady: status === READY_REPO_STATUS,
    isFailed: status === FAILED_REPO_STATUS,
    isProcessing: Boolean(status) && !TERMINAL_REPO_STATUSES.has(status),
  };
}
