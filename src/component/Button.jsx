function Button({ text, onClick, className = "", type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition ${className}`}
    >
      {text}
    </button>
  );
}

export default Button;