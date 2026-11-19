import { forwardRef, useId, type SVGProps } from 'react';

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'children' | 'strokeWidth' | 'viewBox' | 'dangerouslySetInnerHTML'> {
  size?: number | string;
  /** A visible tooltip and accessible name. Omit for decorative icons. */
  title?: string;
}
type BaseProps = IconProps & { children: React.ReactNode };
export const IconBase = forwardRef<SVGSVGElement, BaseProps>(function IconBase(
  { size = 24, title, children, 'aria-label': label, 'aria-labelledby': labelledBy, 'aria-hidden': hidden, ...props }, ref,
) {
  const id = useId();
  const named = Boolean(title || label || labelledBy);
  return <svg {...props} ref={ref} xmlns="http://www.w3.org/2000/svg" width={props.width ?? size} height={props.height ?? size}
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"
    focusable="false" role={named ? 'img' : undefined} aria-hidden={hidden ?? (named ? undefined : true)}
    aria-label={label} aria-labelledby={labelledBy ?? (!label && title ? id : undefined)}>
    {title ? <title id={id}>{title}</title> : null}{children}
  </svg>;
});
