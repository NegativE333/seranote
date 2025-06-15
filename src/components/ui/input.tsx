import * as React from 'react';

import { cn } from '@/lib/utils';

interface InputProps extends React.ComponentProps<'input'> {
  variant?: 'default' | 'minimal';
}

function Input({ className, type, variant = 'default', ...props }: InputProps) {
  const variants = {
    default: cn(
      'flex h-12 w-full rounded-lg px-4 py-3 text-base transition-all duration-200 outline-none',
      'bg-white border-2 border-gray-200',
      'placeholder:text-gray-400',
      'focus:border-purple-400 focus:ring-2 focus:ring-purple-100',
      'hover:border-gray-300',
      'text-gray-700',
      'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
    ),
    minimal: cn(
      'flex h-12 w-full rounded-lg px-4 py-3 text-base transition-all duration-200 outline-none',
      'bg-gray-50 border border-gray-200',
      'placeholder:text-gray-400',
      'focus:bg-white focus:border-purple-300 focus:ring-1 focus:ring-purple-200',
      'hover:bg-gray-100',
      'text-gray-700',
      'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
    ),
  };

  return (
    <input type={type} data-slot="input" className={cn(variants[variant], className)} {...props} />
  );
}

function LabeledInput({
  label,
  className,
  type,
  required,
  variant = 'default',
  ...props
}: InputProps & { label?: string; required?: boolean }) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <Input type={type} variant={variant} className={className} {...props} />
    </div>
  );
}

export { Input, LabeledInput };
