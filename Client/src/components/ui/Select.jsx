import { forwardRef } from "react";
import { fieldCls } from "../../lib/ui";

const Select = forwardRef(function Select({ label, error, children, ...props }, ref) {
  return (
    <div>
      <label htmlFor={props.name} className="mb-1.5 block text-sm font-medium">{label}</label>
      <select ref={ref} id={props.name} className={fieldCls} {...props}>{children}</select>
      {error && <p className="mt-1.5 text-sm text-red-700">{error}</p>}
    </div>
  );
});

export default Select;
