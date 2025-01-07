import React from 'react';
import Avatar from './Avatar';

type Option = {
  id: string;
  name: string;
  imageUrl?: string;
};

type SelectFieldProps = {
  label: string;
  options: readonly Option[];
  value: string;
  onChange: (value: string) => void;
};

export default function SelectField({ label, options, value, onChange }: SelectFieldProps) {
  const selectedOption = options.find(opt => opt.id === value);

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-[#ffffff] font-medium">{label}</label>
      <div className="space-y-3">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-[#161925] text-[#ffffff] rounded-lg px-4 py-2 border border-[#22303c] focus:border-[#069494] focus:ring-1 focus:ring-[#069494] outline-none"
        >
          <option value="">Select {label}</option>
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
        {selectedOption && (
          <Avatar 
            name={selectedOption.name}
            imageUrl={selectedOption.imageUrl}
          />
        )}
      </div>
    </div>
  );
}