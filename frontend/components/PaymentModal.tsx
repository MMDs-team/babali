"use client";

import { Button } from "./ui/button";

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPay: () => void;
}

export default function PaymentModal({ isOpen, onClose, onPay }: PaymentModalProps) {
    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
                    <h2 className="text-xl font-bold mb-4">Tickets Reserved</h2>
                    <p className="mb-6">
                        Your tickets have been successfully reserved. Proceed to payment.
                    </p>

                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button onClick={onPay}>
                            Pay Now
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
