import type { ReactNode } from 'react';

import { MessagePlacement, MessageType } from './message-types';

export const DEFAULT_MESSAGE_DURATION = 3000;

export type MessageGlobalConfig = {
  duration?: number;
  placement?: MessagePlacement;
};

export type ShowMessageOptions = {
  type?: MessageType;
  content: ReactNode;
  duration?: number;
  placement?: MessagePlacement;
  key?: string;
};

export type MessageRecord = {
  id: string;
  type: MessageType;
  content: ReactNode;
  placement: MessagePlacement;
};

let globalConfig: Required<MessageGlobalConfig> = {
  duration: DEFAULT_MESSAGE_DURATION,
  placement: MessagePlacement.Top,
};

let messageRecords: MessageRecord[] = [];
const listeners = new Set<() => void>();
const dismissTimers = new Map<string, ReturnType<typeof setTimeout>>();

function emit() {
  messageRecords = [...messageRecords];
  listeners.forEach((listener) => listener());
}

export function getMessageGlobalConfig(): Readonly<Required<MessageGlobalConfig>> {
  return globalConfig;
}

export function setMessageGlobalConfig(config: MessageGlobalConfig) {
  globalConfig = {
    duration: config.duration ?? globalConfig.duration,
    placement: config.placement ?? globalConfig.placement,
  };
}

export function subscribeMessages(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getMessageSnapshot(): MessageRecord[] {
  return messageRecords;
}

function clearDismissTimer(id: string) {
  const timer = dismissTimers.get(id);
  if (timer != null) {
    clearTimeout(timer);
    dismissTimers.delete(id);
  }
}

export function removeMessage(id: string) {
  const next = messageRecords.filter((record) => record.id !== id);
  if (next.length === messageRecords.length) {
    return;
  }
  clearDismissTimer(id);
  messageRecords = next;
  emit();
}

function scheduleDismiss(id: string, duration: number) {
  clearDismissTimer(id);
  if (duration <= 0) {
    return;
  }
  dismissTimers.set(
    id,
    setTimeout(() => {
      removeMessage(id);
    }, duration)
  );
}

let idCounter = 0;

function createMessageId(key?: string) {
  if (key) {
    return key;
  }
  idCounter += 1;
  return `message-${idCounter}`;
}

export function addMessage(options: ShowMessageOptions): () => void {
  const id = createMessageId(options.key);
  const type = options.type ?? MessageType.Info;
  const placement = options.placement ?? globalConfig.placement;
  const duration = options.duration ?? globalConfig.duration;

  const existingIndex = messageRecords.findIndex((record) => record.id === id);
  const record: MessageRecord = {
    id,
    type,
    content: options.content,
    placement,
  };

  if (existingIndex >= 0) {
    const next = [...messageRecords];
    next[existingIndex] = record;
    messageRecords = next;
  } else {
    messageRecords = [...messageRecords, record];
  }

  emit();
  scheduleDismiss(id, duration);

  return () => removeMessage(id);
}
