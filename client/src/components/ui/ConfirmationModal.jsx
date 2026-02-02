import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { AlertCircle, X, HelpCircle, Trash2, Ban } from 'lucide-react';

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Are you sure?",
    message = "This action cannot be undone.",
    confirmText = "Confirm",
    cancelText = "Back",
    type = "danger", // danger, warning, info
    icon: Icon = AlertCircle
}) => {
    const typeStyles = {
        danger: {
            iconBg: 'bg-red-50',
            iconColor: 'text-red-500',
            confirmBtn: 'bg-red-500 hover:bg-red-600 shadow-red-500/20'
        },
        warning: {
            iconBg: 'bg-orange-50',
            iconColor: 'text-orange-500',
            confirmBtn: 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/20'
        },
        info: {
            iconBg: 'bg-blue-50',
            iconColor: 'text-blue-500',
            confirmBtn: 'bg-blue-500 hover:bg-blue-600 shadow-blue-500/20'
        }
    };

    const styles = typeStyles[type] || typeStyles.danger;

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-[100]" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-[40px] bg-white p-10 text-left align-middle shadow-2xl transition-all border border-slate-100 relative">
                                <button
                                    onClick={onClose}
                                    className="absolute top-8 right-8 text-slate-300 hover:text-slate-500 transition-colors p-2 hover:bg-slate-50 rounded-full"
                                >
                                    <X size={20} />
                                </button>

                                <div className="flex flex-col items-center text-center">
                                    <div className={`h-24 w-24 ${styles.iconBg} rounded-[32px] flex items-center justify-center mb-8`}>
                                        <Icon size={48} className={styles.iconColor} />
                                    </div>

                                    <Dialog.Title
                                        as="h3"
                                        className="text-3xl font-black text-slate-900 leading-tight mb-4"
                                    >
                                        {title}
                                    </Dialog.Title>

                                    <p className="text-slate-500 font-medium leading-relaxed">
                                        {message}
                                    </p>

                                    <div className="mt-10 flex gap-4 w-full">
                                        <button
                                            type="button"
                                            className="flex-1 px-8 py-5 rounded-2xl bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-100 hover:text-slate-900 transition-all focus:outline-none"
                                            onClick={onClose}
                                        >
                                            {cancelText}
                                        </button>
                                        <button
                                            type="button"
                                            className={`flex-1 px-8 py-5 rounded-2xl text-white text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl focus:outline-none ${styles.confirmBtn}`}
                                            onClick={() => {
                                                onConfirm();
                                                onClose();
                                            }}
                                        >
                                            {confirmText}
                                        </button>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default ConfirmationModal;
