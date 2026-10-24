import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

import "./Buttons.css";

export default function Button({
  href = "/",
  children,
  variant = "default",
  theme = "light",
  icon,
  className = "",
  ...props
}) {
  const isDefaultVariant = variant === "default";
  const resolvedIcon = icon ?? <FiArrowRight aria-hidden="true" />;

  return (
    <Link
      href={href}
      className={`button button--${variant} button--${theme} ${className}`.trim()}
      {...props}
    >
      <span className="button__label">
        <p className="mono sm">{children}</p>
      </span>

      {isDefaultVariant && <span className="button__icon">{resolvedIcon}</span>}
    </Link>
  );
}
