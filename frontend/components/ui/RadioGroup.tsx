"use client";

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  name: string;
}

export default function RadioGroup({ options, value, onChange, name }: RadioGroupProps) {
  return (
    <div className="space-y-3">
      {options.map((option) => (
        <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
          <div className="relative flex items-center justify-center">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            <div className={`
              w-5 h-5 rounded-full border-2 transition-all duration-200
              ${value === option.value ? "border-black" : "border-gray-300 group-hover:border-gray-400"}
            `}>
              {value === option.value && (
                <div className="absolute inset-0 m-1 rounded-full bg-black animate-in fade-in zoom-in-50 duration-200" />
              )}
            </div>
          </div>
          <span className="text-sm text-gray-700 select-none">{option.label}</span>
        </label>
      ))}
    </div>
  );
}
