import React, { useEffect, useState } from "react";
import { useModal } from "../../context/ModalContext";

const ConfirmModal = () => {
  const { modalData, closeModal } = useModal();
  const { show, message, onConfirm, onCancel } = modalData;

  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (show) {
      setAnimate(true);
    } else {
      setAnimate(false);
    }
  }, [show]);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 
        transition-opacity duration-300 
        ${animate ? "bg-black/50 opacity-100" : "bg-black/0 opacity-0"}
      `}
    >
      <div
        className={`
          bg-white p-8 rounded-lg w-96 shadow-lg transform transition-all duration-300
          ${animate ? "scale-100 opacity-100" : "scale-75 opacity-0"}
        `}
      >
        <p className="text-lg font-semibold text-gray-800">{message}</p>

        <div className="mt-6 flex justify-center gap-3">
          <button
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 cursor-pointer "
            onClick={() => {
              onCancel && onCancel();
              setAnimate(false);
              setTimeout(closeModal, 150);
            }}
          >
            Cancel
          </button>

          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
            onClick={() => {
              onConfirm && onConfirm();
              setAnimate(false);
              setTimeout(closeModal, 150);
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
