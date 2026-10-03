import { forwardRef, useId, useState } from "react";

const Input = forwardRef(function Input(
  { label, error, type = "text", className = "", ...props },
  ref,
) {
  const id = useId();
  const [show, setShow] = useState(false);
  const isPw = type === "password";

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-[#12161A]"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          ref={ref}
          type={isPw && show ? "text" : type}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`h-12 w-full rounded-md border bg-white px-3.5 text-base text-[#12161A] outline-none focus:border-[#12161A] focus:ring-1 focus:ring-[#12161A] ${error ? "border-[#D4361C]" : "border-[#CDD2D6]"
            } ${isPw ? "pr-16" : ""} ${className}`}
          {...props}
        />
        {isPw && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute inset-y-0 right-0 px-3.5 text-sm font-medium text-[#59616A] hover:text-[#12161A]"
          >
            {show ? "Hide" : "Show"}
          </button>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-[#D4361C]">
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;
