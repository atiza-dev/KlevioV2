// Klevio — lightweight client-side behavior for lead-capture forms
// and the mobile nav toggle. No backend exists yet: submissions are
// accepted client-side and swapped for a confirmation message so the
// flow is demonstrable end to end.

document.querySelectorAll(".nav-toggle").forEach((toggle) => {
  const nav = toggle.closest(".nav");
  const links = nav && nav.querySelector(".nav-links");
  if (!links) return;

  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  links.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      links.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
});

document.querySelectorAll("form[data-lead-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const panel = form.closest(".form-panel") || form;
    const confirm = panel.parentElement.querySelector("[data-lead-confirm]");
    panel.classList.add("is-hidden");
    if (confirm) confirm.classList.remove("is-hidden");
  });
});

document.querySelectorAll("[data-gallery]").forEach((gallery) => {
  const row = gallery.querySelector(".company-types-row");
  const prevBtn = gallery.querySelector('.gallery-arrow[data-dir="prev"]');
  const nextBtn = gallery.querySelector('.gallery-arrow[data-dir="next"]');
  const dots = Array.from(gallery.querySelectorAll(".gallery-dot"));
  const tiles = Array.from(gallery.querySelectorAll(".company-type-tile"));
  if (!row || !tiles.length) return;

  function closestTileIndex() {
    const target = row.scrollLeft;
    let closest = 0;
    let closestDist = Infinity;
    tiles.forEach((tile, i) => {
      const dist = Math.abs(tile.offsetLeft - target);
      if (dist < closestDist) {
        closestDist = dist;
        closest = i;
      }
    });
    return closest;
  }

  function updateControls() {
    const index = closestTileIndex();
    dots.forEach((dot, i) => dot.classList.toggle("is-active", i === index));
    const maxScroll = row.scrollWidth - row.clientWidth;
    if (prevBtn) prevBtn.disabled = row.scrollLeft <= 2;
    if (nextBtn) nextBtn.disabled = row.scrollLeft >= maxScroll - 2;
  }

  function scrollToIndex(index) {
    const tile = tiles[Math.max(0, Math.min(tiles.length - 1, index))];
    if (tile) row.scrollTo({ left: tile.offsetLeft, behavior: "smooth" });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => scrollToIndex(closestTileIndex() - 1));
  }
  if (nextBtn) {
    nextBtn.addEventListener("click", () => scrollToIndex(closestTileIndex() + 1));
  }
  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => scrollToIndex(i));
  });

  let scrollTimeout;
  row.addEventListener("scroll", () => {
    window.clearTimeout(scrollTimeout);
    scrollTimeout = window.setTimeout(updateControls, 80);
  });

  updateControls();
});

document.querySelectorAll(".process-list").forEach((list) => {
  const items = Array.from(list.querySelectorAll(".process-item"));
  items.forEach((item) => {
    const toggle = item.querySelector(".process-item-toggle");
    if (!toggle) return;
    toggle.addEventListener("click", () => {
      const wasOpen = item.classList.contains("is-open");
      items.forEach((other) => {
        other.classList.remove("is-open");
        const otherToggle = other.querySelector(".process-item-toggle");
        if (otherToggle) otherToggle.setAttribute("aria-expanded", "false");
      });
      if (!wasOpen) {
        item.classList.add("is-open");
        toggle.setAttribute("aria-expanded", "true");
      }
    });
  });
});

document.querySelectorAll("form[data-newsletter-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const input = form.querySelector("input");
    const button = form.querySelector("button");
    if (button) {
      const original = button.textContent;
      button.textContent = "✓";
      input.disabled = true;
      setTimeout(() => {
        button.textContent = original;
        input.value = "";
        input.disabled = false;
      }, 2500);
    }
  });
});
