import {
  createContext,
  forwardRef,
  useContext,
  type AnchorHTMLAttributes,
  type ForwardRefExoticComponent,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
  type Ref,
  type RefAttributes,
} from 'react';

import { Button } from '../button';
import { Icon, iconNames, type IconName } from '../icon';

export type PageLeftSidebarHeight = 'screen' | 'parent';

export type PageLeftSidebarItemConfig = {
  key: string;
  label: ReactNode;
  href?: string;
  icon?: ReactNode | IconName;
  selected?: boolean;
  disabled?: boolean;
  onClick?: (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
};

export interface PageLeftSidebarProps
  extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** Sidebar width when expanded. */
  width?: number | string;
  /** Width when collapsed. */
  collapsedWidth?: number | string;
  collapsed?: boolean;
  collapsible?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  /** Custom collapse trigger; set to `null` to hide. */
  trigger?: ReactNode | null;
  header?: ReactNode;
  footer?: ReactNode;
  bordered?: boolean;
  /** Keeps the sidebar visible while scrolling page content. */
  fixed?: boolean;
  /** `screen` fills the viewport; `parent` fills the sidebar container (e.g. PageLayout body). */
  height?: PageLeftSidebarHeight;
  items?: PageLeftSidebarItemConfig[];
  children?: ReactNode;
}

export interface PageLeftSidebarItemProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children' | 'onClick'> {
  href?: string;
  icon?: ReactNode | IconName;
  selected?: boolean;
  disabled?: boolean;
  children?: ReactNode;
  onClick?: (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
}

type PageLeftSidebarContextValue = {
  collapsed: boolean;
};

const PageLeftSidebarContext = createContext<PageLeftSidebarContextValue>({
  collapsed: false,
});

function cn(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(' ');
}

function isIconName(value: string): value is IconName {
  return (iconNames as readonly string[]).includes(value);
}

function toSizeValue(value: number | string): string {
  return typeof value === 'number' ? `${value}px` : value;
}

const rootBaseClasses =
  'relative flex shrink-0 flex-col bg-bg-container transition-[width] duration-200 ease-out';

const heightClasses: Record<PageLeftSidebarHeight, string> = {
  screen: 'h-svh min-h-svh',
  parent: 'h-full min-h-0',
};

const borderedClasses = 'border-r border-split';

const headerClasses =
  'shrink-0 border-b border-split px-padding-content-horizontal py-padding-content-vertical screen-md:px-padding-content-horizontal-lg screen-md:py-padding-content-vertical-lg';

const bodyClasses = 'flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden';

const navClasses = 'flex flex-col gap-size-xxs p-padding-xs';

const footerClasses =
  'mt-auto shrink-0 border-t border-split px-padding-content-horizontal py-padding-content-vertical screen-md:px-padding-content-horizontal-lg screen-md:py-padding-content-vertical-lg';

const triggerClasses =
  'flex shrink-0 items-center justify-center border-t border-split px-padding-xs py-padding-xxs';

const itemBaseClasses =
  'flex w-full items-center gap-size-xs rounded-border-xs px-padding-sm py-padding-xs text-body-md transition-colors';

const itemInteractiveClasses =
  'cursor-pointer text-text hover:bg-fill-secondary active:bg-fill-tertiary';

const itemSelectedClasses = 'bg-primary-bg text-primary';

const itemDisabledClasses =
  'pointer-events-none cursor-not-allowed text-text-disabled';

const itemCollapsedClasses = 'justify-center px-padding-xs';

function PageLeftSidebarIcon({ icon }: { icon?: ReactNode | IconName }) {
  if (!icon) {
    return null;
  }

  if (typeof icon === 'string' && isIconName(icon)) {
    return <Icon name={icon} size="md" className="shrink-0" aria-hidden />;
  }

  return (
    <span className="inline-flex shrink-0 items-center [&_svg]:shrink-0" aria-hidden>
      {icon}
    </span>
  );
}

