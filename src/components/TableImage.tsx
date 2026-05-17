import { cn } from "@/lib/utils";

type TableImageShape = "circle" | "rectangle" | "square";

interface TableImageProps {
  src: string | null;
  alt: string;
  shape?: TableImageShape;
  className?: string;
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
}: TableImageProps) => {
  const imageClasses = cn(
    "object-cover bg-gray-200",
    shapeClasses[shape],
    className
  );

  if (!src) {
    return <div aria-hidden="true" className={imageClasses} />;
  }

  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className={imageClasses} />;
};

export default TableImage;
