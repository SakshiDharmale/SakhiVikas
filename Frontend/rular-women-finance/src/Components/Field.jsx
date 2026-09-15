export function FieldLabel({ children }) {
  return (
    <label className="field-label">
      {children}
    </label>
  );
}

export function TextField({
  label,
  error,
  ...props
}) {
  return (
    <div className="field">

      <FieldLabel>
        {label}
      </FieldLabel>

      <input
        {...props}
        className={`text-input ${
          error ? "input-error" : ""
        }`}
      />

      {error && (
        <p className="error-text">
          {error}
        </p>
      )}

    </div>
  );
}

export function PrimaryButton({
  children,
  disabled,
  ...props
}) {
  return (
    <button
      {...props}
      disabled={disabled}
      className="primary-button"
    >
      {children}
    </button>
  );
}