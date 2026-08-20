import { CircleCheck, Clock, CircleX, Infinity as InfinityIcon } from "lucide-react";
import { COURSE_STATUS_COLORS, type CourseStatus } from "@/lib/courseUtils";

interface StatusBadgeProps {
  status: CourseStatus;
}

const STATUS_CONFIG: Record<
  CourseStatus,
  { label: string; icon: typeof CircleCheck }
> = {
  active: { label: "Activo", icon: CircleCheck },
  expiring_soon: { label: "Por vencer", icon: Clock },
  expired: { label: "Vencido", icon: CircleX },
  no_deadline: { label: "Sin fecha", icon: InfinityIcon },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const { label, icon: Icon } = STATUS_CONFIG[status];
  const color = COURSE_STATUS_COLORS[status];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium font-dmsans ${
        status === "expiring_soon" ? "animate-pulse" : ""
      }`}
      style={{
        color,
        backgroundColor: `${color}26`,
        border: `1px solid ${color}66`,
      }}
    >
      <Icon size={12} />
      {label}
    </span>
  );
}
