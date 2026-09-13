// navigator.ts - Main orchestrator: wires pins, panel, gallery, and editor

import type { Apartment } from "./types";
import { openPanel, closePanel, gallery } from "./panel";
import { initPinEditor } from "./pin-editor";
import { initModal, openModal } from "./modal";
import { initPurchaseDrawer, openPurchaseDrawer } from "./drawer";

(function init() {
  initModal();
  initPurchaseDrawer();
  const canvas = document.getElementById("building-canvas") as HTMLElement | null;
  const zoomSlider = document.getElementById("zoom-slider") as HTMLInputElement | null;
  const zoomValue = document.getElementById("zoom-value") as HTMLElement | null;
  
  if (!canvas) return;

  // ── Zoom logic ─────────────────────────────────────────────────────
  if (zoomSlider) {
    zoomSlider.addEventListener("input", () => {
      const scale = zoomSlider.value;
      canvas.style.transformOrigin = "0 0";
      canvas.style.transform = `scale(${scale})`;
      if (zoomValue) zoomValue.textContent = `${scale}x`;
    });
  }

  const STORAGE_KEY = "piekary9_navigator_data_v1";
  const apartments: Apartment[] = JSON.parse(canvas.dataset.apartments || "[]");
  
  // Merge LocalStorage data to ensure panel reflects latest edits
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const updatedData = JSON.parse(stored);
      updatedData.forEach((saved: any) => {
        const apt = apartments.find(a => a.id === saved.id);
        if (apt) {
          if (saved.section) apt.section = saved.section;
          if (saved.x) apt.x = saved.x;
          if (saved.y) apt.y = saved.y;
          if (saved.poly) apt.poly = saved.poly;

          // Sync DOM elements for this apartment
          document.querySelectorAll(`.pin[data-id="${apt.id}"]`).forEach(pin => {
            (pin as HTMLElement).style.left = `${apt.x}%`;
            (pin as HTMLElement).style.top = `${apt.y}%`;
            (pin as HTMLElement).dataset.section = apt.section;
          });
          
          document.querySelectorAll(`.apt-poly[data-id="${apt.id}"]`).forEach(poly => {
            if (apt.poly && apt.poly.length >= 6) {
              const pts = apt.poly.reduce((acc, curr, i) => acc + curr + (i % 2 === 0 ? ',' : ' '), '').trim();
              poly.setAttribute('points', pts);
              (poly as HTMLElement).dataset.poly = JSON.stringify(apt.poly);
            }
          });
        }
      });

      // ── DOM Sync Fix: Hide pins/polys that moved to a different view ──
      document.querySelectorAll(".pins-layer").forEach(layer => {
        const layerView = (layer as HTMLElement).dataset.view; // 'front' or 'rear'
        layer.querySelectorAll(".pin, .apt-poly").forEach(el => {
          const id = (el as HTMLElement).dataset.id;
          const apt = apartments.find(a => a.id === id);
          if (apt) {
            const shouldBeInFront = apt.section === 'front';
            const isInFrontLayer = layerView === 'front';
            
            if (shouldBeInFront !== isInFrontLayer) {
              (el as HTMLElement).style.display = 'none';
            } else {
              (el as HTMLElement).style.display = '';
            }
          }
        });
      });
    } catch (e) { console.error("Nav sync error", e); }
  }

  let activePinEl: HTMLElement | null = null;

  // ── Gallery nav ────────────────────────────────────────────────────
  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    if (target.closest("#gallery-prev")) { gallery.prev(); return; }
    if (target.closest("#gallery-next")) { gallery.next(); return; }
  });

  // ── Panel close ────────────────────────────────────────────────────
  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;

    if (target.closest("#panel-close-btn")) {
      activePinEl = closePanel(activePinEl);
      return;
    }

    const panel = document.getElementById("apartment-panel");
    if (panel?.classList.contains("is-open")) {
      if (canvas.contains(target) && !panel.contains(target)) {
        activePinEl = closePanel(activePinEl);
      }
    }
  });

  // ── CTA click intercept (Table & Panels) ──────────────────────────
  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    
    const tableBtn = target.closest(".js-open-card") as HTMLButtonElement | null;
    if (tableBtn) {
      const aptId = tableBtn.dataset.id;
      const apt = apartments.find((a) => a.id === aptId);
      if (apt) {
        activePinEl = closePanel(activePinEl);
        openModal(apt);
      }
      return;
    }

    const panelBtn = target.closest("#panel-card-btn, #panel-main-btn") as HTMLAnchorElement | null;
    const modalBtn = target.closest("#modal-purchase-btn, #modal-contact-btn") as HTMLAnchorElement | null;
    const btn = panelBtn || modalBtn;

    if (!btn) return;

    if (btn.textContent?.includes("Karta lokalu")) {
      e.preventDefault();
      const aptId = activePinEl?.dataset.id;
      const apt = apartments.find((a) => a.id === aptId);
      if (apt) {
        activePinEl = closePanel(activePinEl);
        openModal(apt);
      }
    } else if (
      btn.textContent?.includes("Kup lokal") || 
      btn.textContent?.includes("Zapytaj o") ||
      btn.textContent?.includes("Powiadom")
    ) {
      e.preventDefault();
      const aptId = activePinEl?.dataset.id || (target.closest("[data-id]") as HTMLElement)?.dataset.id;
      const apt = apartments.find((a) => a.id === aptId);
      activePinEl = closePanel(activePinEl);
      openPurchaseDrawer(apt);
    }
  });

  // ── Pin Interaction (Delegated) ──────────────────────────────────
  canvas.addEventListener("click", (e) => {
    if ((window as any).__isNavigatorEditMode?.() || (window as any).__navigatorHasDragged?.()) return;

    const pin = (e.target as HTMLElement).closest(".pin") as HTMLElement | null;
    if (!pin) return;

    e.stopPropagation();

    const apt = apartments.find((a) => a.id === pin.dataset.id);
    if (!apt) return;

    if (activePinEl) activePinEl.classList.remove("pin--active");
    activePinEl = pin;
    pin.classList.add("pin--active");

    // Clear all selected polygons
    document.querySelectorAll(".apt-poly.is-selected").forEach(p => p.classList.remove("is-selected"));
    // Select current one
    const layer = pin.closest(".pins-layer");
    const area = layer?.querySelector(`.apt-poly[data-id="${apt.id}"]`);
    if (area) area.classList.add("is-selected");

    openPanel(apt);
  });
  
  canvas.addEventListener("mouseover", (e) => {
    const pin = (e.target as HTMLElement).closest(".pin") as HTMLElement | null;
    if (!pin) return;
    const aptId = pin.dataset.id;
    const layer = pin.closest(".pins-layer");
    const area = layer?.querySelector(`.apt-poly[data-id="${aptId}"]`);
    if (area) area.classList.add("is-visible");
  });

  canvas.addEventListener("mouseout", (e) => {
    const pin = (e.target as HTMLElement).closest(".pin") as HTMLElement | null;
    if (!pin) return;
    const aptId = pin.dataset.id;
    const layer = pin.closest(".pins-layer");
    const area = layer?.querySelector(`.apt-poly[data-id="${aptId}"]`);
    if (area) area.classList.remove("is-visible");
  });

  // ── Mobile Panning & Desktop Drag ───────────────────────────────
  const panningContainer = document.getElementById("navigator-panning-container");
  if (panningContainer) {
    let isDown = false;
    let startX: number;
    let scrollLeft: number;
    let scrollTop: number;
    let startY: number;

    const endDrag = () => { isDown = false; panningContainer.style.cursor = "grab"; };
    const startDrag = (e: MouseEvent | TouchEvent) => {
      if ((window as any).__isNavigatorEditMode?.()) return;

      isDown = true;
      panningContainer.style.cursor = "grabbing";
      const pageX = e instanceof MouseEvent ? e.pageX : e.touches[0].pageX;
      const pageY = e instanceof MouseEvent ? e.pageY : e.touches[0].pageY;
      
      startX = pageX - panningContainer.offsetLeft;
      startY = pageY - panningContainer.offsetTop;
      scrollLeft = panningContainer.scrollLeft;
      scrollTop = panningContainer.scrollTop;
    };
    const moveDrag = (e: MouseEvent | TouchEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const pageX = e instanceof MouseEvent ? e.pageX : e.touches[0].pageX;
      const pageY = e instanceof MouseEvent ? e.pageY : e.touches[0].pageY;
      
      const x = pageX - panningContainer.offsetLeft;
      const y = pageY - panningContainer.offsetTop;
      
      const walkX = (x - startX) * 1.5;
      const walkY = (y - startY) * 1.5;
      
      panningContainer.scrollLeft = scrollLeft - walkX;
      panningContainer.scrollTop = scrollTop - walkY;
    };

    panningContainer.addEventListener("mousedown", startDrag);
    panningContainer.addEventListener("mouseleave", endDrag);
    panningContainer.addEventListener("mouseup", endDrag);
    panningContainer.addEventListener("mousemove", moveDrag);

    const centerView = () => {
      const scrollMaxX = panningContainer.scrollWidth - panningContainer.clientWidth;
      if (scrollMaxX > 0) panningContainer.scrollLeft = scrollMaxX / 2;
    };
    window.addEventListener("load", centerView);
    setTimeout(centerView, 500);
  }

  // ── View Switching (Front/Rear) ──────────────────────────────────
  const viewBtns = document.querySelectorAll('.view-toggle-btn');
  const views = document.querySelectorAll('.navigator-view');

  viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetViewId = (btn as HTMLElement).dataset.targetView;
      if (!targetViewId) return;

      viewBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      views.forEach(v => {
        const viewId = (v as HTMLElement).dataset.viewId;
        if (viewId === targetViewId) {
          v.classList.add('active');
        } else {
          v.classList.remove('active');
        }
      });

      activePinEl = closePanel(activePinEl);
    });
  });

  // ── DEV: Pin editor ────────────────────────────────────────────────
  const isHiddenEdit = new URLSearchParams(window.location.search).get("edit") === "true";
  if (import.meta.env.DEV || isHiddenEdit) {
    initPinEditor(canvas, (active) => {
      if (active) activePinEl = closePanel(activePinEl);
    });
  }
})();


