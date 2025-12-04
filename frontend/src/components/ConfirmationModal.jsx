import { AlertTriangle, X } from 'lucide-react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', cancelText = 'Cancel', isDanger = false }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-white/20">
                <div className="p-6 text-center">
                    <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full mb-4 ${isDanger ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600'}`}>
                        <AlertTriangle size={24} />
                    </div>

                    <h3 className="text-lg font-bold text-slate-800 mb-2">
                        {title}
                    </h3>

                    <p className="text-sm text-slate-500 mb-6">
                        {message}
                    </p>

                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium text-sm"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className={`px-4 py-2 text-white rounded-xl transition-colors font-medium text-sm shadow-sm hover:shadow-md ${isDanger
                                ? 'bg-red-600 hover:bg-red-700'
                                : 'bg-indigo-600 hover:bg-indigo-700'
                                }`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
