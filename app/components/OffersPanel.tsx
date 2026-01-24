"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getOffers, Offer } from "./offersConfig";
import { cn } from "./ui";

interface OffersPanelProps {
    metal: string;
    assortment: string;
}

const HIDE_DURATION_DAYS = 7;
const STORAGE_KEY = "metal_calc_hide_offers_until";

export function OffersPanel({ metal, assortment }: OffersPanelProps) {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [visible, setVisible] = useState(false);
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        // 1. Check if hidden by user
        const hiddenUntil = localStorage.getItem(STORAGE_KEY);
        if (hiddenUntil) {
            const date = new Date(parseInt(hiddenUntil, 10));
            if (date > new Date()) {
                setVisible(false);
                return; // Still hidden
            } else {
                localStorage.removeItem(STORAGE_KEY); // Expired
            }
        }

        // 2. Load offers
        const data = getOffers(metal, assortment);
        setOffers(data);
        setVisible(data.length > 0);
    }, [metal, assortment]);

    const handleHide = (e: React.MouseEvent) => {
        e.stopPropagation();
        const until = new Date();
        until.setDate(until.getDate() + HIDE_DURATION_DAYS);
        localStorage.setItem(STORAGE_KEY, until.getTime().toString());
        setVisible(false);
    };

    if (!visible || offers.length === 0) return null;

    return (
        <div className="w-full">
            {/* Tizer / Header */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="overflow-hidden"
            >
                <div
                    onClick={() => setExpanded(!expanded)}
                    className={cn(
                        "flex w-full cursor-pointer items-center justify-between px-6 py-4 transition-colors hover:bg-zinc-50/50",
                        expanded && "bg-zinc-50/50 border-b border-zinc-100"
                    )}
                >
                    <div className="flex items-center gap-2 text-zinc-500">
                        <span className="text-xs font-semibold uppercase tracking-wider">
                            Поставщики этого металла: <span className="text-zinc-900">{offers.length}</span>
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Chevron rotated={expanded} />
                    </div>
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                    {expanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden bg-white"
                        >
                            <div className="divide-y divide-zinc-100">
                                {offers.map((offer, idx) => (
                                    <OfferItem key={idx} offer={offer} />
                                ))}
                            </div>
                            <div className="bg-zinc-50/50 px-6 py-3 text-center border-t border-zinc-100">
                                <button
                                    onClick={handleHide}
                                    className="text-[11px] font-medium text-zinc-400 hover:text-zinc-600 transition-colors uppercase tracking-tight"
                                >
                                    Скрыть блок предложений на {HIDE_DURATION_DAYS} дней
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}

function OfferItem({ offer }: { offer: Offer }) {
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 py-4 hover:bg-zinc-50/30 transition-colors group">
            <div className="flex items-center gap-4 w-full sm:w-auto overflow-hidden">
                {/* Logo */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-zinc-100 bg-white p-2 shadow-sm">
                    <img src={offer.logo} alt={offer.name} className="h-full w-full object-contain grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all" onError={(e) => (e.currentTarget.src = "/globe.svg")} />
                </div>
                <div className="min-w-0">
                    <div className="text-sm font-bold text-zinc-900 truncate">{offer.name}</div>
                    <div className="text-xs text-zinc-500 mt-0.5">
                        Цена от: <span className="font-bold text-zinc-800">{offer.priceFrom.toLocaleString("ru-RU")}</span> {offer.unit}
                    </div>
                </div>
            </div>

            <div className="flex w-full sm:w-auto items-center gap-3 justify-end mt-2 sm:mt-0">
                <a
                    href={`tel:${offer.phone}`}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 text-zinc-500 hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-900 transition-all"
                    title={offer.phone}
                >
                    <PhoneIcon />
                </a>
                <a
                    href={offer.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none flex items-center justify-center rounded-xl bg-zinc-900 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-zinc-800 transition-all active:scale-[0.98]"
                >
                    Перейти в каталог
                </a>
            </div>
        </div>
    );
}

function Chevron({ rotated }: { rotated: boolean }) {
    return (
        <motion.svg
            animate={{ rotate: rotated ? 180 : 0 }}
            className="h-4 w-4 text-zinc-400"
            viewBox="0 0 20 20"
            fill="none"
        >
            <path
                d="M5 7.5L10 12.5L15 7.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </motion.svg>
    );
}

function PhoneIcon() {
    return (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
        </svg>
    );
}
