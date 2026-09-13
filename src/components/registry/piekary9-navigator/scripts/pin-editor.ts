// pin-editor.ts - DEV/Hidden tool for pin calibration and perspective polygon drawing
const STORAGE_KEY = "piekary9_navigator_data_v1";

export function initPinEditor(
  canvas: HTMLElement,
  onEditModeChange: (active: boolean) => void
): void {
  let editMode = false;
  let areaMode = false;
  let dragging: HTMLElement | null = null;
  let draggingHandle: HTMLElement | null = null;
  let selectedPin: HTMLElement | null = null;
  let hasDragged = false;
  let startOffsetX = 0;
  let startOffsetY = 0;

  const editorBar = document.getElementById("dev-editor-bar") as HTMLElement | null;
  const toggleBtn = document.getElementById("toggle-edit-btn") as HTMLButtonElement | null;
  const areaBtn = document.getElementById("toggle-area-btn") as HTMLButtonElement | null;
  const copyBtn = document.getElementById("copy-json-btn") as HTMLButtonElement | null;
  const downloadBtn = document.getElementById("download-json-btn") as HTMLButtonElement | null;
  const saveBtn = document.getElementById("save-to-files-btn") as HTMLButtonElement | null;
  const resetBtn = document.getElementById("reset-editor-btn") as HTMLButtonElement | null;
  const hint = document.getElementById("edit-hint") as HTMLElement | null;
  const handlesContainer = document.getElementById("poly-handles") as HTMLElement | null;

  // ── Activation logic ──────────────────────────────────────────────
  const urlParams = new URLSearchParams(window.location.search);
  const isHiddenEdit = urlParams.get("edit") === "true";
  
  if (import.meta.env.DEV || isHiddenEdit) {
    if (editorBar) {
      editorBar.style.display = "flex";
      // Show save button only in local dev
      if (saveBtn && import.meta.env.DEV) saveBtn.style.display = "inline-flex";
    }
    loadFromLocalStorage();
  } else {
    return; // Exit if not in edit mode
  }

  function getActiveLayer(): HTMLElement | null {
    const activeView = canvas.querySelector(".navigator-view.active");
    return activeView?.querySelector(".pins-layer") as HTMLElement | null;
  }

  function updatePoly(aptId: string, poly: number[], skipSave = false) {
    const layer = getActiveLayer();
    if (!layer) return;

    let polyEl = layer.querySelector(`.apt-poly[data-id="${aptId}"]`) as SVGPolygonElement | null;
    if (!polyEl) {
      polyEl = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
      const pin = layer.querySelector(`.pin[data-id="${aptId}"]`);
      const status = pin?.getAttribute("data-status") || "available";
      polyEl.setAttribute("class", `apt-poly apt-poly--${status} is-visible`);
      polyEl.dataset.id = aptId;
      layer.querySelector(".areas-layer")?.appendChild(polyEl);
    }
    
    const pointsStr = [];
    for (let i = 0; i < poly.length; i += 2) {
      pointsStr.push(`${poly[i]},${poly[i+1]}`);
    }

    polyEl.setAttribute("points", pointsStr.join(" "));
    polyEl.classList.add("is-visible");
    polyEl.dataset.poly = JSON.stringify(poly);

    if (!skipSave) saveToLocalStorage();
  }

  function syncHandles(poly: number[]) {
    if (!handlesContainer) return;
    handlesContainer.innerHTML = "";

    for (let i = 0; i < poly.length; i += 2) {
      const handle = document.createElement("div");
      handle.className = "handle";
      handle.dataset.idx = (i / 2).toString();
      handle.style.left = `${poly[i]}%`;
      handle.style.top = `${poly[i+1]}%`;
      handlesContainer.appendChild(handle);
    }
  }

  function getAptPoly(aptId: string): number[] {
    const layer = getActiveLayer();
    const polyEl = layer?.querySelector(`.apt-poly[data-id="${aptId}"]`) as HTMLElement | null;
    if (polyEl?.dataset.poly) return JSON.parse(polyEl.dataset.poly);
    
    const pin = layer?.querySelector(`.pin[data-id="${aptId}"]`) as HTMLElement;
    const px = parseFloat(pin.style.left);
    const py = parseFloat(pin.style.top);
    return [px - 5, py - 5, px + 5, py - 5, px + 5, py + 5, px - 5, py + 5];
  }

  function updateToolbar() {
    const anyMode = editMode || areaMode;
    if (hint) hint.style.display = anyMode ? "inline" : "none";
    
    document.querySelectorAll(".pins-layer").forEach(layer => {
      (layer as HTMLElement).style.pointerEvents = anyMode ? "all" : "none";
    });

    onEditModeChange(anyMode);
    
    if (hint) {
      hint.textContent = areaMode 
        ? "Shift+Klik (Dodaj) | Alt+Klik (Usuń) | Przeciągnij" 
        : "Przesuń piny → dane zapisują się w pamięci przeglądarki";
    }
  }

  function collectData() {
    const allPins = Array.from(document.querySelectorAll(".pin")) as HTMLElement[];
    const dataMap = new Map();

    allPins.forEach((pin) => {
      const aptId = pin.dataset.id;
      if (!aptId) return;

      // Prefer visible pins or pins that have been moved/edited
      const isHidden = pin.style.display === 'none';
      if (dataMap.has(aptId) && isHidden) return;

      const layer = pin.closest(".pins-layer");
      const polyEl = layer?.querySelector(`.apt-poly[data-id="${aptId}"]`) as HTMLElement | null;
      
      dataMap.set(aptId, {
        id: aptId,
        section: pin.dataset.section,
        x: parseFloat(parseFloat(pin.style.left).toFixed(2)),
        y: parseFloat(parseFloat(pin.style.top).toFixed(2)),
        poly: polyEl?.dataset.poly ? JSON.parse(polyEl.dataset.poly) : undefined,
      });
    });

    return Array.from(dataMap.values());
  }

  function saveToLocalStorage() {
    const data = collectData();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function loadFromLocalStorage() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const data = JSON.parse(raw);
      data.forEach((item: any) => {
        const pins = document.querySelectorAll(`.pin[data-id="${item.id}"]`) as NodeListOf<HTMLElement>;
        pins.forEach(pin => {
          pin.style.left = `${item.x}%`;
          pin.style.top = `${item.y}%`;
        });
        if (item.poly) {
          updatePoly(item.id, item.poly, true);
        }
      });
    } catch (e) {
      console.error("Error loading from localStorage", e);
    }
  }

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      editMode = !editMode;
      if (editMode) {
        areaMode = false;
        if (areaBtn) areaBtn.classList.remove("active");
        canvas.classList.remove("area-mode");
        if (handlesContainer) handlesContainer.style.display = "none";
      }
      canvas.classList.toggle("edit-mode", editMode);
      toggleBtn.classList.toggle("active", editMode);
      updateToolbar();
    });
  }

  if (areaBtn) {
    areaBtn.addEventListener("click", () => {
      areaMode = !areaMode;
      if (areaMode) {
        editMode = false;
        if (toggleBtn) toggleBtn.classList.remove("active");
        canvas.classList.remove("edit-mode");
      } else {
        if (handlesContainer) handlesContainer.style.display = "none";
        document.querySelectorAll(".apt-poly.is-editing").forEach(el => el.classList.remove("is-editing"));
      }
      canvas.classList.toggle("area-mode", areaMode);
      areaBtn.classList.toggle("active", areaMode);
      updateToolbar();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (confirm("Czy na pewno chcesz usunąć wszystkie zmiany i wrócić do ustawień domyślnych?")) {
        localStorage.removeItem(STORAGE_KEY);
        window.location.reload();
      }
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      const data = collectData();
      navigator.clipboard.writeText(JSON.stringify(data, null, 2)).then(() => {
        copyBtn.textContent = "✅ Skopiowano!";
        setTimeout(() => { copyBtn.textContent = "📋 Kopiuj"; }, 2000);
      });
    });
  }

  if (downloadBtn) {
    downloadBtn.addEventListener("click", () => {
      const data = collectData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `apartments_data_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  if (saveBtn) {
    saveBtn.addEventListener("click", async () => {
      const data = collectData();
      saveBtn.disabled = true;
      saveBtn.textContent = "⏳ Zapisywanie...";
      try {
        const res = await fetch("http://localhost:3001/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          saveBtn.textContent = "✅ Zapisano pomyślnie!";
        } else {
          saveBtn.textContent = "❌ Błąd zapisu";
        }
      } catch (e) {
        saveBtn.textContent = "❌ Brak połączenia";
      } finally {
        setTimeout(() => {
          saveBtn.disabled = false;
          saveBtn.textContent = "💾 Zapisz do plików";
        }, 2500);
      }
    });
  }

  canvas.addEventListener("mousedown", (e) => {
    const target = e.target as HTMLElement;
    const pin = target.closest(".pin") as HTMLElement | null;
    const handle = target.closest(".handle") as HTMLElement | null;
    const layer = getActiveLayer();

    if (areaMode && pin) {
      e.stopPropagation();
      document.querySelectorAll(".apt-poly.is-editing").forEach(el => el.classList.remove("is-editing"));
      if (selectedPin) selectedPin.classList.remove("pin--active");
      
      selectedPin = pin;
      pin.classList.add("pin--active");
      
      const poly = getAptPoly(pin.dataset.id!);
      updatePoly(pin.dataset.id!, poly);
      
      const polyEl = layer?.querySelector(`.apt-poly[data-id="${pin.dataset.id}"]`);
      if (polyEl) polyEl.classList.add("is-editing");

      syncHandles(poly);
      if (handlesContainer) handlesContainer.style.display = "block";
      return;
    }

    if (areaMode && handle && selectedPin) {
      e.preventDefault(); e.stopPropagation();
      const idx = parseInt(handle.dataset.idx!);
      const poly = getAptPoly(selectedPin.dataset.id!);

      if (e.altKey) {
        if (poly.length > 6) { 
          poly.splice(idx * 2, 2);
          updatePoly(selectedPin.dataset.id!, poly);
          syncHandles(poly);
        }
        return;
      }

      if (e.shiftKey) {
        const nextIdx = (idx + 1) % (poly.length / 2);
        const midX = (poly[idx * 2] + poly[nextIdx * 2]) / 2;
        const midY = (poly[idx * 2 + 1] + poly[nextIdx * 2 + 1]) / 2;
        
        poly.splice((idx + 1) * 2, 0, midX, midY);
        updatePoly(selectedPin.dataset.id!, poly);
        syncHandles(poly);
        return;
      }

      draggingHandle = handle;
      const rect = canvas.getBoundingClientRect();
      startOffsetX = e.clientX - rect.left - (parseFloat(handle.style.left) / 100) * rect.width;
      startOffsetY = e.clientY - rect.top - (parseFloat(handle.style.top) / 100) * rect.height;
      return;
    }

    if (editMode && pin) {
      if (e.shiftKey) {
        e.preventDefault(); e.stopPropagation();
        const currentSection = pin.dataset.section || 'front';
        const newSection = currentSection === 'front' ? 'front_courtyard' : 'front';
        
        // Update ALL pins with this ID to keep them in sync
        document.querySelectorAll(`.pin[data-id="${pin.dataset.id}"]`).forEach(p => {
          (p as HTMLElement).dataset.section = newSection;
        });

        saveToLocalStorage();
        
        // Instant visual feedback: trigger the visibility sync logic
        document.querySelectorAll(".pins-layer").forEach(layer => {
          const layerView = (layer as HTMLElement).dataset.view;
          layer.querySelectorAll(".pin, .apt-poly").forEach(el => {
            const id = (el as HTMLElement).dataset.id;
            if (id === pin.dataset.id) {
              const shouldBeInFront = newSection === 'front';
              const isInFrontLayer = layerView === 'front';
              (el as HTMLElement).style.display = (shouldBeInFront !== isInFrontLayer) ? 'none' : '';
            }
          });
        });
        return;
      }

      e.preventDefault(); e.stopPropagation();
      dragging = pin;
      hasDragged = false;
      pin.classList.add("dragging");
      const rect = canvas.getBoundingClientRect();
      startOffsetX = e.clientX - rect.left - (parseFloat(pin.style.left) / 100) * rect.width;
      startOffsetY = e.clientY - rect.top - (parseFloat(pin.style.top) / 100) * rect.height;
    }
  });

  document.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();

    if (draggingHandle && selectedPin && areaMode) {
      const idx = parseInt(draggingHandle.dataset.idx!);
      const currentX = ((e.clientX - rect.left - startOffsetX) / rect.width) * 100;
      const currentY = ((e.clientY - rect.top - startOffsetY) / rect.height) * 100;
      const poly = getAptPoly(selectedPin.dataset.id!);
      poly[idx * 2] = parseFloat(currentX.toFixed(2));
      poly[idx * 2 + 1] = parseFloat(currentY.toFixed(2));
      updatePoly(selectedPin.dataset.id!, poly);
      
      draggingHandle.style.left = `${poly[idx * 2]}%`;
      draggingHandle.style.top = `${poly[idx * 2 + 1]}%`;
    }

    if (dragging && editMode) {
      hasDragged = true;
      const rawX = e.clientX - rect.left - startOffsetX;
      const rawY = e.clientY - rect.top - startOffsetY;
      dragging.style.left = `${Math.min(100, Math.max(0, (rawX / rect.width) * 100))}%`;
      dragging.style.top = `${Math.min(100, Math.max(0, (rawY / rect.height) * 100))}%`;
    }
  });

  document.addEventListener("mouseup", () => {
    if (draggingHandle || dragging) saveToLocalStorage();
    draggingHandle = null;
    if (dragging) {
      dragging.classList.remove("dragging");
      dragging = null;
      setTimeout(() => { hasDragged = false; }, 50);
    }
  });

  (window as any).__isNavigatorEditMode = () => editMode || areaMode;
  (window as any).__navigatorHasDragged = () => hasDragged;
}


