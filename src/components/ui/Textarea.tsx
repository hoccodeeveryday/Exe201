import React, { forwardRef, useId } from "react";

interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "id"> {
  label?: string;
  error?: boolean;
  errorMessage?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", error, errorMessage, label, ...props }, ref) => {
    const autoId = useId();
    const id = props.name ? `textarea-${props.name}` : autoId;
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-xs font-bold text-darkbg mb-2 uppercase tracking-wide">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          aria-invalid={error || undefined}
          aria-describedby={error && errorMessage ? `${id}-error` : undefined}
          className={`w-full px-4 py-3 rounded-xl border text-sm font-medium text-darkbg bg-white placeholder-gray-400 outline-none resize-none transition-all duration-200
            ${error ? "border-danger focus:ring-danger/10" : "border-gray-200 focus:border-primary focus:ring-primary/10"}
            focus:ring-4 ${className}`.trim()}
          {...props}
        />
        {error && errorMessage && (
          <p id={`${id}-error`} className="text-danger text-xs mt-1.5 ml-1 font-semibold">
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;