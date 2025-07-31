interface SliderProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (val: number) => void;
}

const Slider = ({
  label,
  value,
  min = 0,
  max = 1,
  step = 0.1,
  onChange,
}: SliderProps) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium">{label}</label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-primary"
      />
      <div className="text-xs text-right">{value.toFixed(2)}</div>
    </div>
  );
};

export default Slider;
