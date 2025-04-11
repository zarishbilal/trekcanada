"use client";

const variants = {
  default: "bg-white border border-gray-200",
  elevated: "bg-white shadow-md hover:shadow-lg",
  filled: "bg-gray-50",
};

export default function Card({
  children,
  variant = "default",
  className = "",
  ...props
}) {
  return (
    <div
      className={`
        rounded-lg p-6 transition-all
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
