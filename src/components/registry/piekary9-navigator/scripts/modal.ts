import type { Apartment } from "./types";
import { STATUS_LABELS, STATUS_DOT_BG } from "./types";

const $ = (id: string): HTMLElement | null => document.getElementById(id);

const formatPrice = (price: number): string =>
  new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    maximumFractionDigits: 0,
  }).format(price);

function toggleNavbar(hide: boolean): void {
  const navbars = document.querySelectorAll<HTMLElement>("header[data-header-v1]");
  navbars.forEach((navbar) => {
    if (hide) {
      navbar.style.display = "none";
    } else {
      navbar.style.display = "";
    }
  });
}

function fillModal(apt: Apartment): void {
  const extractedData = (window as any).__EXTRACTED_ROOMS || {};

  const title = $("modal-title");
  const titleMobile = $("modal-title-mobile");
  const price = $("modal-price");
  const area = $("modal-area");
  const floor = $("modal-floor");
  const mainImage = $("modal-main-image") as HTMLImageElement | null;
  const statusLabel = $("modal-status-label");
  const statusDot = $("modal-status-dot");
  const statusBadge = $("modal-status-badge");
  const priceM2 = $("modal-price-m2");
  const finish = $("modal-finish");
  const type = $("modal-type");
  const section = $("modal-section");
  const pdfBtn = $("modal-pdf-btn") as HTMLAnchorElement | null;

  const pdfData = (extractedData as any)[apt.id];
  const rooms = (apt.rooms_list && apt.rooms_list.length > 0) ? apt.rooms_list : (pdfData?.rooms_list || []);
  const displayArea = apt.area || pdfData?.area || "-";
  const displayFloor = apt.floor ?? pdfData?.floor ?? "-";

  // When we don't have the rooms table (e.g. U1/U2), avoid vertical centering
  // so the price/stats start closer to the top (less "empty" modal feel).
  const modalMainContent = $("modal-main-content");
  const hasRooms = rooms && rooms.length > 0;
  const isU1OrU2 = apt.id === "U1" || apt.id === "U2";
  const shouldAlignToTop = isU1OrU2 && !hasRooms;
  if (modalMainContent) {
    modalMainContent.classList.toggle("justify-start", shouldAlignToTop);
    modalMainContent.classList.toggle("justify-center", !shouldAlignToTop);
  }

  if (title) title.textContent = `Lokal ${apt.label}`;
  if (titleMobile) titleMobile.textContent = `Lokal ${apt.label}`;
  if (price) price.textContent = apt.price ? formatPrice(apt.price) : "Zapytaj o cenę";
  if (area) area.innerHTML = `${displayArea} <span class="text-xl font-bold text-slate-400">m²</span>`;
  if (floor) floor.textContent = displayFloor === 0 ? "Parter" : `${displayFloor}. piętro`;

  if (priceM2) priceM2.textContent = apt.price_per_m2 ? formatPrice(apt.price_per_m2).replace("zł", "zł/m²") : "-";
  if (finish) finish.textContent = apt.finish || "Do remontu";
  if (type) type.textContent = apt.type || "Mieszkalny";

  if (section) {
    const sectionLabels: Record<string, string> = {
      front: "Front (ulica)",
      front_courtyard: "Front (dziedziniec)",
      oficyna_lewa: "Oficyna Lewa",
      oficyna_prawa: "Oficyna Prawa",
      przyziemia: "Przyziemia"
    };
  section.textContent = sectionLabels[apt.section || ""] || "-";
  }

  if (pdfBtn) {
    if (apt.pdf) {
      pdfBtn.href = typeof apt.pdf === 'string' ? apt.pdf : apt.pdf.url;
      pdfBtn.classList.remove("opacity-50", "pointer-events-none");
    } else {
      pdfBtn.href = "#";
      pdfBtn.classList.add("opacity-50", "pointer-events-none");
    }
  }

  if (mainImage) {
    const firstImg = apt.images?.[0];
    const src = typeof firstImg === 'string' ? firstImg : (firstImg as any)?.url || "/images/piekary9/placeholder-plan.jpg";
    mainImage.src = src;
    mainImage.alt = `Rzut lokalu ${apt.label}`;
  }

  if (statusLabel) statusLabel.textContent = STATUS_LABELS[apt.status];
  if (statusDot) {
    statusDot.className = `w-2 h-2 rounded-full ${STATUS_DOT_BG[apt.status]}`;
  }
  if (statusBadge) {
    const badgeColors: Record<string, string> = {
      available: "bg-green-50 border-green-100",
      reservation: "bg-orange-50 border-orange-100",
      sold: "bg-red-50 border-red-100"
    };
    statusBadge.className = `flex items-center gap-2 px-2.5 py-1 rounded-full border ${badgeColors[apt.status] || "bg-slate-50 border-slate-100"}`;
  }

  // Dynamic images & Thumbnails
  const thumbsContainer = $("modal-thumbnails-container");
  if (thumbsContainer && mainImage) {
    const imgs = apt.images || [];
    // If no images, we can at least show the placeholder
    const allImages = imgs.length > 0 ? imgs : ["/images/piekary9/placeholder-plan.jpg"];

    // Show all images, but let the container handle overflow
    thumbsContainer.innerHTML = allImages.map((img, idx) => {
      const url = typeof img === 'string' ? img : (img as any).url;
      return `
        <button class="js-modal-thumb flex-shrink-0 w-20 h-14 md:w-24 md:h-16 rounded-xl border-2 ${idx === 0 ? 'border-slate-800' : 'border-transparent'} overflow-hidden bg-white shadow-sm transition-transform hover:scale-105 cursor-pointer" data-url="${url}">
          <img src="${url}" alt="Rzut ${idx + 1}" class="w-full h-full object-cover rounded-lg"/>
        </button>
      `;
    }).join("");

    // Add click events to thumbnails
    thumbsContainer.querySelectorAll(".js-modal-thumb").forEach(thumb => {
      thumb.addEventListener("click", (e) => {
        const btn = e.currentTarget as HTMLElement;
        const newUrl = btn.dataset.url;
        if (newUrl && mainImage) {
          mainImage.src = newUrl;
          // Update border
          thumbsContainer.querySelectorAll(".js-modal-thumb").forEach(b => b.classList.replace("border-slate-800", "border-transparent"));
          btn.classList.replace("border-transparent", "border-slate-800");
        }
      });
    });
  }

  const roomsContainer = $("modal-rooms-container");
  const roomsList = $("modal-rooms-list");

  if (roomsContainer && roomsList) {
    if (rooms && rooms.length > 0) {
      roomsContainer.classList.remove("hidden");

      const numArea = Number(displayArea);
    const hasValidArea = !isNaN(numArea) && displayArea !== "-";
      const areaInt = hasValidArea ? numArea.toFixed(2).split('.')[0] : displayArea;
      const areaDec = hasValidArea ? `,${numArea.toFixed(2).split('.')[1]}` : "";

      roomsList.innerHTML = `
        <div class="flex items-center justify-between py-5 px-6 bg-brand-primary/5 border-b border-brand-primary/10">
          <span class="text-[0.6rem] font-black uppercase tracking-[0.2em] text-brand-primary/60">Powierzchnia całkowita</span>
          <div class="flex items-baseline gap-1.5 text-slate-900">
            <span class="text-2xl font-black leading-none tracking-tight">${areaInt}</span>
            <span class="text-[0.8rem] font-black opacity-60">${areaDec} m²</span>
          </div>
        </div>
      ` + rooms.map((room: any, idx: number) => `
        <div class="flex items-center justify-between py-3.5 px-5 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'} border-b border-slate-50 last:border-0 group transition-all duration-300 hover:bg-slate-50">
          <div class="flex items-center gap-4">
            <span class="w-6 h-6 flex items-center justify-center rounded-lg bg-slate-100 text-[10px] font-black text-slate-400 group-hover:bg-brand-primary group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-brand-primary/20">
              ${idx + 1}
            </span>
            <span class="text-xs font-bold text-slate-700 tracking-tight group-hover:text-slate-900 transition-colors">
              ${room.name}
            </span>
          </div>
          <span class="text-xs font-black text-slate-900 tabular-nums bg-slate-100/50 py-1 px-2 rounded-md group-hover:bg-white group-hover:shadow-sm transition-all">
            ${Number(room.area).toFixed(2).replace('.', ',')} m²
          </span>
        </div>
      `).join("");
    } else {
      roomsContainer.classList.add("hidden");
    }
  }
}

