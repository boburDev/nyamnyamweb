import Image, { ImageProps } from "next/image";
import { CSSProperties } from "react";
import { cn } from "@/lib/utils"; // Sizning loyihangizdagi cn funksiyasini import qiling

interface MyImageProps extends ImageProps {
  width?: number;
  height?: number;
  containerStyle?: CSSProperties;
  className?: string;
}

export default function MyImage({
  src,
  alt,
  width,
  height,
  priority = false,
  containerStyle,
  className,
  ...rest
}: MyImageProps) {
  const isFill = !width && !height;

  const baseContainerStyle: CSSProperties = {
    position: "relative",
    width: "100%",
    height: "auto",
  };
  
  if (height) {
    baseContainerStyle.height = height;
  }
  
  const finalContainerStyle = { ...baseContainerStyle, ...containerStyle };

  return (
    <div className={cn(className)} style={finalContainerStyle}>
      <Image
        src={src}
        alt={alt}
        sizes="(max-width: 768px) 100vw, 50vw"
        quality={80}
        priority={priority}
        placeholder="blur"
        fill={isFill}
        {...(!isFill && { width, height })}
        {...rest}
      />
    </div>
  );
}