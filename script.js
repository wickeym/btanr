(() => {
  const dossiers = document.querySelectorAll(".dossier");
  if (!dossiers.length || !("IntersectionObserver" in window)) {
    dossiers.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
  );

  dossiers.forEach((el, i) => {
    el.style.transitionDelay = `${i * 80}ms`;
    observer.observe(el);
  });
})();

(() => {
  const stage = document.querySelector("[data-reveal]");
  if (!stage) return;

  const handle = stage.querySelector(".reveal__handle");
  const min = 8;
  const max = 92;
  let dragging = false;
  let current = 58;

  const setSplit = (percent) => {
    current = Math.min(max, Math.max(min, percent));
    stage.style.setProperty("--split", `${current}%`);
    handle.setAttribute("aria-valuenow", String(Math.round(current)));
  };

  const percentFromClientX = (clientX) => {
    const rect = stage.getBoundingClientRect();
    return ((clientX - rect.left) / rect.width) * 100;
  };

  stage.addEventListener("pointerdown", (event) => {
    dragging = true;
    stage.setPointerCapture(event.pointerId);
    setSplit(percentFromClientX(event.clientX));
  });

  stage.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    setSplit(percentFromClientX(event.clientX));
  });

  const stop = () => {
    dragging = false;
  };

  stage.addEventListener("pointerup", stop);
  stage.addEventListener("pointercancel", stop);

  handle.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setSplit(current - 4);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      setSplit(current + 4);
    } else if (event.key === "Home") {
      event.preventDefault();
      setSplit(min);
    } else if (event.key === "End") {
      event.preventDefault();
      setSplit(max);
    }
  });
})();
