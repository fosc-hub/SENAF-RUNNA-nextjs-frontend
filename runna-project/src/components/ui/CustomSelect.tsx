import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './Select'
import { Label } from './Label'

interface CustomSelectProps {
  label: string
  options: { value: string; label: string }[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function CustomSelect({ label, options, value, onChange, placeholder }: CustomSelectProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={label} className="font-bold text-gray-700">
        {label}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full bg-white border-gray-300 text-gray-900">
          <SelectValue placeholder={placeholder || `Select ${label}`} />
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-300">
          {options.map((option) => (
            <SelectItem 
              key={option.value} 
              value={option.value} 
              className="text-gray-900 hover:bg-gray-100"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}