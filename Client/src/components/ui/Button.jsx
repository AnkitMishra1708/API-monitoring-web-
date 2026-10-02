export default function Button({
  loading = false,
  disabled,
  children,
  className = "",
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={`h-12 w-full rounded-md bg-[#12161A] text-base font-medium text-[#EFF1EE] hover:bg-[#2a3138] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#12161A] disabled:opacity-60 ${className}`}
      {...props}
    >
      {loading ? "Please wait…" : children}
    </button>
  );
}
