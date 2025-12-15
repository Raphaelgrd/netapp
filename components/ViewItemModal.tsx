import React from 'react';
import { X, Copy } from 'lucide-react';
import { FileSystemItem } from '../types';

interface ViewItemModalProps {
  item: FileSystemItem | null;
  onClose: () => void;
}

const ViewItemModal: React.FC<ViewItemModalProps> = ({ item, onClose }) => {
  if (!item) return null;

  const copyToClipboard = () => {
    if (item.content) {
      navigator.clipboard.writeText(item.content);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">{item.name}</h2>
          <div className="flex gap-2">
             <button onClick={copyToClipboard} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors" title="Copier">
              <Copy size={20} />
            </button>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>
        <div className="p-6 overflow-y-auto whitespace-pre-wrap font-mono text-sm text-gray-700 bg-gray-50 flex-1 rounded-b-2xl">
          {item.content}
        </div>
      </div>
    </div>
  );
};

export default ViewItemModal;