import { cn } from "../__lib/utils";
import {
  CheckIcon,
  ClockAlertIcon,
  ClockIcon,
  PackageIcon,
  UserRoundCheckIcon,
  X,
} from "lucide-react";
import { getOrderStatusInfo, OrderStatus } from "@/features/models/OrderModel";

interface CircularProgressProps {
  status: OrderStatus;
  size?: number;
  strokeWidth?: number;
}

const orderStatusIconMap: { [key in OrderStatus]: React.ReactNode } = {
  pending_review: <ClockIcon />,
  confirmed: <UserRoundCheckIcon />,
  waiting_for_payment: <ClockAlertIcon />,
  ready_for_pickup: <PackageIcon />,
  delivered: <CheckIcon />,
  cancelled: <X />,
};

export function CircularProgress({
  status,
  size = 50,
  strokeWidth = 5,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  const { progress } = getOrderStatusInfo(status);

  const offset = circumference - (progress / 100) * circumference;

  return (
    <div
      className={cn(
        "max-w-2xs rounded-full relative flex items-center justify-center",
        progress == 100 && "bg-[#33588f]"
      )}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          className={cn(
            "text-[#bfd7ed]",
            progress == 100 && "text-transparent"
          )}
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />

        <circle
          className={cn(
            `text-[#33588f] transition-all duration-500 ease-out`,
            progress == 100 && "text-transparent"
          )}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>

      <div className="absolute flex flex-col items-center justify-center">
        <span
          aria-label="progress-emoji"
          className={cn(status == "delivered" && "text-primary-foreground")}
        >
          {orderStatusIconMap[status]}
        </span>
      </div>
    </div>
  );
}

export default CircularProgress;
