import {
  Children,
  Fragment,
  forwardRef,
  isValidElement,
  type AnchorHTMLAttributes,
  type ForwardRefExoticComponent,
  type HTMLAttributes,
  type LiHTMLAttributes,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type RefAttributes,
} from 'react';

import { Icon, iconNames, type IconName } from '../icon';

export type BreadcrumbItemConfig = {
  title: ReactNode;
  href?: string;
  icon?: ReactNode | IconName;
  onClick?: (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
};

export interface BreadcrumbProps
  extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  items?: BreadcrumbItemConfig[];
  separator?: ReactNode;
  children?: ReactNode;
}

export interface BreadcrumbItemProps
  extends Omit<LiHTMLAttributes<HTMLLIElement>, 'title' | 'onClick'> {
  href?: string;
  icon?: ReactNode | IconName;
  /** Marks the current page when no `href` is set. */
  current?: boolean;
  children?: ReactNode;
  onClick?: (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
}

function cn(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(' ');
}

function isIconName(value: string): value is IconName {
  return (iconNames as readonly string[]).includes(value);
}

const navClasses = 'w-full min-w-0';

const listClasses =
  'm-0 flex list-none flex-wrap items-center gap-size-xxs p-0';

const separatorClasses = 'inline-flex shrink-0 items-center';

const itemClasses = 'inline-flex items-center';

const contentClasses = 'inline-flex items-center gap-size-xxs text-body-sm';

const linkClasses =
  'text-link transition-colors hover:text-link-hover active:text-link-active';

const currentClasses = 'text-text';

function BreadcrumbIcon({ icon }: { icon?: ReactNode | IconName }) {
  if (!icon) {
    return null;
  }

  if (typeof icon === 'string' && isIconName(icon)) {
    return <Icon name={icon} size="sm" className="shrink-0" aria-hidden />;
  }

  return (
    <span className="inline-flex shrink-0 items-center [&_svg]:shrink-0" aria-hidden>
      {icon}
    </span>
  );
}

function BreadcrumbSeparator({
  separator,
  index,
}: {
  separator: ReactNode;
  index: number;
}) {
  return (
    <li key={`separator-${index}`} aria-hidden className={separatorClasses}>
      {typeof separator === 'string' ? (
        <span className="text-body-sm text-text-quaternary">{separator}</span>
      ) : (
        separator
      )}
    </li>
  );
}

function BreadcrumbItemContent({
  href,
  icon,
  current,
  children,
  onClick,
}: Pick<
  BreadcrumbItemProps,
  'href' | 'icon' | 'current' | 'children' | 'onClick'
>) {
  const content = (
    <>
      <BreadcrumbIcon icon={icon} />
      {children}
    </>
  );

  if (href) {
    return (
      <a href={href} onClick={onClick} className={cn(contentClasses, linkClasses)}>
        {content}
      </a>
    );
  }

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          contentClasses,
          linkClasses,
          'cursor-pointer border-0 bg-transparent p-0'
        )}
      >
        {content}
      </button>
    );
  }

  return (
    <span
      aria-current={current ? 'page' : undefined}
      className={cn(contentClasses, currentClasses)}
    >
      {content}
    </span>
  );
}

export const BreadcrumbItem = forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  function BreadcrumbItem(
    { href, icon, current, children, className, onClick, ...props },
    ref
  ) {
    const isCurrent = current ?? (!href && !onClick);

    return (
      <li ref={ref} className={cn(itemClasses, className)} {...props}>
        <BreadcrumbItemContent
          href={href}
          icon={icon}
          current={isCurrent}
          onClick={onClick}
        >
          {children}
        </BreadcrumbItemContent>
      </li>
    );
  }
);

function collectBreadcrumbItems(
  children: ReactNode
): ReactElement<BreadcrumbItemProps>[] {
  const items: ReactElement<BreadcrumbItemProps>[] = [];

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      return;
    }

    if (child.type === Fragment) {
      Children.forEach(
        (child.props as { children?: ReactNode }).children,
        (nested) => {
          if (isValidElement<BreadcrumbItemProps>(nested) && nested.type === BreadcrumbItem) {
            items.push(nested);
          }
        }
      );
      return;
    }

    if (child.type === BreadcrumbItem) {
      items.push(child as ReactElement<BreadcrumbItemProps>);
    }
  });

  return items;
}

function renderItemList(
  elements: ReactElement<BreadcrumbItemProps>[],
  separator: ReactNode
) {
  return elements.map((item, index) => (
    <Fragment key={item.key ?? index}>
      {index > 0 ? (
        <BreadcrumbSeparator separator={separator} index={index} />
      ) : null}
      {item}
    </Fragment>
  ));
}

function renderConfigItems(
  items: BreadcrumbItemConfig[],
  separator: ReactNode
) {
  return items.map((item, index) => {
    const isLast = index === items.length - 1;
    const isLink = Boolean(item.href || item.onClick);
    const isCurrent = isLast && !isLink;

    return (
      <Fragment key={index}>
        {index > 0 ? (
          <BreadcrumbSeparator separator={separator} index={index} />
        ) : null}
        <BreadcrumbItem
          href={item.href}
          icon={item.icon}
          onClick={item.onClick}
          current={isCurrent}
        >
          {item.title}
        </BreadcrumbItem>
      </Fragment>
    );
  });
}

export type BreadcrumbComponent = ForwardRefExoticComponent<
  BreadcrumbProps & RefAttributes<HTMLElement>
> & {
  Item: typeof BreadcrumbItem;
};

const BreadcrumbRoot = forwardRef<HTMLElement, BreadcrumbProps>(function Breadcrumb(
  { items, separator = '/', children, className, ...props },
  ref
) {
  const itemElements = children ? collectBreadcrumbItems(children) : [];

  return (
    <nav
      ref={ref}
      aria-label="Breadcrumb"
      className={cn(navClasses, className)}
      {...props}
    >
      <ol className={listClasses}>
        {items
          ? renderConfigItems(items, separator)
          : renderItemList(itemElements, separator)}
      </ol>
    </nav>
  );
});

export const Breadcrumb: BreadcrumbComponent = Object.assign(BreadcrumbRoot, {
  Item: BreadcrumbItem,
});

export default Breadcrumb;
