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
        <div className="mt-4 w-full">
            {/* Tizer / Header */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="overflow-hidden rounded-2xl bg-white ring-1 ring-zinc-200/60 shadow-sm"
            >
                <div
                    onClick={() => setExpanded(!expanded)}
                    className={cn(
                        "flex w-full cursor-pointer items-center justify-between px-4 py-3 transition-colors hover:bg-zinc-50",
                        expanded && "bg-zinc-50 border-b border-zinc-100"
                    )}
                >
                    <div className="flex items-center gap-3">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                            %
                        </span>
                        <span className="text-sm font-semibold text-zinc-800">
                            Где купить{" "}
                            <span className="text-zinc-400 font-normal">({offers.length})</span>
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        {!expanded && (
                            <button
                                onClick={handleHide}
                                className="text-[10px] font-medium text-zinc-400 hover:text-zinc-600 px-2 py-1 rounded bg-zinc-100 hover:bg-zinc-200 transition-colors mr-1"
                                title="Скрыть на 7 дней"
                            >
                                Не показывать
                            </button>
                        )}
                        <Chevron rotated={expanded} />
                    </div>
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                    {expanded && (
                        <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: "auto" }}
                            exit={{ height: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="divide-y divide-zinc-100">
                                {offers.map((offer, idx) => (
                                    <OfferItem key={idx} offer={offer} />
                                ))}
                            </div>
                            <div className="bg-zinc-50 px-4 py-2 text-center">
                                <button
                                    onClick={handleHide}
                                    className="text-xs text-zinc-400 hover:text-red-500 hover:underline transition-colors"
                                >
                                    Скрыть предложения на {HIDE_DURATION_DAYS} дней
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-4 py-3 hover:bg-zinc-50/50 transition-colors">
            <div className="flex items-center gap-3 w-full sm:w-auto overflow-hidden">
                {/* Logo Placeholder */}
                <div className="flex h-10 w-10 shrink-0 text-[8px] items-center justify-center rounded-lg border border-zinc-100 bg-white p-1">
                    <img src={offer.logo} alt={offer.name} className="h-full w-full object-contain opacity-80" onError={(e) => (e.currentTarget.src = "/globe.svg")} />
                </div>
                <div className="min-w-0">
                    <div className="text-sm font-bold text-zinc-900 truncate">{offer.name}</div>
                    <div className="text-xs text-zinc-500">
                        от <span className="font-semibold text-zinc-900">{offer.priceFrom.toLocaleString("ru-RU")}</span> {offer.unit}
                    </div>
                </div>
            </div>

            <div className="flex w-full sm:w-auto items-center gap-2 justify-end">
                <a
                    href={`tel:${offer.phone}`}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-100 transition-all"
                    title={offer.phone}
                >
                    <PhoneIcon />
                </a>
                <a
                    href={offer.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none flex items-center justify-center rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-bold text-white shadow-sm shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95"
                >
                    Перейти
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
