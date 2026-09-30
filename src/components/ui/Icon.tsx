import React from "react";
import {
  PawPrint,
  BarChart2,
  Dog,
  Stethoscope,
  Syringe,
  Calendar,
  Users,
  Heart,
  MessageSquare,
  Share2,
  Star,
  AlertTriangle,
  Clock,
  Plus,
  ArrowRight,
  Camera,
  Image,
  X,
  ArrowLeft,
  Check,
} from "lucide-react";

interface IconProps {
  n: string;
  size?: number;
  color?: string;
  className?: string;
}

const Icon: React.FC<IconProps> = ({ n, size = 18, color, className = "" }) => {
  const iconProps = {
    size,
    color,
    className: `inline-block ${className}`.trim(),
  };

  switch (n) {
    case "paw":
      return <PawPrint {...iconProps} />;
    case "home":
      return <BarChart2 {...iconProps} />;
    case "profile":
      return <Dog {...iconProps} />;
    case "ai":
      return <Stethoscope {...iconProps} />;
    case "vax":
      return <Syringe {...iconProps} />;
    case "cal":
      return <Calendar {...iconProps} />;
    case "community":
      return <Users {...iconProps} />;
    case "heart":
      return <Heart {...iconProps} fill="#F05A7E" stroke="#F05A7E" />;
    case "heartO":
      return <Heart {...iconProps} />;
    case "comment":
      return <MessageSquare {...iconProps} />;
    case "share":
      return <Share2 {...iconProps} />;
    case "star":
      return <Star {...iconProps} fill="#FBBF24" stroke="#FBBF24" />;
    case "check":
      return <Check {...iconProps} className={`${iconProps.className} text-emerald-500`} strokeWidth={3} />;
    case "warn":
      return <AlertTriangle {...iconProps} />;
    case "clock":
      return <Clock {...iconProps} />;
    case "plus":
      return <Plus {...iconProps} />;
    case "arrow":
      return <ArrowRight {...iconProps} />;
    case "camera":
      return <Camera {...iconProps} />;
    case "img":
      return <Image {...iconProps} />;
    case "x":
      return <X {...iconProps} />;
    case "back":
      return <ArrowLeft {...iconProps} />;
    case "tick":
      return <Check {...iconProps} strokeWidth={3} />;
    default:
      return <span style={{ fontSize: size, color }}>{n}</span>;
  }
};

export default Icon;
