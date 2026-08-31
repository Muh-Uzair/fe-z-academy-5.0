import type { LucideIcon } from "lucide-react";
import { cn } from "@/utils/cn";

type TableImageShape = "circle" | "rectangle" | "square";

interface TableImageProps {
  src: string | null;
  alt: string;
  shape?: TableImageShape;
  className?: string;
  fallbackIcon?: LucideIcon;
}

const shapeClasses: Record<TableImageShape, string> = {
  circle: "h-10 w-10 rounded-full",
  rectangle: "h-10 w-16 rounded-md",
  square: "h-10 w-10 rounded-md",
};

const TableImage = ({
  src,
  alt,
  shape = "square",
  className,
  fallbackIcon: FallbackIcon,
}: TableImageProps) => {
  const imageClasses = cn(
    "object-cover bg-stone-100/80",
    shapeClasses[shape],
    className,
  );

  if (!src) {
    if (FallbackIcon) {
      return (
        <div
          aria-hidden="true"
          className={cn(
            "flex items-center justify-center text-stone-300",
            imageClasses,
          )}
        >
          <FallbackIcon className="h-1/2 w-1/2" />
        </div>
      );
    }

    return <div aria-hidden="true" className={imageClasses} />;
  }

  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className={imageClasses} />;
};

export default TableImage;
