import { useEffect, useState } from 'react';

const STORAGE_KEY = 'cc-navigation';

export type NavPreferences = {
  /** Mantém o cabeçalho visível durante a rolagem. */
  pinned: boolean;
  /** Cabeçalho compacto nas páginas de partida. */
  compactMatches: boolean;
  /** Liga/desliga a cena 3D em tempo real. */
  scene3d: boolean;
};

export const defaultNavPreferences: NavPreferences = {
  pinned: true,
  compactMatches: true,
  scene3d: true,
};

const EVENT = 'cc-navigation';

export function readNavPreferences(): NavPreferences {
  if (typeof window === 'undefined') return defaultNavPreferences;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultNavPreferences;
    return { ...defaultNavPreferences, ...(JSON.parse(raw) as Partial<NavPreferences>) };
  } catch {
    return defaultNavPreferences;
  }
}

export function writeNavPreferences(next: NavPreferences): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* armazenamento indisponível: as preferências ficam só em memória */
  }
  window.dispatchEvent(new CustomEvent(EVENT));
}

/** Estado reativo das preferências, compartilhado entre cabeçalho e páginas. */
/** Aplica uma alteração parcial e notifica os componentes inscritos. */
export function updateNavPreferences(patch: Partial<NavPreferences>): void {
  writeNavPreferences({ ...readNavPreferences(), ...patch });
}

export function useNavPreferences(): NavPreferences {
  const [prefs, setPrefs] = useState<NavPreferences>(readNavPreferences);

  useEffect(() => {
    const update = () => setPrefs(readNavPreferences());
    window.addEventListener(EVENT, update);
    window.addEventListener('storage', update);
    return () => {
      window.removeEventListener(EVENT, update);
      window.removeEventListener('storage', update);
    };
  }, []);

  return prefs;
}

export function useSceneEnabled(): boolean {
  return useNavPreferences().scene3d;
}
