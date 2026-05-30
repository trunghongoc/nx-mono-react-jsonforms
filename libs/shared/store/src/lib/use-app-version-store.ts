import { create } from 'zustand';

export type AppName = 'host' | 'project1' | 'project2';

export interface AppVersionState {
  versions: Partial<Record<AppName, string>>;
  setVersion: (app: AppName, version: string) => void;
  getVersion: (app: AppName) => string | undefined;
}

export const useAppVersionStore = create<AppVersionState>((set, get) => ({
  versions: {},
  setVersion: (app, version) =>
    set((state) => ({
      versions: { ...state.versions, [app]: version },
    })),
  getVersion: (app) => get().versions[app],
}));

export function initAppVersion(app: AppName, version: string): void {
  useAppVersionStore.getState().setVersion(app, version);
}
