import {
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';

import { Icon, type IconName, type IconTheme } from '../icon';
import {
  getMessageSnapshot,
  subscribeMessages,
  type MessageRecord,
} from './message-store';
import { MessagePlacement, MessageType } from './message-types';

export interface MessageProps {
  type?: MessageType;
  content: ReactNode;
}

type MessageIconConfig = {
  name: IconName;
  theme: IconTheme;
  spin?: boolean;
  className: string;
};

const messageIconConfig: Record<MessageType, MessageIconConfig> = {
  [MessageType.Info]: {
    name: 'info-circle',
    theme: 'filled',
    className: 'text-info',
  },
  [MessageType.Error]: {
    name: 'close-circle',
    theme: 'filled',
    className: 'text-error',
  },
  [MessageType.Loading]: {
    name: 'loading',
    theme: 'outlined',
    spin: true,
    className: 'text-info',
  },
  [MessageType.Success]: {
    name: 'check-circle',
    theme: 'filled',
    className: 'text-success',
  },
  [MessageType.Warning]: {
    name: 'exclamation-circle',
    theme: 'filled',
    className: 'text-warning',
  },
};

const messageRootClasses =
  'inline-flex max-w-[calc(100vw-32px)] items-center gap-size-sm rounded-border-lg bg-bg-container px-[12px] py-[9px] shadow-box-secondary text-body-md font-normal text-text';

function cn(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(' ');
}

export function Message({
  type = MessageType.Info,
  content,
}: MessageProps) {
  const icon = messageIconConfig[type];

  return (
    <div className={messageRootClasses} role="status">
      <Icon
        name={icon.name}
        theme={icon.theme}
        size={16}
        spin={icon.spin}
        className={cn('shrink-0', icon.className)}
      />
      <span className="min-w-0">{content}</span>
    </div>
  );
}

function MessageItem({ record }: { record: MessageRecord }) {
  return <Message type={record.type} content={record.content} />;
}

const placementHostClasses: Record<MessagePlacement, string> = {
  [MessagePlacement.Top]: 'top-0 left-1/2 -translate-x-1/2 items-center',
  [MessagePlacement.TopLeft]: 'top-0 left-0 items-start',
  [MessagePlacement.TopRight]: 'top-0 right-0 items-end',
  [MessagePlacement.Bottom]: 'bottom-0 left-1/2 -translate-x-1/2 items-center',
  [MessagePlacement.BottomLeft]: 'bottom-0 left-0 items-start',
  [MessagePlacement.BottomRight]: 'bottom-0 right-0 items-end',
};

const placementOrder: MessagePlacement[] = [
  MessagePlacement.Top,
  MessagePlacement.TopLeft,
  MessagePlacement.TopRight,
  MessagePlacement.Bottom,
  MessagePlacement.BottomLeft,
  MessagePlacement.BottomRight,
];

function MessagePlacementHost({
  placement,
  records,
}: {
  placement: MessagePlacement;
  records: MessageRecord[];
}) {
  if (records.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        'pointer-events-none fixed z-[1100] flex flex-col gap-size-xs p-padding-sm',
        placementHostClasses[placement]
      )}
      data-message-placement={placement}
    >
      {records.map((record) => (
        <div key={record.id} className="pointer-events-auto">
          <MessageItem record={record} />
        </div>
      ))}
    </div>
  );
}

export function MessageHost() {
  const records = useSyncExternalStore(
    subscribeMessages,
    getMessageSnapshot,
    getMessageSnapshot
  );

  const byPlacement = placementOrder.reduce<
    Record<MessagePlacement, MessageRecord[]>
  >(
    (acc, placement) => {
      acc[placement] = records.filter((record) => record.placement === placement);
      return acc;
    },
    {
      [MessagePlacement.Top]: [],
      [MessagePlacement.TopLeft]: [],
      [MessagePlacement.TopRight]: [],
      [MessagePlacement.Bottom]: [],
      [MessagePlacement.BottomLeft]: [],
      [MessagePlacement.BottomRight]: [],
    }
  );

  return (
    <>
      {placementOrder.map((placement) => (
        <MessagePlacementHost
          key={placement}
          placement={placement}
          records={byPlacement[placement]}
        />
      ))}
    </>
  );
}

let hostMounted = false;

export function ensureMessageHost() {
  if (typeof document === 'undefined' || hostMounted) {
    return;
  }
  hostMounted = true;

  const container = document.createElement('div');
  container.setAttribute('data-message-root', '');
  document.body.appendChild(container);

  void import('react-dom/client').then(({ createRoot }) => {
    createRoot(container).render(<MessageHost />);
  });
}

export interface MessageProviderProps {
  children?: ReactNode;
}

export function MessageProvider({ children }: MessageProviderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    hostMounted = true;
    setMounted(true);
  }, []);

  return (
    <>
      {children}
      {mounted ? createPortal(<MessageHost />, document.body) : null}
    </>
  );
}
