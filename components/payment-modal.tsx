'use client'

import { useState } from 'react'
import { X, Lock, Check, CreditCard, ShieldCheck } from 'lucide-react'
import { Loader2 } from 'lucide-react'

interface PaymentModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    coursePrice: number
    courseTitle: string
}

export function PaymentModal({ isOpen, onClose, onSuccess, coursePrice, courseTitle }: PaymentModalProps) {
    const [isProcessing, setIsProcessing] = useState(false)
    const [step, setStep] = useState<'details' | 'processing' | 'success'>('details')
    const [cardNumber, setCardNumber] = useState('')
    const [expiry, setExpiry] = useState('')
    const [cvc, setCvc] = useState('')

    if (!isOpen) return null

    const handlePay = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsProcessing(true)
        setStep('processing')

        // Simulate payment delay
        await new Promise(resolve => setTimeout(resolve, 2000))

        setIsProcessing(false)
        setStep('success')

        // Wait a moment then close and trigger success
        setTimeout(() => {
            onSuccess()
            onClose()
        }, 1500)
    }

    // Format card number with spaces
    const handleCardInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/\D/g, '')
        val = val.substring(0, 16)
        val = val.replace(/(\d{4})/g, '$1 ').trim()
        setCardNumber(val)
    }

    // Format expiry
    const handleExpiryInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/\D/g, '')
        val = val.substring(0, 4)
        if (val.length >= 2) {
            val = val.substring(0, 2) + '/' + val.substring(2)
        }
        setExpiry(val)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200 border border-neutral-100">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[#EBE8DF] bg-[#FDFBF7]">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-emerald-600" />
                        Secure Checkout
                    </h3>
                    <button onClick={onClose} className="text-neutral-400 hover:text-black transition-colors rounded-full hover:bg-neutral-100 p-1">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    {step === 'details' && (
                        <form onSubmit={handlePay} className="space-y-6">
                            <div className="bg-neutral-50 p-4 rounded-xl border border-[#EBE8DF]">
                                <p className="text-sm text-neutral-500 mb-1">Total Amount</p>
                                <div className="flex justify-between items-end">
                                    <span className="text-2xl font-bold text-[#1A1916]">${coursePrice > 0 ? coursePrice.toFixed(2) : '0.00'}</span>
                                    <span className="text-xs text-neutral-400 font-medium uppercase tracking-wider">{courseTitle}</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-neutral-700">Card Information</label>
                                    <div className="relative">
                                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            placeholder="0000 0000 0000 0000"
                                            required
                                            value={cardNumber}
                                            onChange={handleCardInput}
                                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#EBE8DF] focus:border-black focus:ring-1 focus:ring-black outline-none transition-all placeholder:text-neutral-300 font-mono"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-neutral-700">Expiry Date</label>
                                        <input
                                            type="text"
                                            placeholder="MM/YY"
                                            required
                                            value={expiry}
                                            onChange={handleExpiryInput}
                                            className="w-full px-4 py-2.5 rounded-lg border border-[#EBE8DF] focus:border-black focus:ring-1 focus:ring-black outline-none transition-all placeholder:text-neutral-300 font-mono text-center"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-neutral-700">CVC</label>
                                        <input
                                            type="text"
                                            placeholder="123"
                                            required
                                            maxLength={3}
                                            value={cvc}
                                            onChange={(e) => setCvc(e.target.value.replace(/\D/g, ''))}
                                            className="w-full px-4 py-2.5 rounded-lg border border-[#EBE8DF] focus:border-black focus:ring-1 focus:ring-black outline-none transition-all placeholder:text-neutral-300 font-mono text-center"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-neutral-500 bg-neutral-50 p-3 rounded-lg">
                                <Lock size={12} />
                                Payments are secure and encrypted.
                            </div>

                            <button
                                type="submit"
                                disabled={isProcessing}
                                className="w-full bg-[#1A1916] text-[#FDFBF7] py-3 rounded-xl font-medium hover:bg-neutral-800 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-black/10"
                            >
                                Pay ${coursePrice > 0 ? coursePrice.toFixed(2) : '0.00'}
                            </button>
                        </form>
                    )}

                    {step === 'processing' && (
                        <div className="flex flex-col items-center justify-center py-10 space-y-4">
                            <Loader2 className="w-12 h-12 animate-spin text-black" />
                            <p className="text-neutral-500 font-medium animate-pulse">Processing secure payment...</p>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="flex flex-col items-center justify-center py-10 space-y-4 text-center">
                            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                                <Check size={32} strokeWidth={3} />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold mb-1">Payment Successful!</h4>
                                <p className="text-neutral-500 text-sm">You are now enrolled in the course.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
