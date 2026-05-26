"use client";

import React, { useState, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

type Card = {
  id: number;
  content: React.ReactNode;
  className: string;
  thumbnail: string;
};

export function LayoutGrid({ cards }: { cards: Card[] }) {
  const [selected, setSelected] = useState<Card | null>(null);
  const [lastSelected, setLastSelected] = useState<Card | null>(null);

  const handleClick = useCallback((card: Card) => {
    setLastSelected(selected);
    setSelected(card);
  }, [selected]);

  const handleOutsideClick = useCallback(() => {
    setLastSelected(selected);
    setSelected(null);
  }, [selected]);

  return (
    <div className="w-full h-full p-4 grid grid-cols-1 md:grid-cols-3 max-w-7xl mx-auto gap-4">
      {cards.map((card) => (
        <div key={card.id} className={card.className}>
          <motion.div
            onClick={() => handleClick(card)}
            className={`relative overflow-hidden rounded-xl h-full w-full cursor-pointer ${
              selected?.id === card.id
                ? "fixed inset-0 h-1/2 w-full md:w-1/2 m-auto z-50 flex flex-col flex-wrap justify-end items-start"
                : lastSelected?.id === card.id
                ? "z-40 rounded-xl h-full w-full"
                : "rounded-xl h-full w-full"
            }`}
            layoutId={`card-${card.id}`}
          >
            {selected?.id === card.id && (
              <SelectedCard selected={selected} />
            )}
            <ImageComponent card={card} />
          </motion.div>
        </div>
      ))}

      <AnimatePresence>
        {selected && (
          <motion.div
            onClick={handleOutsideClick}
            className="absolute inset-0 bg-black/60 z-40 h-full w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ImageComponent({ card }: { card: Card }) {
  return (
    <motion.img
      layoutId={`image-${card.id}`}
      src={card.thumbnail}
      alt={`card-${card.id}`}
      className="object-cover object-center absolute inset-0 h-full w-full transition duration-200"
    />
  );
}

function SelectedCard({ selected }: { selected: Card | null }) {
  return (
    <div className="bg-transparent h-full w-full flex flex-col justify-end rounded-lg shadow-2xl relative z-[60]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        className="absolute inset-0 h-full w-full bg-black opacity-60 z-10"
      />
      <motion.div
        layoutId={`content-${selected?.id}`}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="relative px-8 pb-4 z-[70]"
      >
        {selected?.content}
      </motion.div>
    </div>
  );
}