export function openModal(apt: Apartment): void {
  const overlay = $("apartment-modal-overlay");
  if (!overlay) return;

  fillModal(apt);

  overlay.classList.add("opacity-100", "pointer-events-auto", "is-open");
  overlay.classList.remove("opacity-0", "pointer-events-none");
  const modal = $("apartment-modal");
  if (modal) {
    modal.classList.remove("scale-95");
    modal.classList.add("scale-100");
  }

  (overlay as any).inert = false;
  document.body.style.overflow = "hidden"; // Prevent scrolling behind modal
  toggleNavbar(true);
}

export function closeModal(): void {
  const overlay = $("apartment-modal-overlay");
  if (!overlay) return;

  overlay.classList.remove("opacity-100", "pointer-events-auto", "is-open");
  overlay.classList.add("opacity-0", "pointer-events-none");
  const modal = $("apartment-modal");
  if (modal) {
    modal.classList.add("scale-95");
    modal.classList.remove("scale-100");
  }

  (overlay as any).inert = true;
  document.body.style.overflow = "";
  toggleNavbar(false);
}

// Bind close events
export function initModal(): void {
  const overlay = $("apartment-modal-overlay");
  const closeBtnDesktop = $("modal-close-btn-desktop");
  const closeBtnMobile = $("modal-close-btn-mobile");
  
  const imageContainer = $("modal-image-container");
  const lightbox = $("modal-lightbox");
  const lightboxClose = $("lightbox-close");
  const lightboxImage = $("lightbox-image") as HTMLImageElement | null;
  const mainImage = $("modal-main-image") as HTMLImageElement | null;

  if (imageContainer && lightbox && lightboxImage && mainImage) {
    imageContainer.addEventListener("click", () => {
      lightboxImage.src = mainImage.src;
      lightbox.classList.add("opacity-100", "pointer-events-auto");
      lightbox.classList.remove("opacity-0", "pointer-events-none");
    });
  }

  const closeLightbox = () => {
    if (lightbox) {
      lightbox.classList.remove("opacity-100", "pointer-events-auto");
      lightbox.classList.add("opacity-0", "pointer-events-none");
    }
  };

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  if (closeBtnDesktop) {
    closeBtnDesktop.addEventListener("click", closeModal);
  }

  if (closeBtnMobile) {
    closeBtnMobile.addEventListener("click", closeModal);
  }

  // Close on outside click
  if (overlay) {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        closeModal();
      }
    });
  }

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (lightbox?.classList.contains("opacity-100")) {
        closeLightbox();
      } else if (overlay?.classList.contains("is-open")) {
        closeModal();
      }
    }
  });
}


