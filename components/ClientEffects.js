"use client";

import { useEffect } from "react";

export default function ClientEffects() {
  useEffect(() => {
    const revealItems = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealItems.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index * 70, 400)}ms`;
      observer.observe(item);
    });

    const tiltCards = document.querySelectorAll("[data-tilt]");

    const handleMouseMove = (card, event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rx = (y / rect.height - 0.5) * -5;
      const ry = (x / rect.width - 0.5) * 7;
      card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
    };

    const handleMouseLeave = (card) => {
      card.style.transform = "rotateX(0) rotateY(0)";
    };

    tiltCards.forEach((card) => {
      const moveFn = (event) => handleMouseMove(card, event);
      const leaveFn = () => handleMouseLeave(card);
      card.addEventListener("mousemove", moveFn);
      card.addEventListener("mouseleave", leaveFn);
      card.dataset.moveListener = "true";
      card.__moveFn = moveFn;
      card.__leaveFn = leaveFn;
    });

    return () => {
      revealItems.forEach((item) => observer.unobserve(item));
      observer.disconnect();
      tiltCards.forEach((card) => {
        if (card.__moveFn) {
          card.removeEventListener("mousemove", card.__moveFn);
        }
        if (card.__leaveFn) {
          card.removeEventListener("mouseleave", card.__leaveFn);
        }
      });
    };
  }, []);

  return null;
}
