export default function Button({ 
  children, 
  variant = 'primary', 
  className = '', 
  icon,
  onClick,
  ...props 
}) {
  const baseStyles = "inline-flex items-center justify-center gap-2 px-4 py-2 font-medium rounded-lg transition-colors duration-200";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-blue-50 text-blue-700 hover:bg-blue-100",
    outline: "border-2 border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50",
    ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
