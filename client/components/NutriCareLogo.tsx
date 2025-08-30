import { cn } from "@/lib/utils";

interface NutriCareLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function NutriCareLogo({ className, size = "md" }: NutriCareLogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <img
      src="https://cdn.builder.io/api/v1/image/assets%2Fd222f916185f47a69220f9fd1b107dd0%2Fac4d5f62872b4965899001a211f9008e?format=webp&width=800"
      alt="NutriCare Logo - Mother and Baby"
      className={cn(sizeClasses[size], "object-contain", className)}
    />
  );
}
