import React from "react";
import { useField } from "formik";

const InputField = ({ label, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <div>
      <label htmlFor={props.name} className="font-bold">
        {label}:
      </label>

      <input
        {...field}
        {...props}
        className="border border-gray-300 w-full rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      />

      {meta.touched && meta.error ? (
        <div className="text-red-500 text-sm mt-1">{meta.error}</div>
      ) : null}
    </div>
  );
};

export default InputField;
