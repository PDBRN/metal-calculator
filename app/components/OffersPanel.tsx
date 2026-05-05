"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "./ui";
import Image from "next/image";
import { getOffers, getCachedOffers, Offer } from "./offersConfig";

interface OffersPanelProps {
    metal: string;
    assortment: string;
}

export function OffersPanel({ metal, assortment }: OffersPanelProps) {
    const [expanded, setExpanded] = useState(false);
    
    const [offers, setOffers] = useState<Offer[]>(() => {
        return getCachedOffers(metal, assortment) || [];
    });
    const [loading, setLoading] = useState(() => {
        return !getCachedOffers(metal, assortment);
    });

    useEffect(() => {
        const cached = getCachedOffers(metal, assortment);
        if (cached) {
            setOffers(cached);
            setLoading(false);
        } else {
            setLoading(true);
            getOffers(metal, assortment).then((data) => {
                setOffers(data);
                setLoading(false);
            });
        }
    }, [metal, assortment]);

    return (
        <div className="w-full overflow-hidden rounded-b-3xl bg-white border-t border-zinc-100 ring-1 ring-zinc-100 shadow-xl shadow-zinc-200/50">
            {/* Шапка (Кнопка для раскрытия) */}
            <div
                onClick={() => {
                    setExpanded(!expanded);
                    if (typeof window !== 'undefined' && (window as any).ym) {
                        (window as any).ym(108452367, 'reachGoal', 'where_to_buy');
                    }
                }}
                className={cn(
                    "flex w-full cursor-pointer items-center justify-between px-6 py-5 transition-colors",
                    // Когда свёрнуто — hover скругляет низ вместе с контейнером
                    !expanded && "rounded-b-3xl hover:bg-zinc-50/80",
                    // Когда развёрнуто — верхний блок без нижнего скругления
                    expanded && "bg-zinc-50/60 hover:bg-zinc-50/80"
                )}
            >
                <div className="flex items-center gap-3">
                    {/* Плавная волновая анимация без мигания */}
                    <div className="relative flex items-center justify-center h-4 w-4">
                        <motion.div
                            className="absolute h-2 w-2 rounded-full bg-blue-400/50"
                            animate={{
                                scale: [1, 2.5, 2.8],
                                opacity: [0, 0.5, 0],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeOut",
                                times: [0, 0.7, 1],
                            }}
                        />
                        <motion.div
                            className="absolute h-2 w-2 rounded-full bg-blue-400/30"
                            animate={{
                                scale: [1, 2.2, 2.4],
                                opacity: [0, 0.4, 0],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeOut",
                                times: [0, 0.7, 1],
                                delay: 1,
                            }}
                        />
                        <div className="relative h-2 w-2 rounded-full bg-blue-500 shadow-sm shadow-blue-500/40" />
                    </div>
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                        Где можно купить: <span className="text-zinc-900 ml-1">{loading ? "..." : offers.length}</span>
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <Chevron rotated={expanded} />
                </div>
            </div>

            {/* Раскрывающийся контент — Apple-style плавный spring */}
            <AnimatePresence initial={false}>
                {expanded && (
                    <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                            height: {
                                duration: 0.5,
                                ease: [0.25, 1, 0.5, 1],
                            },
                            opacity: {
                                duration: 0.35,
                                ease: "easeInOut",
                            },
                        }}
                        className="overflow-hidden"
                    >
                        <div className="divide-y divide-zinc-100 border-t border-zinc-100">
                            {loading ? (
                                <div className="p-6 text-center text-sm text-zinc-400">Загрузка предложений...</div>
                            ) : offers.length === 0 ? (
                                <div className="p-6 text-center text-sm text-zinc-400">Нет предложений для данного товара</div>
                            ) : (
                                offers.map((offer, idx) => (
                                    <OfferItem key={idx} offer={offer} index={idx} />
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function OfferItem({ offer, index }: { offer: any; index: number }) {
    const isNumericPrice = !isNaN(Number(offer.priceFrom));

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.35,
                delay: index * 0.06,
                ease: [0.25, 1, 0.5, 1],
            }}
            className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 hover:bg-zinc-50/50 transition-colors duration-200 group"
        >
            {/* Логотип + Название */}
            <div className="flex items-center gap-4 w-full sm:w-auto overflow-hidden">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-zinc-100 bg-white p-2 shadow-sm">
                    <Image
                        src={offer.logo}
                        alt={offer.name}
                        width={48}
                        height={48}
                        className="h-full w-full object-contain transition-all"
                        unoptimized
                        onError={(e) => (e.currentTarget.src = "/globe.svg")}
                    />
                </div>
                <div className="text-sm font-bold text-zinc-900">
                    {offer.name}
                </div>
            </div>

            {/* Цена */}
            <div className="flex-1 flex justify-end px-2">
                <div className="text-right">
                    {isNumericPrice ? (
                        <>
                            <span className="text-xs text-zinc-400 tracking-tight mr-1">Цена от:</span>
                            <span className="text-sm font-semibold text-zinc-700">
                                {typeof offer.priceFrom === 'number'
                                    ? offer.priceFrom.toLocaleString("ru-RU")
                                    : offer.priceFrom}
                            </span>
                            <span className="text-xs text-zinc-400 ml-1">{offer.unit}</span>
                        </>
                    ) : (
                        <span className="text-sm font-semibold text-zinc-700">
                            {offer.priceFrom}
                        </span>
                    )}
                </div>
            </div>

            {/* Кнопки */}
            <div className="flex w-full sm:w-auto items-center gap-3 justify-end shrink-0">
                <a
                    href={`tel:${offer.phone}`}
                    onClick={() => {
                        if (typeof window !== 'undefined' && (window as any).ym) {
                            (window as any).ym(108452367, 'reachGoal', `call_${offer.companyKey}`);
                        }
                    }}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 text-zinc-500 hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-900 transition-all"
                    title={offer.phone}
                >
                    <PhoneIcon />
                </a>
                <a
                    href={offer.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                        if (typeof window !== 'undefined' && (window as any).ym) {
                            (window as any).ym(108452367, 'reachGoal', `go_to_catalog_${offer.companyKey}`);
                        }
                    }}
                    className="flex-1 sm:flex-none flex items-center justify-center rounded-xl bg-[#5a7f9e] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#4a6b8a] transition-all active:scale-[0.98]"
                >
                    Перейти в каталог
                </a>
            </div>
        </motion.div>
    );
}

function Chevron({ rotated }: { rotated: boolean }) {
    return (
        <motion.svg
            animate={{ rotate: rotated ? 180 : 0 }}
            transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
            className="h-4 w-4 text-zinc-400"
            viewBox="0 0 20 20"
            fill="none"
        >
            <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
    );
}

function PhoneIcon() {
    return (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
    );
}
