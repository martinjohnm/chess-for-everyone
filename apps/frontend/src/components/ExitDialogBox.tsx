import { Button } from "@repo/ui/button";
import React from "react";

interface DialogBoxProps {
  title: string;
  message: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void
}

export const ExitDialogBox: React.FC<DialogBoxProps> = ({ title, message, isOpen, onClose, onSubmit }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="rounded-lg shadow-lg w-1/4 p-6 bg-slate-300">
        <h2 className="text-xl font-bold mb-4 items-center flex justify-center">{title}</h2>
        <p className="text-gray-700 mb-6 flex justify-center">{message}</p>
        <div className="flex justify-center items-center gap-1">
            <Button onclick={onSubmit} className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-700 flex items-center justify-center">
              Yes
            </Button>

            <Button onclick={onClose} className="px-4 py-1 bg-green-500 text-white rounded hover:bg-red-700 flex items-center justify-center"
                >
              No
            </Button>
        </div>
      </div>
    </div>
  );
};

