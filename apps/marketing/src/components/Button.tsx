import Link from "next/link";
import type { ReactNode } from "react";

type ButtonType = "primary" | "secondary";

interface ButtonProps {
  buttonType?: ButtonType;
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  href?: string;
}
const Button = ({ buttonType = "primary", children, onClick, className = "", href}: ButtonProps) => {

    const baseStyle = " text-sm font-light text-center px-7 py-2.5 hover:scale-110 duration-150 ease-in-out transition-all rounded-xl cursor-pointer font-base"

    const styles = {
        primary: "bg-[#7C3AED] hover:bg-[#6D28D9]",
        secondary: "border-[#27272A] border text-white bg-[#181521] hover:bg-[#211B30]"
    }

    const classes = `${baseStyle} ${styles[buttonType]} ${className}`;

    if (href) {
        return (
        <Link href={href} className={classes} onClick={onClick}>
            {children}
        </Link>
        );
    }
  return (
    <button type="button" className={classes} onClick={onClick}>
      {children}
    </button>
  )
}

export default Button