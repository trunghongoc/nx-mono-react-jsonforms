import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../button';
import {
  configureMessage,
  Message,
  MessagePlacement,
  MessageProvider,
  MessageType,
  showMessage,
} from './index';

const meta: Meta<typeof Message> = {
  title: 'Core/Message',
  component: Message,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <MessageProvider>
        <Story />
      </MessageProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Message>;

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-size-sm">
      <Message type={MessageType.Info} content="Normal message" />
      <Message type={MessageType.Error} content="Error message" />
      <Message type={MessageType.Loading} content="Loading message" />
      <Message type={MessageType.Success} content="Success message" />
      <Message type={MessageType.Warning} content="Warning message" />
    </div>
  ),
};

export const ImperativeApi: Story = {
  render: () => (
    <div className="flex flex-wrap gap-size-sm">
      <Button
        type="default"
        onClick={() =>
          showMessage({
            type: MessageType.Info,
            content: 'Normal message',
          })
        }
      >
        Info
      </Button>
      <Button
        type="default"
        onClick={() =>
          showMessage({
            type: MessageType.Error,
            content: 'Error message',
          })
        }
      >
        Error
      </Button>
      <Button
        type="default"
        onClick={() =>
          showMessage({
            type: MessageType.Loading,
            content: 'Loading message',
            duration: 0,
          })
        }
      >
        Loading (no auto close)
      </Button>
      <Button
        type="default"
        onClick={() =>
          showMessage({
            type: MessageType.Success,
            content: 'Success message',
          })
        }
      >
        Success
      </Button>
      <Button
        type="default"
        onClick={() =>
          showMessage({
            type: MessageType.Warning,
            content: 'Warning message',
          })
        }
      >
        Warning
      </Button>
      <Button
        type="default"
        onClick={() => {
          showMessage({ type: MessageType.Info, content: 'Message 1' });
          showMessage({ type: MessageType.Success, content: 'Message 2' });
        }}
      >
        Stack two
      </Button>
    </div>
  ),
};

export const Placements: Story = {
  render: () => (
    <div className="flex flex-wrap gap-size-sm">
      {(
        [
          ['Top', MessagePlacement.Top],
          ['Top left', MessagePlacement.TopLeft],
          ['Top right', MessagePlacement.TopRight],
          ['Bottom', MessagePlacement.Bottom],
          ['Bottom left', MessagePlacement.BottomLeft],
          ['Bottom right', MessagePlacement.BottomRight],
        ] as const
      ).map(([label, placement]) => (
        <Button
          key={placement}
          type="default"
          onClick={() =>
            showMessage({
              type: MessageType.Info,
              content: `${label} placement`,
              placement,
              duration: 5000,
            })
          }
        >
          {label}
        </Button>
      ))}
    </div>
  ),
};

export const GlobalConfig: Story = {
  render: () => (
    <div className="flex flex-wrap gap-size-sm">
      <Button
        type="default"
        onClick={() => {
          configureMessage({
            duration: 5000,
            placement: MessagePlacement.BottomRight,
          });
          showMessage({
            type: MessageType.Success,
            content: 'Global: 5s, bottom-right',
          });
        }}
      >
        Configure global
      </Button>
      <Button
        type="default"
        onClick={() =>
          showMessage({
            type: MessageType.Info,
            content: 'Override: top, 2s',
            placement: MessagePlacement.Top,
            duration: 2000,
          })
        }
      >
        Override per message
      </Button>
    </div>
  ),
};
