const Button = ({ children, onClick, type = 'button', disabled = false, className = '' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`py-2 px-5 bg-accent text-background-primary font-bold rounded-lg hover:bg-accent-hover disabled:bg-accent/50 disabled:cursor-not-allowed transition-colors shadow-md hover:shadow-lg ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;