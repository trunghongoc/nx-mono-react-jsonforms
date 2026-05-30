import {
  forwardRef,
  type ForwardRefExoticComponent,
  type HTMLAttributes,
  type ReactNode,
  type RefAttributes,
} from 'react';

export interface PageLayoutProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export interface PageLayoutHeaderProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

export interface PageLayoutBodyProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export interface PageLayoutSidebarProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export interface PageLayoutContentProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

function cn(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(' ');
}

const rootClasses = 'flex min-h-svh w-full flex-col bg-bg-layout';

const bodyClasses = 'flex min-h-0 w-full flex-1';

const headerClasses = 'shrink-0';

const sidebarClasses = 'flex h-full min-h-0 shrink-0';

const contentClasses =
  'min-h-0 min-w-0 flex-1 overflow-auto bg-bg-layout px-padding-content-horizontal py-padding-content-vertical screen-md:px-padding-content-horizontal-lg screen-md:py-padding-content-vertical-lg';

export const PageLayoutHeader = forwardRef<HTMLElement, PageLayoutHeaderProps>(
  function PageLayoutHeader({ className, children, ...props }, ref) {
    return (
      <header ref={ref} className={cn(headerClasses, className)} {...props}>
        {children}
      </header>
    );
  }
);

export const PageLayoutBody = forwardRef<HTMLDivElement, PageLayoutBodyProps>(
  function PageLayoutBody({ className, children, ...props }, ref) {
    return (
      <div ref={ref} className={cn(bodyClasses, className)} {...props}>
        {children}
      </div>
    );
  }
);

export const PageLayoutSidebar = forwardRef<HTMLDivElement, PageLayoutSidebarProps>(
  function PageLayoutSidebar({ className, children, ...props }, ref) {
    return (
      <div ref={ref} className={cn(sidebarClasses, className)} {...props}>
        {children}
      </div>
    );
  }
);

export const PageLayoutContent = forwardRef<HTMLElement, PageLayoutContentProps>(
  function PageLayoutContent({ className, children, ...props }, ref) {
    return (
      <main ref={ref} className={cn(contentClasses, className)} {...props}>
        {children}
      </main>
    );
  }
);

export type PageLayoutComponent = ForwardRefExoticComponent<
  PageLayoutProps & RefAttributes<HTMLDivElement>
> & {
  Header: typeof PageLayoutHeader;
  Body: typeof PageLayoutBody;
  Sidebar: typeof PageLayoutSidebar;
  Content: typeof PageLayoutContent;
};

const PageLayoutRoot = forwardRef<HTMLDivElement, PageLayoutProps>(
  function PageLayout({ className, children, ...props }, ref) {
    return (
      <div ref={ref} className={cn(rootClasses, className)} {...props}>
        {children}
      </div>
    );
  }
);

export const PageLayout: PageLayoutComponent = Object.assign(PageLayoutRoot, {
  Header: PageLayoutHeader,
  Body: PageLayoutBody,
  Sidebar: PageLayoutSidebar,
  Content: PageLayoutContent,
});

export default PageLayout;
