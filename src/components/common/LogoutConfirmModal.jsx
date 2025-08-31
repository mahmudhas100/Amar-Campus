import React from 'react';
import Modal from './Modal';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

const LogoutConfirmModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-full max-w-md p-6">
        <div className="flex items-center justify-center mb-4">
          <HiOutlineExclamationCircle className="w-12 h-12 text-amber-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
          Confirm Logout
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Are you sure you want to log out? You'll need to sign in again to access your account.
        </p>
        <div className="flex justify-center space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Yes, Log Out
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default LogoutConfirmModal;
