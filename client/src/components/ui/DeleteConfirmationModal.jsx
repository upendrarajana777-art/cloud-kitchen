import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Trash2, X } from 'lucide-react';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, title = "Delete Order", message = "Are you sure you want to remove this order from history? This action cannot be undone." }) => {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
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
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-[32px] bg-white p-8 text-left align-middle shadow-xl transition-all border border-slate-100 relative">
                                <button
                                    onClick={onClose}
                                    className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    <X size={24} />
                                </button>

                                <div className="flex flex-col items-center text-center">
                                    <div className="h-20 w-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                                        <Trash2 size={40} className="text-red-500" />
                                    </div>

                                    <Dialog.Title
                                        as="h3"
                                        className="text-2xl font-black text-slate-900 leading-tight mb-2"
                                    >
                                        {title}
                                    </Dialog.Title>

                                    <div className="mt-2">
                                        <p className="text-sm text-slate-500 font-medium">
                                            {message}
                                        </p>
                                    </div>

                                    <div className="mt-8 flex gap-4 w-full">
                                        <button
                                            type="button"
                                            className="flex-1 px-6 py-4 rounded-2xl bg-slate-50 text-slate-900 text-sm font-black uppercase tracking-widest hover:bg-slate-100 transition-colors focus:outline-none"
                                            onClick={onClose}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            className="flex-1 px-6 py-4 rounded-2xl bg-red-500 text-white text-sm font-black uppercase tracking-widest hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20 focus:outline-none"
                                            onClick={onConfirm}
                                        >
                                            Delete
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

export default DeleteConfirmationModal;
