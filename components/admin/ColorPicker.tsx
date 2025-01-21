import { useState } from "react";
import { HexColorInput, HexColorPicker } from "react-colorful";

interface Props {
  value?: string;
  onPickerChange: (color: string) => void;
}

const ColorPicker = ({ value = "#aabbcc", onPickerChange }: Props) => {
  const [color, setColor] = useState(value);

  const handleChange = (newColor: string) => {
    setColor(newColor);
    onPickerChange(newColor);
  };

  return (
    <div className="flex flex-col gap-3 p-4 bg-gray-100 rounded-lg shadow-md w-60">
      <HexColorPicker color={color} onChange={handleChange} className="mx-auto" />

      <div className="flex items-center gap-2">
        <span className="text-gray-700">#</span>
        <HexColorInput 
          color={color} 
          onChange={handleChange} 
          className="border p-2 rounded-md w-full text-center shadow-sm" 
        />
      </div>
    </div>
  );
};

export default ColorPicker;
