import React, { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [modalData, setModalData] = useState({
    show: false,
    message: "",
    onConfirm: null,
    onCancel: null,
  });

  const openConfirm = (message, onConfirm, onCancel) => {
    setModalData({
      show: true,
      message,
      onConfirm,
      onCancel,
    });
  };

  const closeModal = () => {
    setModalData({
      ...modalData,
      show: false,
    });
  };
  return (
    <ModalContext.Provider value={{ modalData, openConfirm, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};
export const useModal = () => useContext(ModalContext);
