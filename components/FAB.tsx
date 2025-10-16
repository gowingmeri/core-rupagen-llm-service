// @/components/FAB.tsx
import Link from "next/link";
import { Icon } from "@iconify/react";

interface FABProps {
  text?: string;
  icon?: string;
  route?: string;
}

const FAB = ({
  text = "Support this project",
  icon = "mdi:coffee",
  route = "/coffee",
}: FABProps) => {
  return (
    <div className="fixed top-5 right-5">
      <Link
        className="flex items-center gap-2 p-5 bg-white/5 border border-white/15 rounded-full text-white hover:bg-white/10 transition"
        href={route}
      >
        <Icon icon={icon} className="text-xl" />
        <span>{text}</span>
      </Link>
    </div>
  );
};

export default FAB;
