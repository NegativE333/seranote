import * as React from 'react';

import { cn } from '@/lib/utils';

interface TextareaProps extends React.ComponentProps<'textarea'> {
  variant?: 'default' | 'minimal';
}

function Textarea({ className, variant = 'default', ...props }: TextareaProps) {
  const variants = {
    default: cn(
      'flex min-h-[120px] w-full rounded-lg px-4 py-3 text-base transition-all duration-200 outline-none resize-y',
      'bg-white border-2 border-gray-200',
      'placeholder:text-gray-400',
      'focus:border-purple-400 focus:ring-2 focus:ring-purple-100',
      'hover:border-gray-300',
      'text-gray-700',
      'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
    ),
    minimal: cn(
      'flex min-h-[120px] w-full rounded-lg px-4 py-3 text-base transition-all duration-200 outline-none resize-y',
      'bg-gray-50 border border-gray-200',
      'placeholder:text-gray-400',
      'focus:bg-white focus:border-purple-300 focus:ring-1 focus:ring-purple-200',
      'hover:bg-gray-100',
      'text-gray-700',
      'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
    ),
  };

  return <textarea data-slot="textarea" className={cn(variants[variant], className)} {...props} />;
}

function LabeledTextarea({
  label,
  className,
  required,
  variant = 'default',
  ...props
}: TextareaProps & { label?: string; required?: boolean }) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <Textarea variant={variant} className={className} {...props} />
    </div>
  );
}

export { Textarea, LabeledTextarea };
