import React from "react";

type ModalVaccineProps = {
  children: React.ReactNode;
  onClose: () => void;
};

const ModalVaccine: React.FC<ModalVaccineProps> = ({ children, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <button
          className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded"
          onClick={onClose}
        >
          Close
        </button>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
};

export default ModalVaccine;