function DefaultCollapseTrigger({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <Button
      type="text"
      iconOnly
      size="md"
      aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      aria-expanded={!collapsed}
      icon={<Icon name={collapsed ? 'menu-unfold' : 'menu-fold'} />}
      onClick={onToggle}
      className="w-full"
    />
  );
}

export const PageLeftSidebarItem = forwardRef<
  HTMLAnchorElement | HTMLButtonElement,
  PageLeftSidebarItemProps
>(function PageLeftSidebarItem(
  {
    href,
    icon,
    selected = false,
    disabled = false,
    children,
    className,
    onClick,
    ...props
  },
  ref
) {
  const { collapsed } = useContext(PageLeftSidebarContext);

  const content = (
    <>
      <PageLeftSidebarIcon icon={icon} />
      {collapsed ? null : <span className="min-w-0 truncate">{children}</span>}
    </>
  );

  const classes = cn(
    itemBaseClasses,
    disabled
      ? itemDisabledClasses
      : selected
        ? itemSelectedClasses
        : itemInteractiveClasses,
    collapsed && itemCollapsedClasses,
    className
  );

  if (href && !disabled) {
    return (
      <a
        ref={ref as Ref<HTMLAnchorElement>}
        href={href}
        aria-current={selected ? 'page' : undefined}
        aria-disabled={disabled || undefined}
        className={cn(classes, 'no-underline')}
        onClick={onClick}
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={ref as Ref<HTMLButtonElement>}
      type="button"
      disabled={disabled}
      aria-current={selected ? 'page' : undefined}
      className={cn(classes, 'border-0 bg-transparent text-left')}
      onClick={onClick}
    >
      {content}
    </button>
  );
});

function renderConfigItems(items: PageLeftSidebarItemConfig[]) {
  return items.map((item) => (
    <PageLeftSidebarItem
      key={item.key}
      href={item.href}
      icon={item.icon}
      selected={item.selected}
      disabled={item.disabled}
      onClick={item.onClick}
    >
      {item.label}
    </PageLeftSidebarItem>
  ));
}

export type PageLeftSidebarComponent = ForwardRefExoticComponent<
  PageLeftSidebarProps & RefAttributes<HTMLElement>
> & {
  Item: typeof PageLeftSidebarItem;
};

const PageLeftSidebarRoot = forwardRef<HTMLElement, PageLeftSidebarProps>(
  function PageLeftSidebar(
    {
      width = 256,
      collapsedWidth = 64,
      collapsed = false,
      collapsible = false,
      onCollapse,
      trigger,
      header,
      footer,
      bordered = true,
      fixed = false,
      height = 'screen',
      items,
      children,
      className,
      style,
      ...props
    },
    ref
  ) {
    const resolvedWidth = collapsed ? collapsedWidth : width;
    const showTrigger = collapsible && trigger !== null;
    const triggerNode =
      trigger === undefined ? (
        <DefaultCollapseTrigger
          collapsed={collapsed}
          onToggle={() => onCollapse?.(!collapsed)}
        />
      ) : (
        trigger
      );

    return (
      <PageLeftSidebarContext.Provider value={{ collapsed }}>
        <aside
          ref={ref}
          aria-label="Page sidebar"
          className={cn(
            rootBaseClasses,
            heightClasses[height],
            bordered && borderedClasses,
            fixed && 'sticky top-0 self-start',
            className
          )}
          style={{
            width: toSizeValue(resolvedWidth),
            ...style,
          }}
          {...props}
        >
          {header ? <div className={headerClasses}>{header}</div> : null}

          <div className={bodyClasses}>
            <nav className={navClasses}>
              {items ? renderConfigItems(items) : children}
            </nav>
          </div>

          {footer ? <div className={footerClasses}>{footer}</div> : null}

          {showTrigger ? (
            <div className={triggerClasses}>{triggerNode}</div>
          ) : null}
        </aside>
      </PageLeftSidebarContext.Provider>
    );
  }
);

export const PageLeftSidebar: PageLeftSidebarComponent = Object.assign(
  PageLeftSidebarRoot,
  {
    Item: PageLeftSidebarItem,
  }
);

export default PageLeftSidebar;
