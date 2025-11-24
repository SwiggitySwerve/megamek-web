export const classNames = (
  ...classes: Array<string | undefined | null | false>
): string => classes.filter(Boolean).join(' ');


