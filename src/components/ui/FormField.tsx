import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';
import { cn } from '@/lib/cn';

interface FieldProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}

/** 表单字段容器：统一标签、提示与错误文案的位置，错误同时给 `role="alert"`。 */
export function Field({ id, label, hint, error, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-medium text-ink">
        {label}
      </label>
      {hint ? (
        <p id={`${id}-hint`} className="mt-1 text-[11px] leading-5 text-muted">
          {hint}
        </p>
      ) : null}
      <div className="mt-1.5">{children}</div>
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-[11px] leading-5 text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

const control =
  'w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink transition-colors placeholder:text-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50';

const invalidControl = 'border-danger';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export function TextInput({ invalid = false, className, ...rest }: TextInputProps) {
  return (
    <input
      aria-invalid={invalid || undefined}
      className={cn(control, invalid && invalidControl, className)}
      {...rest}
    />
  );
}

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export function TextArea({ invalid = false, className, ...rest }: TextAreaProps) {
  return (
    <textarea
      aria-invalid={invalid || undefined}
      className={cn(control, 'min-h-24 resize-y leading-6', invalid && invalidControl, className)}
      {...rest}
    />
  );
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
}

export function Select({ invalid = false, className, children, ...rest }: SelectProps) {
  return (
    <select
      aria-invalid={invalid || undefined}
      className={cn(control, 'h-10 pr-8', invalid && invalidControl, className)}
      {...rest}
    >
      {children}
    </select>
  );
}
