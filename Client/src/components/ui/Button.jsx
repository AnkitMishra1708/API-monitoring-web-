export default function Button({ loading, children, className = "", ...props }) {
  return (
    <button
      disabled={loading || props.disabled}
      className={`w-full rounded-md bg-zinc-900 px-4 py-2.5 text-[15px] font-semibold text-white
        hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2
        disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    >
      {loading ? "Please wait" : children}
    </button>
  );
}
