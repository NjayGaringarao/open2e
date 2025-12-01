import clsx from "clsx";

interface SemiCircleProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

const SemiCircleProgress = ({
  percentage,
  size = 120,
  strokeWidth = 12,
  className,
}: SemiCircleProgressProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const getColor = (percent: number) => {
    if (percent >= 85) return "stroke-red-500";
    if (percent >= 60) return "stroke-yellow-500";
    return "stroke-green-500";
  };

  const getTextColor = (percent: number) => {
    if (percent >= 85) return "text-red-500";
    if (percent >= 60) return "text-yellow-500";
    return "text-green-500";
  };

  return (
    <div
      className={clsx(
        "relative inline-flex items-center justify-center",
        className
      )}
    >
      <svg
        width={size}
        height={size / 2}
        viewBox={`0 0 ${size} ${size / 2}`}
        className="overflow-visible"
      >
        {/* Background arc */}
        <path
          d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${
            size - strokeWidth / 2
          } ${size / 2}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-uGrayLightLight opacity-20"
        />
        {/* Progress arc */}
        <path
          d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${
            size - strokeWidth / 2
          } ${size / 2}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={getColor(percentage)}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      {/* Percentage text */}
      <div
        className={clsx(
          "absolute inset-0 flex items-center justify-center",
          "text-2xl font-bold",
          getTextColor(percentage)
        )}
        style={{ paddingTop: size / 4 }}
      >
        {percentage}%
      </div>
    </div>
  );
};

export default SemiCircleProgress;
