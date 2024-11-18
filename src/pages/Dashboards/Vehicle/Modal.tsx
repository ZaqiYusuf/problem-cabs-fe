import React from "react";

const Modal = (props: any) => {
  const { isOpen, onClose, imageUrl } = props;
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center" onClick={onClose}>
      <div className="bg-white rounded-lg p-4 max-w-sm">
        <button onClick={onClose} className="absolute top-2 right-2 text-xl">
          &times;
        </button>
        <img
          src={imageUrl}
          alt="Modal Content"
          className="w-full h-auto rounded"
        />
      </div>
    </div>
  );
};

export default Modal;
