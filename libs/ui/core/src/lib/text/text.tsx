import {
  createElement,
  forwardRef,
  type ComponentPropsWithoutRef,
  type HTMLAttributes,
  type LabelHTMLAttributes,
  type ReactNode,
} from 'react';

export type TextAs =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'p'
  | 'span'
  | 'div'
  | 'label';

export type TextType =
  | 'default'
  | 'secondary'
  | 'link'
  | 'success'
  | 'warning'
  | 'danger'
  | 'disabled';

export type TextSize = 'sm' | 'md' | 'lg' | 'xl';

type TextOwnProps = {
  as?: TextAs;
  type?: TextType;
  size?: TextSize;
  children?: ReactNode;
};

type NativeTextProps = Omit<
  HTMLAttributes<HTMLElement> &
    Pick<LabelHTMLAttributes<HTMLLabelElement>, 'htmlFor'>,
  keyof TextOwnProps
>;

export type TextProps = TextOwnProps & NativeTextProps;

export type HeadingProps = ComponentPropsWithoutRef<'h1'>;
export type ParagraphProps = Pick<TextOwnProps, 'type' | 'size' | 'children'> &
  ComponentPropsWithoutRef<'p'>;
export type SpanProps = Pick<TextOwnProps, 'type' | 'size' | 'children'> &
  ComponentPropsWithoutRef<'span'>;
export type LabelProps = Pick<TextOwnProps, 'type' | 'size' | 'children'> &
  ComponentPropsWithoutRef<'label'>;
export type BodyTextProps = ParagraphProps;

const headingElements = ['h1', 'h2', 'h3', 'h4', 'h5'] as const;
type HeadingElement = (typeof headingElements)[number];

function isHeading(as: TextAs): as is HeadingElement {
  return headingElements.includes(as as HeadingElement);
}

const headingClasses: Record<HeadingElement, string> = {
  h1: 'text-heading-1 text-text-heading',
  h2: 'text-heading-2 text-text-heading',
  h3: 'text-heading-3 text-text-heading',
  h4: 'text-heading-4 text-text-heading',
  h5: 'text-heading-5 text-text-heading',
};

const sizeClasses: Record<TextSize, string> = {
  sm: 'text-body-sm',
  md: 'text-body-md',
  lg: 'text-body-lg',
  xl: 'text-body-xl',
};

const typeClasses: Record<TextType, string> = {
  default: 'text-text',
  secondary: 'text-text-description',
  link: 'text-link hover:text-link-hover active:text-link-active',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-error',
  disabled: 'text-text-disabled',
};

function cn(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export const Text = forwardRef<HTMLElement, TextProps>(function Text(
  { as = 'p', type = 'default', size = 'md', className, children, ...props },
  ref
) {
  const isHeadingElement = isHeading(as);

  return createElement(
    as,
    {
      ref,
      className: cn(
        isHeadingElement
          ? headingClasses[as]
          : cn(sizeClasses[size], typeClasses[type]),
        className
      ),
      ...props,
    },
    children
  );
});

export const H1 = forwardRef<HTMLHeadingElement, HeadingProps>(function H1(
  props,
  ref
) {
  return <Text as="h1" ref={ref} {...props} />;
});

export const H2 = forwardRef<HTMLHeadingElement, HeadingProps>(function H2(
  props,
  ref
) {
  return <Text as="h2" ref={ref} {...props} />;
});

export const H3 = forwardRef<HTMLHeadingElement, HeadingProps>(function H3(
  props,
  ref
) {
  return <Text as="h3" ref={ref} {...props} />;
});

export const H4 = forwardRef<HTMLHeadingElement, HeadingProps>(function H4(
  props,
  ref
) {
  return <Text as="h4" ref={ref} {...props} />;
});

export const H5 = forwardRef<HTMLHeadingElement, HeadingProps>(function H5(
  props,
  ref
) {
  return <Text as="h5" ref={ref} {...props} />;
});

export const P = forwardRef<HTMLParagraphElement, ParagraphProps>(function P(
  props,
  ref
) {
  return <Text as="p" ref={ref} {...props} />;
});

export const Span = forwardRef<HTMLSpanElement, SpanProps>(function Span(
  props,
  ref
) {
  return <Text as="span" ref={ref} {...props} />;
});

export const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label(
  props,
  ref
) {
  return <Text as="label" ref={ref} {...props} />;
});

export default Text;
