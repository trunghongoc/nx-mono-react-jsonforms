import { addMessage, setMessageGlobalConfig } from './message-store';
import type { MessageGlobalConfig, ShowMessageOptions } from './message-store';
import { ensureMessageHost } from './message';

export function configureMessage(config: MessageGlobalConfig) {
  setMessageGlobalConfig(config);
}

export function showMessage(options: ShowMessageOptions): () => void {
  ensureMessageHost();
  return addMessage(options);
}

export type { MessageGlobalConfig, ShowMessageOptions };
