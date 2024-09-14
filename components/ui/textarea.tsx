import * as React from 'react';

import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        'flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = 'Textarea';

const TextareaAutosize = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, _ref) => {
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);

  const resizeTextArea = () => {
    if (!textAreaRef.current) return;

    textAreaRef.current.style.height = 'auto';
    textAreaRef.current.style.height = textAreaRef.current.scrollHeight + 'px';
  };

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    resizeTextArea();
    props.onChange?.(e);
  }

  return (
    <Textarea
      className={cn('min-h-9 resize-none overflow-hidden', className)}
      ref={textAreaRef}
      rows={1}
      {...props}
      onChange={handleChange}
    />
  );
});
TextareaAutosize.displayName = 'TextareaAutosize';

export { Textarea, TextareaAutosize };
