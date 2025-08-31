const Button = ({ children, onClick, type = 'button', disabled = false }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="py-2 px-5 bg-sky-600 text-white font-bold rounded-lg hover:bg-sky-700 disabled:bg-sky-300 disabled:cursor-not-allowed transition-colors shadow-md hover:shadow-lg"
    >
      {children}
    </button>
  );
};

export default Button;