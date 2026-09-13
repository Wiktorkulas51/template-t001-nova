// drawer.ts - Logic for the Purchase/Reservation Slide-over Drawer

import type { Apartment } from "./types";

const CONTACT_ENDPOINT = "/contact.php";

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

function setPurchaseMetadata(apt?: Apartment): void {
  const form = $("purchase-form") as HTMLFormElement | null;
  if (!form) return;

  if (apt) {
    form.dataset.apartmentId = apt.id;
    form.dataset.apartmentLabel = apt.label;
    form.dataset.apartmentArea = String(apt.area ?? "");
    form.dataset.apartmentPrice = String(apt.price ?? "");
  } else {
    delete form.dataset.apartmentId;
    delete form.dataset.apartmentLabel;
    delete form.dataset.apartmentArea;
    delete form.dataset.apartmentPrice;
  }
}

export function openPurchaseDrawer(apt?: Apartment): void {
  const overlay = $("purchase-drawer-overlay");
  if (!overlay) return;

  setPurchaseMetadata(apt);

  // Fill data if apartment is provided
  if (apt) {
    const title = $("drawer-apt-title");
    const area = $("drawer-apt-area");
    const price = $("drawer-apt-price");
    const image = $("drawer-apt-image") as HTMLImageElement;

    if (title) title.textContent = apt.label;
    if (area) area.textContent = `${apt.area} m²`;
    if (price) {
      price.textContent = apt.price ? formatPrice(apt.price) : "Zapytaj o cenę";
    }
    if (image && apt.images && apt.images.length > 0) {
		const firstImage = apt.images[0];
		image.src = typeof firstImage === "string" ? firstImage : firstImage.url;
    }
  }

  // Reset state
  resetDrawerState();

  overlay.classList.add("opacity-100", "pointer-events-auto");
  overlay.classList.remove("opacity-0", "pointer-events-none");
  const drawer = $("purchase-drawer");
  if (drawer) {
    drawer.classList.remove("translate-x-full");
    drawer.classList.add("translate-x-0");
  }

  overlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  toggleNavbar(true);
}

export function closePurchaseDrawer(): void {
  const overlay = $("purchase-drawer-overlay");
  if (!overlay) return;
  
  overlay.classList.remove("opacity-100", "pointer-events-auto");
  overlay.classList.add("opacity-0", "pointer-events-none");
  const drawer = $("purchase-drawer");
  if (drawer) {
    drawer.classList.add("translate-x-full");
    drawer.classList.remove("translate-x-0");
  }

  overlay.setAttribute("aria-hidden", "true");
  
  // Only restore overflow/navbar if ApartmentModal is NOT open
  const modalOverlay = $("apartment-modal-overlay");
  if (!modalOverlay?.classList.contains("is-open")) {
    document.body.style.overflow = "";
    toggleNavbar(false);
  }
}

function resetDrawerState() {
  const form = $("purchase-form") as HTMLFormElement;
  const successState = $("drawer-success-state");
  const errorState = $("drawer-error-state");
  const footer = $("drawer-footer");
  const btnText = $("submit-btn-text");
  const btnLoader = $("submit-btn-loader");

  if (form) {
    form.reset();
    form.classList.remove("hidden");
  }
  if (successState) successState.classList.add("hidden");
  if (errorState) errorState.classList.add("hidden");
  if (footer) footer.classList.remove("hidden");
  if (btnText) btnText.textContent = "Wyślij zapytanie";
  if (btnLoader) btnLoader.classList.add("hidden");
}

async function submitPurchaseToWebhook(): Promise<void> {
  const form = $("purchase-form") as HTMLFormElement | null;
  if (!form) return;

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const btnText = $("submit-btn-text");
  const btnLoader = $("submit-btn-loader");
  const successState = $("drawer-success-state");
  const errorState = $("drawer-error-state");
  const footer = $("drawer-footer");
  const submitBtn = $("submit-purchase-btn") as HTMLButtonElement | null;

  if (errorState) errorState.classList.add("hidden");

  if (submitBtn) submitBtn.disabled = true;
  if (btnText) btnText.textContent = "Wysyłanie...";
  if (btnLoader) btnLoader.classList.remove("hidden");

  const payload = {
    source: "Zapytanie o lokal",
    form_source: "purchase",
    page_url: window.location.href,
    page_title: document.title,
    page_path: window.location.pathname,
    name: (form.elements.namedItem("name") as HTMLInputElement | null)?.value ?? "",
    phone: (form.elements.namedItem("phone") as HTMLInputElement | null)?.value ?? "",
    email: (form.elements.namedItem("email") as HTMLInputElement | null)?.value ?? "",
    message: (form.elements.namedItem("message") as HTMLTextAreaElement | null)?.value ?? "",
    consent: "on",
    apartment_id: form.dataset.apartmentId || "",
    apartment_label: form.dataset.apartmentLabel || "",
    apartment_area: form.dataset.apartmentArea || "",
    apartment_price: form.dataset.apartmentPrice || "",
  };

  try {
    const res = await fetch(CONTACT_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = (await res.json().catch(() => null)) as { status?: string; message?: string } | null;
    if (!res.ok || data?.status !== "success") {
      throw new Error(data?.message || `Wysyłka nie powiodła się (${res.status})`);
    }

    if (form) form.classList.add("hidden");
    if (footer) footer.classList.add("hidden");
    if (successState) successState.classList.remove("hidden");
    if (btnText) btnText.textContent = "Wysłano";
  } catch (_err) {
    // Keep the form visible for retry
    if (errorState) errorState.classList.remove("hidden");
    if (form) form.classList.remove("hidden");
    if (footer) footer.classList.remove("hidden");
    if (btnText) btnText.textContent = "Wyślij zapytanie";
  } finally {
    if (btnLoader) btnLoader.classList.add("hidden");
    if (submitBtn) submitBtn.disabled = false;
  }
}

export function initPurchaseDrawer(): void {
  const overlay = $("purchase-drawer-overlay");
  const closeBtn = $("drawer-close-btn");
  const submitBtn = $("submit-purchase-btn");

  if (closeBtn) {
    closeBtn.addEventListener("click", closePurchaseDrawer);
  }

  if (submitBtn) {
    submitBtn.addEventListener("click", () => {
      void submitPurchaseToWebhook();
    });
  }

  // Close on outside click
  if (overlay) {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        closePurchaseDrawer();
      }
    });
  }

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay?.classList.contains("is-open")) {
      closePurchaseDrawer();
    }
  });
}


