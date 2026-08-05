function Input({
  type,
  placeholder,
  value,
  onChange,
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}

export default Input;