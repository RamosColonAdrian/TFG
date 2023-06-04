import React from "react";
import Modal from "react-modal";

interface DeleteModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onDelete: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onRequestClose,
  onDelete,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Confirm Delete"
      className="fixed inset-0 flex items-center justify-center z-50"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50"
    >
      <div className="bg-white p-6 rounded shadow">
        <h1 className="text-xl font-bold mb-4">Confirm Delete</h1>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete the user?
        </p>
        <button
          onClick={onDelete}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 mr-2"
        >
          Delete
        </button>
        <button
          onClick={onRequestClose}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
};

export default DeleteModal;
