"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getOffers, Offer } from "./offersConfig";
import { cn } from "./ui";

interface OffersPanelProps {
    metal: string;
    assortment: string;
}

export function OffersPanel({ metal, assortment }: OffersPanelProps) {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [visible, setVisible] = useState(false);
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        // Load offers
        const data = getOffers(metal, assortment);
        setOffers(data);
        setVisible(data.length > 0);
    }, [metal, assortment]);

    if (!visible || offers.length === 0) return null;

    return (
        <div className="w-full">
            {/* Tizer / Header */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                transition={{
                    type: "spring",
                    stiffness: 120,
                    damping: 20,
                    mass: 0.8,
                }}
                className="overflow-hidden relative group rounded-b-2xl border border-zinc-100 bg-white"
            >

                <div
                    onClick={() => setExpanded(!expanded)}
                    className={cn(
                        "flex w-full cursor-pointer items-center justify-between px-6 py-5 transition-colors hover:bg-zinc-50/50 relative z-20",
                        expanded && "bg-zinc-50/50 border-b border-zinc-100"
                    )}
                >
                    <div className="flex items-center gap-2">
                        <div className="relative flex h-5 w-5 items-center justify-center">
                            <div className="h-2 w-2 rounded-full bg-blue-500 z-10" />
                            <motion.div
                                initial={{ scale: 1, opacity: 0 }}
                                animate={{
                                    scale: [1, 4],
                                    opacity: [0, 0.5, 0]
                                }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 4,
                                    repeatDelay: 1,
                                    ease: "easeOut",
                                    times: [0, 0.2, 1]
                                }}
                                className="absolute h-2 w-2 rounded-full bg-blue-400"
                            />
                        </div>
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                            Где можно купить: <span className="text-zinc-900 ml-1">{offers.length}</span>
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Chevron rotated={expanded} />
                    </div>
                </div>

                {/* Expanded Content */}
                <AnimatePresence initial={false}>
                    {expanded && (
                        <motion.div
                            key="content"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{
                                height: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
                                opacity: { duration: 0.4 }
                            }}
                            className="overflow-hidden bg-white"
                        >
                            <div className="divide-y divide-zinc-100">
                                {offers.map((offer, idx) => (
                                    <OfferItem key={idx} offer={offer} />
                                ))}
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 hover:bg-zinc-50/30 transition-colors group">
            {/* Logo + Name */}
            <div className="flex items-center gap-4 w-full sm:w-auto overflow-hidden">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-zinc-100 bg-white p-2 shadow-sm">
                    <img
                        src={offer.logo}
                        alt={offer.name}
                        className="h-full w-full object-contain grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all"
                        onError={(e) => (e.currentTarget.src = "/globe.svg")}
                    />
                </div>
                <div className="text-sm font-bold text-zinc-900">
                    {offer.name}
                </div>
            </div>

            {/* Price (Middle-Right) */}
            <div className="flex-1 flex justify-end px-2">
                <div className="text-right">
                    <span className="text-xs text-zinc-400 tracking-tight mr-1">Цена от:</span>
                    <span className="text-sm font-semibold text-zinc-700">
                        {offer.priceFrom.toLocaleString("ru-RU")}
                    </span>
                    <span className="text-xs text-zinc-400 ml-1">{offer.unit}</span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex w-full sm:w-auto items-center gap-3 justify-end shrink-0">
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
                    className="flex-1 sm:flex-none flex items-center justify-center rounded-xl bg-[#5a7f9e] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#4a6b8a] transition-all active:scale-[0.98]"
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
