import React from "react";

interface FormInputFieldProps {
  label: string;
  name?: string;
  type?: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  icon: React.ElementType;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
}

/**
 * Mentor-style form input:
 * - bg-[#F1F5F9] / dark:bg-[#232F72]
 * - border-[#2F578A] / focus:border-[#232F72]
 * - icon positioned absolute left-3.5
 */
export function FormInputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  icon: Icon,
  required,
  disabled,
  readOnly,
}: FormInputFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-extrabold uppercase text-[#2F578A]/80 dark:text-[#F1F5F9]/50 flex items-center gap-1">
        {label}
        {required && <span className="text-rose-500">*</span>}
      </label>
      <div className="relative">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          className="w-full pl-10 pr-4 py-2.5 bg-[#F1F5F9] dark:bg-[#232F72] border border-[#2F578A]/50 dark:border-[#2F578A] focus:border-[#232F72] rounded-xl text-xs font-semibold focus:outline-none transition-all dark:text-white disabled:opacity-60 disabled:cursor-not-allowed"
        />
        <Icon className="w-4 h-4 text-[#2F578A]/80 dark:text-[#F1F5F9]/50 absolute left-3.5 top-3 pointer-events-none" />
      </div>
    </div>
  );
}
