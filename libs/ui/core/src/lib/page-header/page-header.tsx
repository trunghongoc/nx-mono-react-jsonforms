import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from 'react';

import { Button } from '../button';
import { Icon } from '../icon';
import { H3, P } from '../text';

export type PageHeaderPosition = 'static' | 'sticky';

export interface PageHeaderProps
  extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title?: ReactNode;
  subtitle?: ReactNode;
  breadcrumb?: ReactNode;
  /** Show back control. Also shown when `onBack` is provided. */
  back?: boolean;
  onBack?: () => void;
  backIcon?: ReactNode;
  avatar?: ReactNode;
  tags?: ReactNode;
  /** Brand mark or app logo for bar layout (left slot). */
  logo?: ReactNode;
  /** Actions aligned to the end on desktop; full-width stack on mobile. */
  extra?: ReactNode;
  footer?: ReactNode;
  bordered?: boolean;
  /** Layout position. `sticky` pins the header to the top while scrolling. */
  position?: PageHeaderPosition;
}

function cn(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(' ');
}

const rootClasses =
  'box-border w-full max-w-full min-w-0 bg-bg-container px-padding-content-horizontal py-padding-content-vertical screen-md:px-padding-content-horizontal-lg screen-md:py-padding-content-vertical-lg';

const positionClasses: Record<PageHeaderPosition, string> = {
  static: 'static',
  sticky: 'sticky top-0 z-sticky',
};

const borderedClasses = 'border-b border-split';

const mainRowClasses =
  'flex flex-col gap-margin screen-md:flex-row screen-md:items-start screen-md:justify-between screen-md:gap-margin-lg';

const contentClasses = 'flex min-w-0 flex-1 flex-col gap-margin-xs';

const headingRowClasses = 'flex min-w-0 items-start gap-margin-xs';

const titleBlockClasses = 'flex min-w-0 flex-1 flex-col gap-margin-xxs';

const titleClasses =
  'text-heading-4 text-text-heading screen-md:text-heading-3';

const tagsClasses = 'flex flex-wrap items-center gap-size-xxs';

const extraClasses =
  'flex w-full shrink-0 flex-col gap-size-xs [&>button]:w-full screen-md:w-auto screen-md:flex-row screen-md:flex-wrap screen-md:items-center screen-md:justify-end screen-md:gap-size-xs screen-md:[&>button]:w-auto';

const barRowClasses = 'flex items-center gap-margin-lg';

const barLogoClasses = 'flex shrink-0 items-center';

const barBodyClasses =
  'flex min-w-0 flex-1 items-center justify-center gap-size-xxs overflow-x-auto';

const barExtraClasses =
  'flex shrink-0 items-center gap-size-xs';

const footerClasses = 'mt-margin border-t border-split pt-padding-content-vertical';

function PageHeaderBackButton({
  backIcon,
  onBack,
}: {
  backIcon?: ReactNode;
  onBack?: () => void;
}) {
  return (
    <Button
      type="text"
      iconOnly
      size="md"
      aria-label="Back"
      icon={backIcon ?? <Icon name="arrow-left" />}
      onClick={onBack}
      className="-ml-padding-xxs shrink-0"
    />
  );
}

export const PageHeader = forwardRef<HTMLElement, PageHeaderProps>(
  function PageHeader(
    {
      title,
      subtitle,
      breadcrumb,
      back = false,
      onBack,
      backIcon,
      avatar,
      tags,
      logo,
      extra,
      footer,
      bordered = false,
      position = 'sticky',
      className,
      children,
      ...props
    },
    ref
  ) {
    const showBack = back || onBack !== undefined;
    const isBarLayout = logo !== undefined;

    return (
      <header
        ref={ref}
        className={cn(
          rootClasses,
          positionClasses[position],
          bordered && borderedClasses,
          className
        )}
        {...props}
      >
        {breadcrumb ? <div className="mb-margin-xs">{breadcrumb}</div> : null}

        {isBarLayout ? (
          <div className={barRowClasses}>
            <div className={barLogoClasses}>{logo}</div>
            {children ? <div className={barBodyClasses}>{children}</div> : null}
            {extra ? <div className={barExtraClasses}>{extra}</div> : null}
          </div>
        ) : (
          <>
            <div className={mainRowClasses}>
              <div className={contentClasses}>
                <div className={headingRowClasses}>
                  {showBack ? (
                    <PageHeaderBackButton backIcon={backIcon} onBack={onBack} />
                  ) : null}
                  {avatar ? (
                    <div className="shrink-0 [&_img]:size-16 [&_img]:rounded-border screen-md:[&_img]:size-20">
                      {avatar}
                    </div>
                  ) : null}
                  <div className={titleBlockClasses}>
                    {title ? (
                      typeof title === 'string' ? (
                        <H3 className={titleClasses}>{title}</H3>
                      ) : (
                        <div className={titleClasses}>{title}</div>
                      )
                    ) : null}
                    {tags ? <div className={tagsClasses}>{tags}</div> : null}
                  </div>
                </div>
                {subtitle ? (
                  typeof subtitle === 'string' ? (
                    <P type="secondary" size="md" className="max-w-prose">
                      {subtitle}
                    </P>
                  ) : (
                    subtitle
                  )
                ) : null}
              </div>

              {extra ? <div className={extraClasses}>{extra}</div> : null}
            </div>

            {footer ? <div className={footerClasses}>{footer}</div> : null}
            {children}
          </>
        )}
      </header>
    );
  }
);

export default PageHeader;
