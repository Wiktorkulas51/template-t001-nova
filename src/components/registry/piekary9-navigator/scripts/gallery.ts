// gallery.ts - Gallery state machine for ApartmentPanel

export class Gallery {
  private index = 0;
  private images: (string | { url: string })[] = [];

  private get track(): HTMLElement | null {
    return document.getElementById("gallery-track");
  }
  private get dotsEl(): HTMLElement | null {
    return document.getElementById("gallery-dots");
  }
  private get prevBtn(): HTMLButtonElement | null {
    return document.getElementById("gallery-prev") as HTMLButtonElement | null;
  }
  private get nextBtn(): HTMLButtonElement | null {
    return document.getElementById("gallery-next") as HTMLButtonElement | null;
  }

  render(images: string[] = []): void {
    this.images = (images && images.length > 0) ? images : ["/images/piekary9/placeholder-plan.jpg"];
    this.index = 0;

    const track = this.track;
    const dotsEl = this.dotsEl;
    if (!track || !dotsEl) return;

    track.innerHTML = "";
    dotsEl.innerHTML = "";

    this.images.forEach((imgData, i) => {
      const src = typeof imgData === 'string' ? imgData : (imgData as any).url || "";
      const img = document.createElement("img");
      img.src = src;
      img.alt = `Zdjęcie ${i + 1}`;
      // NOTE: Do not add object-cover or padding to projection photos - the entire photo must be visible.
      img.className = "w-full h-full shrink-0 object-contain rounded-2xl";
      img.loading = "lazy";
      img.draggable = false;
      track.appendChild(img);

      const dot = document.createElement("button") as HTMLButtonElement;
      dot.className = "gallery-dot" + (i === 0 ? " active" : "");
      dot.setAttribute("aria-label", `Zdjęcie ${i + 1}`);
      dot.type = "button";
      dot.addEventListener("click", () => this.goTo(i));
      dotsEl.appendChild(dot);
    });

    this.sync();
  }

  goTo(n: number): void {
    this.index = Math.max(0, Math.min(n, this.images.length - 1));
    this.sync();
  }

  prev(): void {
    this.goTo(this.index - 1);
  }

  next(): void {
    this.goTo(this.index + 1);
  }

  private sync(): void {
    const track = this.track;
    const dotsEl = this.dotsEl;
    const prevBtn = this.prevBtn;
    const nextBtn = this.nextBtn;

    if (track) track.style.transform = `translateX(-${this.index * 100}%)`;

    if (dotsEl) {
      dotsEl.querySelectorAll(".gallery-dot").forEach((dot, i) => {
        dot.classList.toggle("active", i === this.index);
      });
    }

    if (prevBtn) prevBtn.toggleAttribute("disabled", this.index === 0);
    if (nextBtn) nextBtn.toggleAttribute("disabled", this.index === this.images.length - 1);
  }
}


