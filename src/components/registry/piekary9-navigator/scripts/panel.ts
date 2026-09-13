// panel.ts - ApartmentPanel open/close/fill logic

import type { Apartment, ApartmentStatus } from "./types";
import { STATUS_LABELS, STATUS_COLOR, STATUS_DOT_BG } from "./types";
import { Gallery } from "./gallery";

const gallery = new Gallery();

const formatPrice = (price: number): string =>
  new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    maximumFractionDigits: 0,
  }).format(price);

const $ = (id: string): HTMLElement | null => document.getElementById(id);

function fillHeader(apt: Apartment): void {
  const panel = $("apartment-panel");
  const title = $("panel-title");
  const statusBadge = $("panel-status-badge");
  const statusDot = $("panel-status-dot");
  const statusLabel = $("panel-status-label");

  if (panel) panel.dataset.status = apt.status;
  if (title) title.textContent = apt.label;

  if (statusDot) {
    statusDot.className = `w-2 h-2 rounded-full shrink-0 ${STATUS_DOT_BG[apt.status]}`;
  }

  if (statusBadge) {
    statusBadge.className = `inline-flex items-center gap-1.5 text-[0.65rem] font-bold tracking-wider uppercase ${STATUS_COLOR[apt.status]}`;
  }

  if (statusLabel) statusLabel.textContent = STATUS_LABELS[apt.status];
}

function fillPrice(apt: Apartment): void {
  const container = $("panel-price-container");
  const priceEl = $("panel-price");
  if (!container || !priceEl) return;

  // Show price only when we have an actual number to display
  if (apt.price && apt.status !== "sold") {
    container.classList.remove("hidden");
    priceEl.textContent = formatPrice(apt.price);
    priceEl.className = "text-[1.35rem] font-black text-slate-900 tracking-tight leading-none";
  } else {
    // No price or sold → hide the section entirely (CTA handles the messaging)
    container.classList.add("hidden");
  }
}

function fillStats(apt: Apartment): void {
  const rooms = $("panel-rooms");
  const area = $("panel-area");
  const floor = $("panel-floor");
  const priceM2 = $("panel-price-m2");
  const sectionInline = $("panel-section-inline");

  if (rooms) rooms.textContent = String(apt.rooms);
  if (area) area.textContent = `${apt.area} m²`;
  if (floor) floor.textContent = apt.floor === 0 ? "Parter" : String(apt.floor);
  
  if (priceM2) {
    const price = apt.price_per_m2 || (apt.price && apt.area ? Math.round(apt.price / apt.area) : null);
    priceM2.textContent = price ? formatPrice(price).replace("zł", "zł/m²") : "-";
  }

  if (sectionInline) {
    const sectionLabels: Record<string, string> = {
      front: "Front",
      front_courtyard: "Front",
      oficyna_lewa: "Oficyna Lewa",
      oficyna_prawa: "Oficyna Prawa",
      przyziemia: "Przyziemia"
    };
    const label = sectionLabels[apt.section || ""] || "";
    sectionInline.textContent = label ? `/ ${label}` : "";
  }
}

function fillCta(apt: Apartment): void {
  const mainBtn = $("panel-main-btn") as HTMLAnchorElement | null;
  const cardBtn = $("panel-card-btn") as HTMLButtonElement | null;
  const pdfBtn = $("panel-pdf-btn") as HTMLAnchorElement | null;
  if (!mainBtn || !cardBtn) return;

  const PRIMARY = "block w-full text-center py-3.5 px-4 rounded-xl text-sm font-black no-underline transition-all duration-200 cursor-pointer box-border leading-snug bg-slate-900 border-[1.5px] border-slate-900 text-slate-50 hover:bg-slate-800 hover:border-slate-800 shadow-lg shadow-slate-900/10";
  const SECONDARY = "flex items-center justify-center py-2.5 px-3 rounded-lg text-[0.75rem] font-bold border-[1.5px] border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-colors";
  const MUTED = "block w-full text-center py-3.5 px-4 rounded-xl text-sm font-black no-underline transition-all duration-200 cursor-pointer box-border bg-slate-100 border-[1.5px] border-slate-200 text-slate-500 pointer-events-none";

  // Handle PDF
  if (pdfBtn) {
    if (apt.pdf) {
      pdfBtn.href = typeof apt.pdf === 'string' ? apt.pdf : apt.pdf.url;
      pdfBtn.classList.remove("opacity-50", "pointer-events-none");
    } else {
      pdfBtn.href = "#";
      pdfBtn.classList.add("opacity-50", "pointer-events-none");
    }
  }

  if (apt.status === "available") {
    mainBtn.textContent = apt.price ? "Kup lokal →" : "Zapytaj o cenę →";
    mainBtn.className = PRIMARY;
    mainBtn.href = "#kontakt";
    
    cardBtn.className = SECONDARY;
    cardBtn.disabled = false;
  } else if (apt.status === "reservation") {
    mainBtn.textContent = "Powiadom mnie →";
    mainBtn.className = PRIMARY;
    mainBtn.href = "#kontakt";

    cardBtn.className = SECONDARY;
    cardBtn.disabled = false;
  } else {
    // sold
    mainBtn.textContent = "Sprzedane";
    mainBtn.className = MUTED;
    mainBtn.href = "#";

    cardBtn.className = SECONDARY;
    cardBtn.disabled = false;
  }
}

export function openPanel(apt: Apartment): void {
  fillHeader(apt);
  fillPrice(apt);
  fillStats(apt);
  fillCta(apt);
	gallery.render(apt.images?.map((image) => typeof image === "string" ? image : image.url));

  const panel = $("apartment-panel");
  const backdrop = $("panel-backdrop");

  if (panel) {
    panel.classList.add("is-open");
    (panel as any).inert = false;
  }

  if (backdrop) {
    backdrop.classList.add("is-active");
    (backdrop as any).inert = false;
  }

  // Lock body scroll on mobile when panel is open
  if (window.innerWidth < 768) {
    document.body.style.overflow = "hidden";
  }
}

export function closePanel(activePinEl: HTMLElement | null): HTMLElement | null {
  const panel = $("apartment-panel");
  const backdrop = $("panel-backdrop");

  if (panel) {
    panel.classList.remove("is-open");
    (panel as any).inert = true;
  }

  if (backdrop) {
    backdrop.classList.remove("is-active");
    (backdrop as any).inert = true;
  }

  // Unlock body scroll
  document.body.style.overflow = "";

  if (activePinEl) activePinEl.classList.remove("pin--active");
  // Clear selected polygons
  document.querySelectorAll(".apt-poly.is-selected").forEach(p => p.classList.remove("is-selected"));
  return null;
}

// Global initialization for closing logic
document.addEventListener("DOMContentLoaded", () => {
  const backdrop = $("panel-backdrop");
  const closeBtn = $("panel-close-btn");

  backdrop?.addEventListener("click", () => {
    // We need to find the currently active pin to clear it
    const activePin = document.querySelector(".pin--active") as HTMLElement | null;
    closePanel(activePin);
  });

  closeBtn?.addEventListener("click", () => {
    const activePin = document.querySelector(".pin--active") as HTMLElement | null;
    closePanel(activePin);
  });
});

export { gallery };


