"use client";

import { useEffect } from "react";

export default function ClientEffects() {
  useEffect(() => {
    const cleanups = [];

    try {
      const root = document.querySelector("[data-journey-site]");
      if (!root) return () => {};

      const panels = Array.from(root.querySelectorAll("[data-journey-panel]"));
      const sectionButtons = Array.from(root.querySelectorAll("[data-journey-jump]"));
      const prevSectionBtn = root.querySelector("[data-journey-prev]");
      const nextSectionBtn = root.querySelector("[data-journey-next]");
      const labelEl = root.querySelector("[data-journey-label]");
      const activeEl = root.querySelector("[data-journey-active]");

      let currentSection = 0;

      const setSectionState = (index) => {
        if (!panels.length) return;

        const clamped = Math.max(0, Math.min(panels.length - 1, Number(index) || 0));

        panels.forEach((panel, panelIndex) => {
          if (!(panel instanceof HTMLElement)) return;
          panel.classList.remove("is-active", "is-before");
          if (panelIndex < clamped) panel.classList.add("is-before");
          if (panelIndex === clamped) panel.classList.add("is-active");
        });

        sectionButtons.forEach((btn) => {
          if (!(btn instanceof HTMLElement)) return;
          const btnIndex = Number(btn.dataset.journeyJump);
          btn.classList.toggle("is-active", btnIndex === clamped);
        });

        if (prevSectionBtn instanceof HTMLButtonElement) prevSectionBtn.disabled = clamped === 0;
        if (nextSectionBtn instanceof HTMLButtonElement) nextSectionBtn.disabled = clamped === panels.length - 1;
        if (labelEl instanceof HTMLElement) {
          labelEl.textContent = panels[clamped]?.getAttribute("data-step-title") || "";
        }
        if (activeEl instanceof HTMLElement) activeEl.textContent = String(clamped + 1);

        currentSection = clamped;
      };

      setSectionState(0);

      const onPrevSection = () => setSectionState(currentSection - 1);
      const onNextSection = () => setSectionState(currentSection + 1);

      if (prevSectionBtn instanceof HTMLButtonElement) {
        prevSectionBtn.addEventListener("click", onPrevSection);
        cleanups.push(() => prevSectionBtn.removeEventListener("click", onPrevSection));
      }

      if (nextSectionBtn instanceof HTMLButtonElement) {
        nextSectionBtn.addEventListener("click", onNextSection);
        cleanups.push(() => nextSectionBtn.removeEventListener("click", onNextSection));
      }

      sectionButtons.forEach((btn) => {
        if (!(btn instanceof HTMLButtonElement)) return;
        const handler = () => setSectionState(Number(btn.dataset.journeyJump));
        btn.addEventListener("click", handler);
        cleanups.push(() => btn.removeEventListener("click", handler));
      });

      const onKey = (event) => {
        if (event.key === "ArrowRight") setSectionState(currentSection + 1);
        if (event.key === "ArrowLeft") setSectionState(currentSection - 1);
      };

      window.addEventListener("keydown", onKey);
      cleanups.push(() => window.removeEventListener("keydown", onKey));

      const tiltCards = root.querySelectorAll("[data-tilt]");
      tiltCards.forEach((card) => {
        if (!(card instanceof HTMLElement)) return;

        const moveFn = (event) => {
          const rect = card.getBoundingClientRect();
          if (!rect.width || !rect.height) return;
          const x = event.clientX - rect.left;
          const y = event.clientY - rect.top;
          const rx = (y / rect.height - 0.5) * -2.5;
          const ry = (x / rect.width - 0.5) * 3.5;
          card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
        };

        const leaveFn = () => {
          card.style.transform = "perspective(900px) rotateX(0) rotateY(0)";
        };

        card.addEventListener("mousemove", moveFn);
        card.addEventListener("mouseleave", leaveFn);
        cleanups.push(() => {
          card.removeEventListener("mousemove", moveFn);
          card.removeEventListener("mouseleave", leaveFn);
        });
      });

      const stepRoot = root.querySelector("[data-journey-root]");
      if (stepRoot instanceof HTMLElement) {
        const stepNodes = Array.from(stepRoot.querySelectorAll("[data-step-index]"));
        const steps = stepNodes
          .map((node) => ({
            index: Number(node.getAttribute("data-step-index")),
            title: node.getAttribute("data-title") || "",
            period: node.getAttribute("data-period") || "",
            metric: node.getAttribute("data-metric") || "",
            value: node.getAttribute("data-value") || "",
            detail: node.getAttribute("data-detail") || "",
          }))
          .sort((a, b) => a.index - b.index);

        if (steps.length) {
          const titleEl2 = stepRoot.querySelector("[data-journey-title]");
          const periodEl2 = stepRoot.querySelector("[data-journey-period]");
          const metricEl2 = stepRoot.querySelector("[data-journey-metric]");
          const valueEl2 = stepRoot.querySelector("[data-journey-value]");
          const detailEl2 = stepRoot.querySelector("[data-journey-detail]");
          const indexEl2 = stepRoot.querySelector("[data-journey-index]");
          const stageEl2 = stepRoot.querySelector("[data-journey-stage]");
          const prevBtn2 = stepRoot.querySelector("[data-step-prev]");
          const nextBtn2 = stepRoot.querySelector("[data-step-next]");
          const jumpButtons2 = Array.from(stepRoot.querySelectorAll("[data-step-jump]"));

          let activeStep = 0;

          const renderStep = (index) => {
            const clamped = Math.max(0, Math.min(steps.length - 1, Number(index) || 0));
            const step = steps[clamped];
            if (!step) return;

            if (stageEl2 instanceof HTMLElement) {
              stageEl2.classList.add("is-changing");
              window.setTimeout(() => stageEl2.classList.remove("is-changing"), 120);
            }

            if (titleEl2 instanceof HTMLElement) titleEl2.textContent = step.title;
            if (periodEl2 instanceof HTMLElement) periodEl2.textContent = step.period;
            if (metricEl2 instanceof HTMLElement) metricEl2.textContent = step.metric;
            if (valueEl2 instanceof HTMLElement) valueEl2.textContent = step.value;
            if (detailEl2 instanceof HTMLElement) detailEl2.textContent = step.detail;
            if (indexEl2 instanceof HTMLElement) indexEl2.textContent = String(clamped + 1);

            jumpButtons2.forEach((btn) => {
              if (!(btn instanceof HTMLElement)) return;
              btn.classList.toggle("is-active", Number(btn.dataset.stepJump) === clamped);
            });

            if (prevBtn2 instanceof HTMLButtonElement) prevBtn2.disabled = clamped === 0;
            if (nextBtn2 instanceof HTMLButtonElement) nextBtn2.disabled = clamped === steps.length - 1;

            activeStep = clamped;
          };

          renderStep(0);

          if (prevBtn2 instanceof HTMLButtonElement) {
            const handler = () => renderStep(activeStep - 1);
            prevBtn2.addEventListener("click", handler);
            cleanups.push(() => prevBtn2.removeEventListener("click", handler));
          }

          if (nextBtn2 instanceof HTMLButtonElement) {
            const handler = () => renderStep(activeStep + 1);
            nextBtn2.addEventListener("click", handler);
            cleanups.push(() => nextBtn2.removeEventListener("click", handler));
          }

          jumpButtons2.forEach((btn) => {
            if (!(btn instanceof HTMLButtonElement)) return;
            const handler = () => renderStep(Number(btn.dataset.stepJump));
            btn.addEventListener("click", handler);
            cleanups.push(() => btn.removeEventListener("click", handler));
          });
        }
      }
    } catch (error) {
      console.error("ClientEffects failed:", error);
    }

    return () => {
      cleanups.forEach((fn) => {
        try {
          fn();
        } catch {
          // no-op cleanup guard
        }
      });
    };
  }, []);

  return null;
}