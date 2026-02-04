"use client";

import React, { useEffect, useRef } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    onSave?: () => void;
    saveLabel?: string;
    onCancel?: () => void;
    cancelLabel?: string;
    showCloseButton?: boolean;
}

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    onSave,
    saveLabel = "Guardar",
    onCancel,
    cancelLabel = "Cancelar",
    showCloseButton = true,
}: ModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (isOpen) {
            if (!dialog.open) {
                dialog.showModal();
                document.body.style.overflow = "hidden";
            }
        } else {
            if (dialog.open) {
                dialog.close();
                document.body.style.overflow = "";
            }
        }
    }, [isOpen]);

    // Handle ESC key and backdrop click
    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        const handleCancel = (e: Event) => {
            e.preventDefault();
            onClose();
        };

        dialog.addEventListener("cancel", handleCancel);
        return () => dialog.removeEventListener("cancel", handleCancel);
    }, [onClose]);

    const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
        if (e.target === dialogRef.current) {
            onClose();
        }
    };

    return (
        <dialog
            ref={dialogRef}
            onClick={handleBackdropClick}
            className="fixed inset-0 z-50 m-auto max-w-lg w-[95%] rounded-2xl border border-slate-200 bg-white p-0 shadow-2xl backdrop:bg-slate-900/60 backdrop:backdrop-blur-sm open:flex open:flex-col outline-none transition-all duration-300"
        >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h3>
                {showCloseButton && (
                    <button
                        onClick={onClose}
                        className="group rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all duration-200"
                        aria-label="Cerrar"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="group-hover:rotate-90 transition-transform duration-300"
                        >
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Content */}
            <div className="px-8 py-6 overflow-y-auto max-h-[70vh] text-slate-600 leading-relaxed">
                {children}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-5 rounded-b-2xl">
                {onCancel && (
                    <button
                        onClick={onCancel}
                        className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-200/70 transition-all duration-200 active:scale-95"
                    >
                        {cancelLabel}
                    </button>
                )}
                <button
                    onClick={onSave}
                    className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 transition-all duration-200 active:scale-95 active:shadow-none"
                >
                    {saveLabel}
                </button>
            </div>
        </dialog>
    );
}
