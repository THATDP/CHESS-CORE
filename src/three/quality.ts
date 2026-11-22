import { useMemo } from 'react';

export type QualityTier = 'low' | 'medium' | 'high';

/**
 * Picks a rendering tier from the device profile. The scene stays fluid on
 * phones by dropping shadows, post-processing and particle counts.
 */
export function useQualityTier(): QualityTier {
  return useMemo<QualityTier>(() => {
    if (typeof window === 'undefined') return 'medium';
    const override = window.localStorage.getItem('cc-quality');
    if (override === 'high' || override === 'medium' || override === 'low') return override;
    const mobile = window.matchMedia('(max-width: 760px)').matches
      || /Android|iPhone|iPad|iPod|Mobile/i.test(window.navigator.userAgent);
    const cores = window.navigator.hardwareConcurrency ?? 4;
    const dpr = window.devicePixelRatio || 1;
    const memory = (window.navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;

    if (mobile && (cores <= 4 || memory <= 3)) return 'low';
    if (mobile) return 'medium';
    if (cores >= 8 && memory >= 6 && dpr <= 2.5) return 'high';
    if (cores >= 4) return 'medium';
    return 'low';
  }, []);
}

export function usePrefersReducedMotion(): boolean {
  return useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);
}

export function devicePixelRatioCap(tier: QualityTier): number {
  if (typeof window === 'undefined') return 1;
  const dpr = window.devicePixelRatio || 1;
  if (tier === 'high') return Math.min(dpr, 2);
  if (tier === 'medium') return Math.min(dpr, 1.5);
  return 1;
}

export function webglSupported(): boolean {
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      canvas.getContext('webgl2')
      ?? canvas.getContext('webgl')
      ?? canvas.getContext('experimental-webgl'),
    );
  } catch {
    return false;
  }
}
