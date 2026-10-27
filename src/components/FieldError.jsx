const FieldError = ({ id, children }) => {
  if (!children) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-xs text-red-600">
      {children}
    </p>
  );
};

export default FieldError;
