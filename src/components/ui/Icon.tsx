import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, "ref"> {
  // Đảm bảo prop này tên là 'icon' để khớp với lệnh gọi <Icon icon={...} />
  icon: LucideIcon;
  size?: number;
  className?: string;
}

const Icon = ({
  icon: IconComponent,
  size = 16,
  className,
  ...props
}: IconProps) => {
  const sizeClasses: Record<number, string> = {
    12: "w-3 h-3",
    14: "w-3.5 h-3.5",
    16: "w-4 h-4",
    18: "w-[1.125rem] h-[1.125rem]",
    20: "w-5 h-5",
    24: "w-6 h-6",
    28: "w-7 h-7",
    32: "w-8 h-8",
    40: "w-10 h-10",
    48: "w-12 h-12",
  };

  const sizeClass = sizeClasses[size] || "w-4 h-4";

  // SAFETY CHECK: Nếu quên truyền icon hoặc import sai, return null để tránh crash App
  if (!IconComponent) {
    console.error(
      "Icon component is undefined. Check usage: <Icon icon={Name} />"
    );
    return null;
  }

  return (
    <IconComponent
      {...props}
      className={cn(sizeClass, "shrink-0", className)}
      aria-hidden="true"
    />
  );
};

export default Icon;
