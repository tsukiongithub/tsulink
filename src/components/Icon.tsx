import {
  FontAwesomeIcon as FAI,
  FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import { twMerge } from "tailwind-merge";

interface IconProps extends FontAwesomeIconProps {
  iconSize: "sm" | "md" | "lg" | "xl";
}

const Icon = ({ iconSize, className, icon, ...props }: IconProps) => {
  return (
    <FAI
      className={twMerge(
        `${
          iconSize === "sm"
            ? "h-3 w-3"
            : iconSize === "md"
            ? "h-4 w-4"
            : iconSize === "lg"
            ? "h-5 w-5"
            : iconSize === "xl"
            ? "h-6 w-6"
            : ""
        }`,
        className
      )}
      icon={icon}
      {...props}
    />
  );
};

export default Icon;
