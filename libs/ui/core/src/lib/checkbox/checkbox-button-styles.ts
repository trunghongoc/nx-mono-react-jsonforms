export type CheckboxButtonType = 'primary' | 'default' | 'dashed';

function cn(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(' ');
}

const disabledClasses = cn(
  'has-[:disabled]:cursor-not-allowed',
  'has-[:disabled]:border-border has-[:disabled]:bg-bg-container-disabled has-[:disabled]:text-text-disabled',
  'hover:has-[:disabled]:border-border hover:has-[:disabled]:bg-bg-container-disabled hover:has-[:disabled]:text-text-disabled'
);

export const buttonVariantBaseClasses = [
  'relative inline-flex cursor-pointer items-center justify-center border font-normal transition-colors',
  'outline-none has-[:focus-visible]:outline-none has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-control-outline has-[:focus-visible]:ring-offset-2',
].join(' ');

export const buttonVariantSizeClasses = {
  sm: 'h-control-sm px-[7px] text-body-md',
  md: 'h-control px-[15px] text-body-md',
  lg: 'h-control-lg px-[15px] text-body-lg',
} as const;

/** Base when input is not :checked (enabled). */
function getUncheckedClasses(type: CheckboxButtonType, danger: boolean) {
  const borderType = type === 'dashed' ? 'dashed' : 'solid';

  if (danger) {
    return cn(
      borderType === 'dashed' ? 'border-dashed' : 'border-solid',
      'border-error bg-bg-container text-error',
      'hover:has-[:enabled:not(:checked)]:border-error-border-hover',
      'hover:has-[:enabled:not(:checked)]:text-error-hover',
      disabledClasses
    );
  }

  return cn(
    borderType === 'dashed' ? 'border-dashed' : 'border-solid',
    'border-default-border-color bg-default-bg text-text',
    'hover:has-[:enabled:not(:checked)]:border-primary-hover',
    'hover:has-[:enabled:not(:checked)]:text-primary-hover',
    disabledClasses
  );
}

/** Active when label has input:checked — palette from `danger`, shape from `type`. */
function getCheckedClasses(type: CheckboxButtonType, danger: boolean) {
  if (danger) {
    return cn(
      'has-[:checked]:border-solid',
      type === 'primary' || type === 'dashed'
        ? cn(
            'has-[:checked]:border-error has-[:checked]:bg-error has-[:checked]:text-text-light-solid',
            'hover:has-[:checked]:border-error hover:has-[:checked]:bg-error-hover hover:has-[:checked]:text-text-light-solid'
          )
        : cn(
            'has-[:checked]:border-error-active has-[:checked]:bg-bg-container has-[:checked]:text-error-active',
            'hover:has-[:checked]:border-error-hover hover:has-[:checked]:text-error-hover'
          )
    );
  }

  return cn(
    'has-[:checked]:border-solid',
    type === 'primary' || type === 'dashed'
      ? cn(
          'has-[:checked]:border-primary has-[:checked]:bg-primary has-[:checked]:text-text-light-solid',
          'hover:has-[:checked]:border-primary hover:has-[:checked]:bg-primary-hover hover:has-[:checked]:text-text-light-solid'
        )
      : cn(
          'has-[:checked]:border-primary-active has-[:checked]:bg-default-bg has-[:checked]:text-primary-active',
          'hover:has-[:checked]:border-primary-hover hover:has-[:checked]:text-primary-hover'
        )
  );
}

export function getButtonVariantUncheckedClasses(
  type: CheckboxButtonType,
  danger: boolean
) {
  return getUncheckedClasses(type, danger);
}

export function getButtonVariantCheckedClasses(
  type: CheckboxButtonType,
  danger: boolean
) {
  return getCheckedClasses(type, danger);
}
