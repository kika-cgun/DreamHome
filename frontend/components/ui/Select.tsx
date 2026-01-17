import React from 'react';

interface SelectOption {
    value: string | number;
    label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: SelectOption[];
    placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({
    label,
    error,
    options,
    placeholder,
    className = '',
    ...props
}) => {
    return (
        <div className="space-y-1">
            {label && (
                <label className="block text-sm font-medium text-slate-700">
                    {label}
                </label>
            )}
            <select
                className={`
          w-full px-4 py-3 
          bg-slate-50 border rounded-lg
          ${error ? 'border-red-500' : 'border-slate-200'}
          focus:ring-2 focus:ring-primary focus:border-transparent 
          outline-none transition-all 
          text-slate-600 text-sm
          appearance-none
          disabled:bg-slate-100 disabled:cursor-not-allowed
          ${className}
        `}
                {...props}
            >
                {placeholder && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <p className="text-xs text-red-500">{error}</p>
            )}
        </div>
    );
};
