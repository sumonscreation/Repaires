/*
  |=====================================================================
  | Template Name: Fixumi
  | 
  | Version: 1.0.1
  |=====================================================================
  Table of Contents
    01. Disclosure helper (panel + trigger)      disclosure()
    02. Set dropdown state                       setDropdown()
    03. Close dropdowns                          closeDropdowns()
    04. Close all panels                         closeAll()
    05. Mobile nav panel & dropdowns             navPanelInit()
    06. Nav sliding indicator                    navIndicatorInit()
    07. Header search panel                      searchPanelInit()
    08. Dashboard account menu & shortcuts       userMenuInit()
    09. Language menu                            langMenuInit()
    10. Sticky header                            stickyHeaderInit()
    11. Video modal                              videoModalInit()
    12. Form modals                              modalInit()
    13. Pointer-follow glow                      glowInit()
    14. Feature panel stacks                     featurePanelsInit()
    15. Tabs (tablist)                           tabsInit()
    16. FAQ / accordion                          faqInit()
    17. Star rating                              ratingInit()
    18. Billing switch (monthly / annual)        billingSwitchInit()
    19. Swiper sliders                           swiperInit()
    20. Testimonial avatar rail                  testimonialRailInit()
    21. Technician staircase parallax            technicianParallaxInit()
    22. Footer wordmark reveal                   footerMarkInit()
    23. Scroll parallax media                    scrollParallaxInit()
    24. Tom Select                               selectInit()
    25. Flatpickr date / time pickers            pickerInit()
    26. Track card (search & track strip)        trackCardInit()
    27. Map pin filter                           mapFilterInit()
    28. Zip coverage check                       zipCheckInit()
    29. Booking calendar                         bookingCalendarInit()
    30. Store locator                            storeLocatorInit()
    31. Quantity stepper                         quantityInit()
    32. Counter animation                        counterAnimation()
    33. Counter: build wheels                    buildCounterWheels()
    34. Counter: spin wheel                      spinCounterWheel()
    35. Counter: accessible label                counterLabel()
    36. Counter: symbol cell                     counterSymbol()
    37. Counter: format value                    formatCounterValue()
    38. Counter: count decimals                  countDecimals()
    39. Counter: easing                          easeInOutSine()
    40. Counters (on view)                       counterInit()
    41. Scroll-spy                               scrollspyInit()
    42. Cart totals                              cartInit()
    43. Before / after slider                    compareInit()
    44. Dashboard sidebar                        dashSidebarInit()
    45. Service-area radius                      serviceRadiusInit()
    46. Live tracking ETA simulator              etaSimInit()
    47. ON / OFF switches                        switchInit()
    48. Working-hours day toggles                dayToggleInit()
    49. Service offerings                        serviceOffersInit()
    50. Area chart                               areaChartInit()
    51. Donut chart                              donutInit()
    52. Job requests                             jobRequestsInit()
    53. Support tickets                          ticketsInit()
    54. Outside-click & Escape dismissers        dismissersInit()
    55. Booking table (filter & actions)         bookingTableInit()
    56. Focus target                             focusTargetInit()
    57. Avatar upload preview                    avatarUploadInit()
    58. Booking list (filter & search)           bookingListInit()
    59. Counter form                             countFormInit()
    60. Generic add-row form                     rowFormInit()
    61. New booking form                         bookingFormInit()
    62. Add user form                            userFormInit()
    63. Preloader                                preloaderInit()
    64. Scroll to top                            scrollTopInit()
    65. Animate on scroll (AOS)                  aosInit()
    66. Toast                                    toast()
    67. Demo actions & forms                     demoInit()
    68. Book new service steps                   serviceStepsInit()
    69. Theme & direction switcher               settingsInit()
    70. Blog posts (new post & counts)           blogPostsInit()
    71. Blog post editor                         blogEditorInit()
    72. Roles & permissions                      rolesInit()
============================================ */
(() => {
  const desktop = matchMedia("(min-width: 992px)");
  const nav = document.getElementById("site-nav");
  const dropdowns = nav ? [...nav.querySelectorAll(".dropdown")] : [];
  const panels = [];

  /*============================================
   01. Disclosure helper (panel + trigger)
   =============================================*/
  function disclosure(panel, trigger, onOpen) {
    if (!panel || !trigger) return;

    const icons = trigger.querySelectorAll("[data-icon]");
    const set = (open) => {
      panel.toggleAttribute("data-open", open);
      trigger.setAttribute("aria-expanded", String(open));
      icons.forEach((icon) =>
        icon.classList.toggle(
          "hidden",
          (icon.dataset.icon === "open") === open,
        ),
      );
      if (open) onOpen?.();
    };

    trigger.addEventListener("click", () => {
      trigger.setAttribute("data-swapped", "");
      const open = !panel.hasAttribute("data-open");
      closeAll();
      set(open);
    });

    panels.push({
      set,
      holds: (node) => panel.contains(node) || trigger.contains(node),
    });
  }

  /*============================================
   02. Set dropdown state
   =============================================*/
  function setDropdown(item, open) {
    item.toggleAttribute("data-open", open);
    item.querySelector(".nav-link").setAttribute("aria-expanded", String(open));
  }

  /*============================================
   03. Close dropdowns
   =============================================*/
  function closeDropdowns(except) {
    dropdowns.forEach((item) => item !== except && setDropdown(item, false));
  }

  /*============================================
   04. Close all panels
   =============================================*/
  function closeAll() {
    closeDropdowns();
    panels.forEach((panel) => panel.set(false));
  }

  /*============================================
   05. Mobile nav panel & dropdowns
   =============================================*/
  function navPanelInit() {
    disclosure(nav, document.querySelector("[data-menu-toggle]"));

    dropdowns.forEach((item) => {
      const trigger = item.querySelector(".nav-link");

      trigger.addEventListener("click", (e) => {
        if (desktop.matches && trigger.tagName === "A") return;
        e.preventDefault();
        const hovered = desktop.matches && item.matches(":hover");
        const open = hovered || !item.hasAttribute("data-open");
        if (desktop.matches) closeDropdowns(item);
        setDropdown(item, open);
      });

      item.addEventListener("mouseenter", () => {
        if (!desktop.matches) return;
        closeDropdowns(item);
        setDropdown(item, true);
      });
      item.addEventListener(
        "mouseleave",
        () => desktop.matches && setDropdown(item, false),
      );
    });
  }
  /*============================================
   06. Nav sliding indicator
   =============================================*/
  function navIndicatorInit() {
    const list = nav?.querySelector(":scope > ul");
    if (!list) return;

    const bar = document.createElement("span");
    bar.className = "nav-indicator";
    bar.setAttribute("aria-hidden", "true");
    list.append(bar);

    const items = [...list.children].filter((li) =>
      li.querySelector(":scope > .nav-link"),
    );
    const visible = (li) => li.getClientRects().length > 0;
    const current = () =>
      items.find(
        (li) => visible(li) && li.querySelector('[aria-current="page"]'),
      );

    const moveTo = (li) => {
      if (!desktop.matches) return;
      if (!li) {
        bar.style.setProperty("--ind-show", "0");
        return;
      }
      const link = li.querySelector(":scope > .nav-link");
      const box = list.getBoundingClientRect();
      const rect = link.getBoundingClientRect();
      const cs = getComputedStyle(link);
      const padStart = parseFloat(cs.paddingInlineStart);
      const padEnd = parseFloat(cs.paddingInlineEnd);
      const start =
        cs.direction === "rtl" ? box.right - rect.right : rect.left - box.left;
      bar.style.setProperty("--ind-start", `${start + padStart}px`);
      bar.style.setProperty(
        "--ind-width",
        `${rect.width - padStart - padEnd}px`,
      );
      bar.style.setProperty("--ind-show", "1");
    };
    const rest = () => moveTo(current());

    items.forEach((li) => {
      li.addEventListener("mouseenter", () => moveTo(li));
      li.addEventListener("focusin", () => moveTo(li));
    });
    list.addEventListener("mouseleave", () => {
      if (!list.contains(document.activeElement)) rest();
    });
    list.addEventListener("focusout", (e) => {
      if (!list.contains(e.relatedTarget)) rest();
    });

    const settle = () => {
      bar.style.transition = "none";
      rest();
      bar.offsetWidth;
      bar.style.transition = "";
    };
    settle();
    desktop.addEventListener("change", settle);
    addEventListener("resize", rest);
    document.fonts?.ready.then(settle);
  }

  /*============================================
   07. Header search panel
   =============================================*/
  function searchPanelInit() {
    const search = document.querySelector("[data-search-panel]");
    disclosure(search, document.querySelector("[data-search-toggle]"), () =>
      search.querySelector("input").focus(),
    );
  }
  /*============================================
   08. Dashboard account menu & shortcuts
   =============================================*/
  function userMenuInit() {
    const menu = document.querySelector("[data-user-menu]");
    if (!menu) return;
    disclosure(menu, document.querySelector("[data-user-menu-toggle]"));

    const mac = /Mac|iPhone|iPad/.test(navigator.platform);
    const links = [...menu.querySelectorAll("[data-shortcut]")];

    if (!mac) {
      links.forEach((link) => {
        const kbd = link.querySelector("kbd");
        if (kbd) kbd.textContent = kbd.textContent.replace("⌘", "Ctrl+");
        link.setAttribute(
          "aria-keyshortcuts",
          link.getAttribute("aria-keyshortcuts").replace("Meta", "Control"),
        );
      });
    }

    document.addEventListener("keydown", (e) => {
      if (!(mac ? e.metaKey : e.ctrlKey) || e.altKey) return;
      const combo = `${e.shiftKey ? "shift+" : ""}${e.key.toLowerCase()}`;
      const link = links.find((l) => l.dataset.shortcut === combo);
      if (!link) return;
      e.preventDefault();
      location.href = link.href;
    });
  }

  /*============================================
   09. Language menu
   =============================================*/
  function langMenuInit() {
    const langMenu = document.querySelector("[data-lang-menu]");
    disclosure(langMenu, document.querySelector("[data-lang-toggle]"));

    langMenu?.addEventListener("click", (e) => {
      const choice = e.target.closest("[data-lang-code]");
      if (!choice) return;
      document.documentElement.lang = choice.dataset.langCode;
      langMenu
        .querySelectorAll("[data-lang-code]")
        .forEach((option) =>
          option.setAttribute("aria-current", String(option === choice)),
        );
      closeAll();
    });
  }

  /*============================================
   10. Sticky header
   =============================================*/
  function stickyHeaderInit() {
    const topbar = document.querySelector("[data-topbar]");
    const header = document.querySelector("header");
    if (!topbar || !header) return;

    new IntersectionObserver(
      ([entry]) => header.toggleAttribute("data-stuck", !entry.isIntersecting),
      { threshold: 0 },
    ).observe(topbar);
  }

  /*============================================
   11. Video modal
   =============================================*/
  function videoModalInit() {
    const modal = document.querySelector("[data-video-modal]");
    if (!modal) return;

    const frame = modal.querySelector("iframe");

    document.querySelectorAll("[data-video-open]").forEach((trigger) =>
      trigger.addEventListener("click", () => {
        closeAll();
        frame.src = frame.dataset.src;
        modal.showModal();
      }),
    );

    modal
      .querySelector("[data-video-close]")
      .addEventListener("click", () => modal.close());
    modal.addEventListener("click", (e) => e.target === modal && modal.close());
    modal.addEventListener("close", () => frame.removeAttribute("src"));
  }

  /*============================================
   12. Form modals
   =============================================*/
  function modalInit() {
    document.querySelectorAll("[data-modal-open]").forEach((trigger) => {
      const modal = document.getElementById(trigger.dataset.modalOpen);
      if (!modal) return;
      trigger.addEventListener("click", (e) => {
        e.preventDefault();
        closeAll();
        modal.showModal();
      });
    });

    document.querySelectorAll("dialog.form-modal").forEach((modal) => {
      modal
        .querySelectorAll("[data-modal-close]")
        .forEach((btn) => btn.addEventListener("click", () => modal.close()));
      modal.addEventListener(
        "click",
        (e) => e.target === modal && modal.close(),
      );
    });
  }

  /*============================================
   13. Pointer-follow glow
   =============================================*/
  function glowInit() {
    const fine = matchMedia("(hover: hover) and (pointer: fine)");
    const still = matchMedia("(prefers-reduced-motion: reduce)");

    document.querySelectorAll("[data-glow]").forEach((panel) => {
      let frame = 0;

      const set = (x, y) => {
        panel.style.setProperty("--glow-x", x);
        panel.style.setProperty("--glow-y", y);
      };

      panel.addEventListener("pointermove", ({ clientX, clientY }) => {
        if (frame || !fine.matches || still.matches) return;

        frame = requestAnimationFrame(() => {
          frame = 0;
          const box = panel.getBoundingClientRect();
          set(
            (clientX - box.left) / box.width - 0.5,
            (clientY - box.top) / box.height - 0.5,
          );
        });
      });

      panel.addEventListener("pointerleave", () => set(0, 0));
    });
  }

  /*============================================
   14. Feature panel stacks
   =============================================*/
  function featurePanelsInit() {
    const list = document.querySelector("[data-feature-list]");
    const stacks = [...document.querySelectorAll("[data-feature-panels]")];
    if (!list || !stacks.length) return;

    const still = matchMedia("(prefers-reduced-motion: reduce)");
    const links = [...list.querySelectorAll(".feature-link")];
    const home = Math.max(
      links.findIndex((link) => link.hasAttribute("aria-current")),
      0,
    );
    let shown = home;

    const show = (index) => {
      if (index === shown) return;

      links.forEach((link, n) =>
        n === index
          ? link.setAttribute("aria-current", "true")
          : link.removeAttribute("aria-current"),
      );

      stacks.forEach((stack) => {
        const panels = [...stack.children];
        const cover = stack.dataset.featurePanels === "cover" && !still.matches;

        panels.forEach((panel, n) => {
          panel.toggleAttribute("data-leaving", cover && n === shown);
          panel.toggleAttribute("data-active", n === index);
        });

        if (cover)
          panels[index].addEventListener(
            "transitionend",
            () => panels.forEach((p) => p.removeAttribute("data-leaving")),
            { once: true },
          );
      });

      shown = index;
    };

    links.forEach((link, index) => {
      link.addEventListener("pointerenter", () => show(index));
      link.addEventListener("focus", () => show(index));
    });

    list.addEventListener("pointerleave", () => show(home));
    list.addEventListener("focusout", (e) => {
      if (!list.contains(e.relatedTarget)) show(home);
    });
  }

  /*============================================
   15. Tabs (tablist)
   =============================================*/
  function tabsInit() {
    document.querySelectorAll('[role="tablist"]').forEach((list) => {
      const tabs = [...list.querySelectorAll('[role="tab"]')];

      const select = (tab) => {
        tabs.forEach((t) => {
          const on = t === tab;
          t.setAttribute("aria-selected", String(on));
          t.tabIndex = on ? 0 : -1;
          document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
        });
        tab.focus();
        tab.scrollIntoView({ block: "nearest", inline: "nearest" });
      };

      list.addEventListener("click", (e) => {
        const tab = e.target.closest('[role="tab"]');
        if (tab) select(tab);
      });

      list.addEventListener("keydown", (e) => {
        const i = tabs.indexOf(document.activeElement);
        if (i < 0) return;

        const rtl = getComputedStyle(list).direction === "rtl";
        const step = { ArrowRight: rtl ? -1 : 1, ArrowLeft: rtl ? 1 : -1 }[
          e.key
        ];
        const next = step
          ? tabs.at((i + step) % tabs.length)
          : { Home: tabs[0], End: tabs.at(-1) }[e.key];
        if (!next) return;

        e.preventDefault();
        select(next);
      });
    });
  }

  /*============================================
   16. FAQ / accordion
   =============================================*/
  function faqInit() {
    const setOpen = (item, open) => {
      item.toggleAttribute("data-open", open);
      item
        .querySelector(
          ".faq-trigger, .accordion-trigger, [data-accordion-trigger]",
        )
        .setAttribute("aria-expanded", String(open));
    };

    document
      .querySelectorAll(
        ".faq-trigger, .accordion-trigger, [data-accordion-trigger]",
      )
      .forEach((trigger) => {
        const item = trigger.closest(".faq-item, .accordion-item");
        const group = item.closest("[data-accordion]") || item.parentElement;

        trigger.addEventListener("click", () => {
          group
            .querySelectorAll(":is(.faq-item, .accordion-item)[data-open]")
            .forEach((other) => {
              if (other !== item) setOpen(other, false);
            });
          setOpen(item, true);
        });
      });
  }

  /*============================================
   17. Star rating
   =============================================*/
  function ratingInit() {
    document.querySelectorAll(".rating[data-rating]").forEach((el) => {
      const value = Math.min(
        Math.max(parseFloat(el.dataset.rating) || 0, 0),
        5,
      );
      el.style.setProperty("--rating", value);
    });
  }

  /*============================================
   18. Billing switch (monthly / annual)
   =============================================*/
  function billingSwitchInit() {
    document.querySelectorAll("[data-billing-switch]").forEach((sw) => {
      const scope = sw.closest("section") || document;
      sw.addEventListener("click", () => {
        const annual = sw.getAttribute("aria-checked") !== "true";
        sw.setAttribute("aria-checked", String(annual));
        scope.querySelectorAll("[data-monthly][data-annual]").forEach((el) => {
          el.textContent = annual ? el.dataset.annual : el.dataset.monthly;
        });
      });
    });
  }

  /*============================================
   19. Swiper sliders
   =============================================*/
  function swiperInit() {
    const TIERS = [
      ["xsm", 451],
      ["sm", 576],
      ["md", 768],
      ["lg", 992],
      ["xl", 1280],
      ["xxl", 1536],
    ];
    const still = matchMedia("(prefers-reduced-motion: reduce)");
    const int = (el, key, fallback) => {
      const value = parseInt(el.dataset[key], 10);
      return Number.isNaN(value) ? fallback : value;
    };
    const on = (el, key) => el.dataset[key] === "1";
    const pad = (number) => (number < 10 ? "0" + number : number);

    const ladder = (el, suffix, base) => {
      let carried = base;
      return TIERS.map(([name, width]) => {
        carried = int(el, name + suffix, carried);
        return [width, carried];
      });
    };

    document.querySelectorAll(".swiper").forEach((slider) => {
      const wrapper = slider.querySelector(".swiper-wrapper");
      if (!wrapper) return;

      const slides = wrapper.querySelectorAll(".swiper-slide");
      const marquee = on(slider, "marquee");
      const variable = on(slider, "variableWidth");
      const loop = marquee || on(slider, "loop");
      const touch = slider.dataset.touch !== "0";
      const effect = slider.dataset.effect || "slide";
      const auto = marquee || variable;
      const base = auto
        ? "auto"
        : int(slider, "slidesPerView", int(slider, "baseSlides", 1));
      const gap = int(slider, "gap", 24);
      const steps = auto ? null : ladder(slider, "Slides", base);
      const gaps = ladder(slider, "Gap", gap);

      const breakpoints = Object.fromEntries(
        TIERS.map(([, width], tier) => [
          width,
          {
            slidesPerView: steps ? steps[tier][1] : base,
            spaceBetween: gaps[tier][1],
          },
        ]),
      );

      const find = (selector) =>
        slider.querySelector(selector) ||
        slider.parentElement?.querySelector(selector);
      const prev = find(".slider-prev");
      const next = find(".slider-next");
      const dots =
        slider.dataset.pagination !== "0" &&
        find(".swiper-pagination, .slider-dots");

      const autoplay = marquee
        ? {
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: slider.dataset.hoverPause !== "0",
          }
        : on(slider, "autoplay") && {
            delay: int(slider, "autoplayDelay", 3000),
            disableOnInteraction: false,
          };

      const options = {
        slidesPerView: base,
        spaceBetween: gap,
        breakpoints,
        direction:
          slider.dataset.direction === "vertical" ? "vertical" : "horizontal",
        speed: int(slider, "speed", marquee ? 4000 : 600),
        loop,
        effect,
        autoHeight: on(slider, "autoHeight"),
        centeredSlides: on(slider, "center"),
        parallax: on(slider, "parallax"),
        keyboard: { enabled: on(slider, "keyboard") },
        mousewheel: { enabled: on(slider, "mousewheel") },
        allowTouchMove: touch,
        grabCursor: touch,
        watchOverflow: true,
        watchSlidesProgress: true,
        autoplay: !still.matches && autoplay,
      };

      switch (effect) {
        case "fade":
          options.fadeEffect = { crossFade: true };
          break;
        case "coverflow":
          options.coverflowEffect = {
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          };
          break;
        case "flip":
          options.flipEffect = { slideShadows: true };
          break;
        case "cube":
          options.cubeEffect = {
            shadow: true,
            slideShadows: true,
            shadowOffset: 20,
            shadowScale: 0.94,
          };
          break;
        case "cards":
          options.cardsEffect = { slideShadows: true };
          break;
        case "creative":
          options.creativeEffect = {
            prev: { shadow: true, translate: [0, 0, -400] },
            next: { translate: ["100%", 0, 0] },
          };
          break;
      }

      if (marquee) {
        options.navigation = false;
        options.pagination = false;
      } else {
        if (prev && next) {
          options.navigation = { prevEl: prev, nextEl: next };
          options.a11y = {
            prevSlideMessage: prev.getAttribute("aria-label") || "Previous",
            nextSlideMessage: next.getAttribute("aria-label") || "Next",
          };
        }
        if (dots)
          options.pagination = {
            el: dots,
            clickable: true,
            type: ["bullets", "progressbar"].includes(
              slider.dataset.paginationType,
            )
              ? slider.dataset.paginationType
              : "fraction",
            formatFractionCurrent: pad,
            formatFractionTotal: pad,
          };
      }

      if (variable)
        slides.forEach((slide) => {
          slide.style.width = "auto";
          slide.style.flexShrink = 0;
        });

      slider.swiper?.destroy(true, true);
      const instance = new Swiper(slider, options);

      if (marquee) wrapper.style.transitionTimingFunction = "linear";

      const updateArrows = () => {
        if (!prev || !next) return;
        let perView = base;
        TIERS.forEach(
          ([, width]) =>
            innerWidth >= width && (perView = breakpoints[width].slidesPerView),
        );
        const stepped = loop || perView === "auto" || slides.length > perView;
        prev.hidden = !stepped;
        next.hidden = !stepped;
      };

      updateArrows();
      instance.on("resize breakpoint", updateArrows);
    });
  }

  /*============================================
   20. Testimonial avatar rail
   =============================================*/
  function testimonialRailInit() {
    document.querySelectorAll("[data-testimonial-rail]").forEach((rail) => {
      const swiper = rail.parentElement.querySelector(".swiper")?.swiper;
      const avatars = [...rail.children];
      if (!swiper || !avatars.length) return;
      const count = avatars.length;

      const place = (active) => {
        const wrapped = [];
        avatars.forEach((avatar, i) => {
          let offset = (((i - active) % count) + count) % count;
          if (offset > count / 2) offset -= count;
          const was = Number(avatar.dataset.offset);
          if (Math.abs(offset - was) > count / 2) {
            avatar.setAttribute("data-wrap", "");
            wrapped.push(avatar);
          }
          avatar.dataset.offset = offset;
          offset === 0
            ? avatar.setAttribute("aria-current", "true")
            : avatar.removeAttribute("aria-current");
        });
        if (!wrapped.length) return;
        rail.offsetWidth;
        wrapped.forEach((avatar) => avatar.removeAttribute("data-wrap"));
      };

      place(swiper.realIndex);
      swiper.on("realIndexChange", () => place(swiper.realIndex));
      avatars.forEach((avatar, i) =>
        avatar.addEventListener("click", () => swiper.slideToLoop(i)),
      );
    });
  }

  /*============================================
   21. Technician staircase parallax
   =============================================*/
  function technicianParallaxInit() {
    const row = document.querySelector("[data-technician-row]");
    if (!row) return;
    const scene = row.parentElement;

    const wide = matchMedia("(min-width: 1280px)");
    const still = matchMedia("(prefers-reduced-motion: reduce)");
    const END = 124;
    const MIN_SPAN = 160;
    const SPAN = 420;
    let frame = 0;

    const update = () => {
      frame = 0;
      if (!wide.matches || still.matches) {
        scene.style.removeProperty("--row-progress");
        return;
      }
      const box = row.getBoundingClientRect();
      const start = Math.max(innerHeight - box.height, END + MIN_SPAN);
      const progress = (start - box.top) / Math.max(start - END, SPAN);
      scene.style.setProperty(
        "--row-progress",
        Math.min(Math.max(progress, 0), 1).toFixed(4),
      );
    };

    const schedule = () => (frame ||= requestAnimationFrame(update));
    new IntersectionObserver(([entry]) => {
      const bind = entry.isIntersecting
        ? addEventListener
        : removeEventListener;
      bind("scroll", schedule, { passive: true });
      schedule();
    }).observe(row);

    addEventListener("resize", schedule);
    wide.addEventListener("change", schedule);
    still.addEventListener("change", schedule);
  }

  /*============================================
   22. Footer wordmark reveal
   =============================================*/
  function footerMarkInit() {
    const mark = document.querySelector(".footer-mark");
    const footer = document.querySelector("footer");
    if (!mark || !footer) return;

    const still = matchMedia("(prefers-reduced-motion: reduce)");
    let band = 0;
    let frame = 0;

    const update = () => {
      frame = 0;
      if (still.matches || !band) {
        mark.style.removeProperty("--mark-reveal");
        return;
      }
      const shown = innerHeight - footer.getBoundingClientRect().bottom;
      mark.style.setProperty(
        "--mark-reveal",
        Math.min(Math.max(shown / band, 0), 1).toFixed(4),
      );
    };

    const schedule = () => (frame ||= requestAnimationFrame(update));
    const measure = () => {
      band = mark.offsetHeight;
      schedule();
    };

    new IntersectionObserver(([entry]) => {
      const bind = entry.isIntersecting
        ? addEventListener
        : removeEventListener;
      bind("scroll", schedule, { passive: true });
      schedule();
    }).observe(footer);

    addEventListener("resize", measure);
    still.addEventListener("change", measure);
    measure();
  }

  /*============================================
   23. Scroll parallax media
   =============================================*/
  function scrollParallaxInit() {
    const items = document.querySelectorAll("[data-scroll-parallax]");
    if (!items.length) return;

    const still = matchMedia("(prefers-reduced-motion: reduce)");
    const visible = new Set();
    let frame = 0;

    const update = () => {
      frame = 0;
      items.forEach((el) => {
        if (still.matches) return el.style.removeProperty("--scroll-parallax");
        if (!visible.has(el)) return;
        const box = el.getBoundingClientRect();
        const progress =
          (innerHeight / 2 - (box.top + box.height / 2)) /
          (innerHeight + box.height);
        el.style.setProperty(
          "--scroll-parallax",
          Math.min(Math.max(progress, -0.5), 0.5).toFixed(4),
        );
      });
    };

    const schedule = () => (frame ||= requestAnimationFrame(update));

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) =>
        e.isIntersecting ? visible.add(e.target) : visible.delete(e.target),
      );
      const bind = visible.size ? addEventListener : removeEventListener;
      bind("scroll", schedule, { passive: true });
      schedule();
    });
    items.forEach((el) => io.observe(el));

    addEventListener("resize", schedule);
    still.addEventListener("change", schedule);
  }

  /*============================================
   24. Tom Select
   =============================================*/
  function selectInit() {
    if (!window.TomSelect) return;

    document.querySelectorAll("select[data-select]").forEach((select) => {
      const empty = select.querySelector('option[value=""]');
      const ghost = select.classList.contains("select-ghost");
      new TomSelect(select, {
        placeholder: empty && !ghost ? empty.textContent : "",
        allowEmptyOption: ghost,
        ...((ghost || select.hasAttribute("data-no-search")) && {
          controlInput: null,
        }),
        dropdownParent: ghost || select.closest("dialog") ? null : "body",
        maxOptions: null,
      });
    });
  }

  /*============================================
   25. Flatpickr date / time pickers
   =============================================*/
  function pickerInit() {
    if (!window.flatpickr) return;

    const TYPES = {
      date: { dateFormat: "d/m/Y", minDate: "today" },
      time: {
        enableTime: true,
        noCalendar: true,
        dateFormat: "h:i K",
        minuteIncrement: 30,
        minTime: "09:00",
        maxTime: "20:00",
        defaultHour: 9,
      },
    };

    document.querySelectorAll("input[data-picker]").forEach((input) => {
      flatpickr(input, {
        ...TYPES[input.dataset.picker],
        disableMobile: true,
        static: !!input.closest("dialog"),
        position: document.dir === "rtl" ? "auto right" : "auto left",
        onReady: (_dates, _str, fp) => {
          const base = input.id || input.name || "picker";
          fp.calendarContainer
            .querySelectorAll("input, select")
            .forEach((el, i) => {
              if (!el.id && !el.name)
                el.name = `${base}-${el.className.split(" ")[0] || i}`;
            });
        },
      });
    });
  }

  /*============================================
   26. Track card (search & track strip)
   =============================================*/
  function trackCardInit() {
    document.querySelectorAll("[data-track-card]").forEach((card) => {
      const slider = card.parentElement.querySelector("[data-track-strip]");
      const swiper = slider?.swiper;
      if (!swiper) return;

      const sources = [...slider.querySelectorAll(".swiper-slide[data-name]")];
      const fields = card.querySelectorAll("[data-track]");
      const photo = card.querySelector("[data-track-photo]");
      const call = card.querySelector("[data-track-call]");
      const moving = swiper.autoplay.running;
      let current = null;
      let timer;
      let pointer = "mouse";

      const freeze = () => {
        if (!swiper.autoplay.running) return;
        const at = swiper.getTranslate();
        swiper.autoplay.stop();
        swiper.setTransition(0);
        swiper.setTranslate(at);
      };

      const thaw = () => {
        if (!moving || swiper.autoplay.running) return;
        const target =
          swiper.snapGrid[swiper.snapIndex] * (swiper.rtlTranslate ? 1 : -1);
        const span =
          swiper.slidesSizesGrid[swiper.activeIndex] +
          Number(swiper.params.spaceBetween);
        const left = Math.min(Math.abs(swiper.translate - target) / span, 1);
        if (left < 0.01) return swiper.autoplay.start();
        swiper.once("transitionEnd", () => swiper.autoplay.start());
        swiper.slideTo(swiper.activeIndex, swiper.params.speed * left, false);
      };

      const fill = (slide) => {
        const source = slide.dataset.name
          ? slide
          : sources[Number(slide.dataset.swiperSlideIndex) % sources.length];
        fields.forEach((field) => {
          field.textContent = source.dataset[field.dataset.track];
        });
        const image = source.querySelector("img");
        photo.src = image.src;
        photo.alt = image.alt;
        call.href = "tel:+" + source.dataset.phone.replace(/\D/g, "");
      };

      const place = (slide) => {
        const box = card.offsetParent.getBoundingClientRect();
        const rect = slide.getBoundingClientRect();
        const centre = rect.left + rect.width / 2;
        const half = card.offsetWidth / 2;
        const start =
          getComputedStyle(card).direction === "rtl"
            ? box.right - centre - half
            : centre - half - box.left;
        const gutter = 12;
        const max = box.width - card.offsetWidth - gutter;
        card.style.setProperty(
          "--track-start",
          `${Math.max(gutter, Math.min(start, max))}px`,
        );
        card.style.setProperty("--track-top", `${rect.top - box.top}px`);
      };

      const open = (slide) => {
        clearTimeout(timer);
        freeze();
        if (slide !== current) {
          current = slide;
          fill(slide);
        }
        place(slide);
        card.setAttribute("data-open", "");
      };

      const close = () => {
        clearTimeout(timer);
        if (!card.hasAttribute("data-open")) return;
        card.removeAttribute("data-open");
        current = null;
        thaw();
      };

      const later = (e) => {
        if (e.pointerType !== "mouse") return;
        clearTimeout(timer);
        timer = setTimeout(close, 200);
      };

      slider.addEventListener("pointerover", (e) => {
        const slide = e.target.closest(".swiper-slide");
        if (e.pointerType === "mouse" && slide) open(slide);
      });
      slider.addEventListener("pointerleave", later);
      card.addEventListener("pointerenter", () => clearTimeout(timer));
      card.addEventListener("pointerleave", later);

      slider.addEventListener("pointerdown", (e) => (pointer = e.pointerType));
      slider.addEventListener("click", (e) => {
        const slide = e.target.closest(".swiper-slide");
        if (pointer === "mouse" || !slide || !swiper.allowClick) return;
        slide === current ? close() : open(slide);
      });

      slider.addEventListener("focusin", (e) => {
        const slide = e.target.closest(".swiper-slide");
        if (slide) open(slide);
      });
      [slider, card].forEach((el) =>
        el.addEventListener("focusout", (e) => {
          const next = e.relatedTarget;
          if (!slider.contains(next) && !card.contains(next)) close();
        }),
      );

      card.querySelector("[data-track-close]").addEventListener("click", close);
      document.addEventListener("click", (e) => {
        if (!slider.contains(e.target) && !card.contains(e.target)) close();
      });
      document.addEventListener(
        "keydown",
        (e) => e.key === "Escape" && close(),
      );
      let width = innerWidth;
      addEventListener("resize", () => {
        if (innerWidth === width) return;
        width = innerWidth;
        close();
      });
    });
  }

  /*============================================
   27. Map pin filter
   =============================================*/
  function mapFilterInit() {
    document.querySelectorAll("[data-map-filter]").forEach((group) => {
      const map = document.getElementById(group.getAttribute("aria-controls"));
      const pins = [...map.querySelectorAll("[data-tags]")];
      const count = map.querySelector("[data-map-count]");
      const buttons = [...group.querySelectorAll("[data-filter]")];

      const select = (button) => {
        const tag = button.dataset.filter;
        let shown = 0;
        buttons.forEach((b) =>
          b.setAttribute("aria-pressed", String(b === button)),
        );
        pins.forEach((pin) => {
          const on = pin.dataset.tags.split(" ").includes(tag);
          pin.toggleAttribute("data-match", on);
          shown += on;
        });
        count.textContent = `${shown} ${shown === 1 ? "electrician" : "electricians"}`;
      };

      group.addEventListener("click", (e) => {
        const button = e.target.closest("[data-filter]");
        if (button) select(button);
      });

      select(group.querySelector('[aria-pressed="true"]') || buttons[0]);
    });
  }

  /*============================================
   28. Zip coverage check
   =============================================*/
  function zipCheckInit() {
    document.querySelectorAll("[data-zip-check]").forEach((form) => {
      const input = form.querySelector("input");
      const result = form.querySelector("[data-zip-result]");
      const prefixes = form.dataset.zipCheck.split(" ");

      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const zip = input.value.trim();
        let icon = "ri-error-warning-fill text-alert";
        let text = "Enter a 5-digit zip code.";

        if (/^\d{5}$/.test(zip)) {
          const covered = prefixes.some((p) => zip.startsWith(p));
          icon = covered ? "ri-checkbox-fill text-success" : icon;
          text = covered
            ? `Yes! We cover ${zip}. Book a repair now.`
            : `${zip} is outside our area. Call us, we may still help.`;
        }

        result.innerHTML = `<span class="text-base leading-none"><i class="${icon}"></i></span><span></span>`;
        result.lastChild.textContent = text;
      });
    });
  }

  /*============================================
   29. Booking calendar
   =============================================*/
  function bookingCalendarInit() {
    document.querySelectorAll("[data-booking-calendar]").forEach((root) => {
      const grid = root.querySelector("[data-calendar-days]");
      const label = root.querySelector("[data-calendar-month]");
      const prev = root.querySelector("[data-calendar-prev]");
      const next = root.querySelector("[data-calendar-next]");
      const value = root.querySelector("[data-calendar-value]");
      const lang = document.documentElement.lang || "en";

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      let selected = today;
      let month = new Date(today.getFullYear(), today.getMonth(), 1);

      const iso = (d) =>
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

      const render = () => {
        grid.querySelectorAll("button").forEach((b) => b.remove());
        label.textContent = month.toLocaleDateString(lang, {
          month: "long",
          year: "numeric",
        });
        prev.disabled =
          month <= new Date(today.getFullYear(), today.getMonth(), 1);

        const start = new Date(month);
        start.setDate(1 - ((month.getDay() + 6) % 7));

        for (let i = 0; i < 42; i++) {
          const day = new Date(
            start.getFullYear(),
            start.getMonth(),
            start.getDate() + i,
          );
          const button = document.createElement("button");
          button.type = "button";
          button.textContent = day.getDate();
          button.dataset.date = iso(day);
          button.setAttribute(
            "aria-label",
            day.toLocaleDateString(lang, { dateStyle: "full" }),
          );
          button.setAttribute(
            "aria-pressed",
            String(iso(day) === iso(selected)),
          );
          button.disabled = day < today || day.getMonth() !== month.getMonth();
          grid.append(button);
        }
        value.value = iso(selected);
      };

      grid.addEventListener("click", (e) => {
        const button = e.target.closest("button");
        if (!button) return;
        const [y, m, d] = button.dataset.date.split("-").map(Number);
        selected = new Date(y, m - 1, d);
        grid
          .querySelectorAll("button")
          .forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
        value.value = button.dataset.date;
      });

      prev.addEventListener("click", () => {
        month = new Date(month.getFullYear(), month.getMonth() - 1, 1);
        render();
      });

      next.addEventListener("click", () => {
        month = new Date(month.getFullYear(), month.getMonth() + 1, 1);
        render();
      });

      render();
    });
  }

  /*============================================
   30. Store locator
   =============================================*/
  function storeLocatorInit() {
    document.querySelectorAll("[data-store-locator]").forEach((root) => {
      const map = root.querySelector("[data-store-map]");
      const popup = root.querySelector("[data-store-popup]");
      const pins = [...root.querySelectorAll("[data-store-pin]")];
      const cards = [...root.querySelectorAll(".store-card")];
      const input = root.querySelector("[data-store-search] input");
      const empty = root.querySelector("[data-store-empty]");
      const field = (name) => popup.querySelector(`[data-store-popup-${name}]`);
      let current = Math.max(
        0,
        cards.findIndex((c) => c.getAttribute("aria-pressed") === "true"),
      );

      const place = () => {
        const pin = pins[current];
        if (!pin) return;
        const box = map.getBoundingClientRect();
        const dot = pin.getBoundingClientRect();
        const rtl = getComputedStyle(map).direction === "rtl";
        const centre = dot.left + dot.width / 2 - box.left;
        const start =
          (rtl ? box.width - centre : centre) - popup.offsetWidth / 2;
        const gutter = 12;
        let top = dot.bottom - box.top + 8;
        if (top + popup.offsetHeight > box.height - gutter)
          top = dot.top - box.top - 8 - popup.offsetHeight;
        popup.style.setProperty(
          "--popup-start",
          `${Math.min(Math.max(start, gutter), box.width - popup.offsetWidth - gutter)}px`,
        );
        popup.style.setProperty("--popup-top", `${Math.max(top, gutter)}px`);
      };

      const select = (i) => {
        current = i;
        const card = cards[i];
        const address = card.querySelector("[data-store-address]").textContent;
        cards.forEach((c) =>
          c.setAttribute("aria-pressed", String(c === card)),
        );
        field("name").textContent =
          card.querySelector("[data-store-name]").textContent;
        field("address").textContent = address;
        field("directions").href =
          `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
        field("phone").href = `tel:${card.dataset.tel}`;
        field("phone").firstElementChild.textContent = card.dataset.phone;
        place();
      };

      cards.forEach((card, i) =>
        card.addEventListener("click", () => select(i)),
      );
      pins.forEach((pin) =>
        pin.addEventListener("click", () =>
          select(Number(pin.dataset.storePin)),
        ),
      );

      root
        .querySelector("[data-store-search]")
        .addEventListener("submit", (e) => e.preventDefault());
      input.addEventListener("input", () => {
        const query = input.value.trim().toLowerCase();
        let shown = 0;
        cards.forEach((card) => {
          const on = card.textContent.toLowerCase().includes(query);
          card.parentElement.hidden = !on;
          shown += on;
        });
        empty.hidden = shown > 0;
      });

      new ResizeObserver(place).observe(map);
    });
  }

  /*============================================
   31. Quantity stepper
   =============================================*/
  function quantityInit() {
    document.querySelectorAll("[data-quantity]").forEach((box) => {
      const input = box.querySelector("input");
      const buttons = box.querySelectorAll("[data-step]");
      const min = Number(input.min) || 1;
      const max = Number(input.max) || Infinity;

      const sync = () => {
        const value = Math.min(
          Math.max(Math.round(Number(input.value)) || min, min),
          max,
        );
        if (String(value) !== input.value) input.value = value;
        buttons.forEach((b) => {
          const step = Number(b.dataset.step);
          b.disabled = step < 0 ? value <= min : value >= max;
        });
      };

      buttons.forEach((b) =>
        b.addEventListener("click", () => {
          input.value = Number(input.value) + Number(b.dataset.step);
          sync();
          input.dispatchEvent(new Event("input", { bubbles: true }));
        }),
      );
      input.addEventListener("change", () => {
        sync();
        input.dispatchEvent(new Event("input", { bubbles: true }));
      });
      sync();
    });
  }

  const COUNTER_DEFAULT_DURATION = 2000;
  const COUNTER_WHEEL = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
  const COUNTER_MAX_TURNS_PER_SECOND = 1.5;

  /*============================================
   32. Counter animation
   =============================================*/
  function counterAnimation(element, target, duration, suffix) {
    const el =
      typeof element === "string" ? document.querySelector(element) : element;
    if (!el) return;

    const to = Number(target);
    if (!Number.isFinite(to)) return;

    const time =
      Number(duration) > 0 ? Number(duration) : COUNTER_DEFAULT_DURATION;
    const tail = suffix == null ? "" : String(suffix);
    const [intPart, fracPart = ""] = Math.abs(to)
      .toFixed(countDecimals(to))
      .split(".");
    const digits = (intPart + fracPart).split("").map(Number);
    const places = [];
    for (let place = intPart.length - 1; place >= -fracPart.length; place--) {
      places.push(place);
    }

    const value = formatCounterValue(intPart, fracPart, to < 0) + tail;
    const wheels = buildCounterWheels(el, places, digits, to < 0, tail, value);
    if (!wheels) {
      el.textContent = value;
      return;
    }

    const maxTurns = Math.round((time / 1000) * COUNTER_MAX_TURNS_PER_SECOND);
    wheels.forEach((wheel) => {
      const fullTurns = Math.floor(
        Math.abs(to) / Math.pow(10, wheel.place + 1),
      );
      const turns = Math.min(fullTurns, Math.max(0, maxTurns - wheel.place));
      wheel.travel = turns * 10 + wheel.finalDigit;
    });

    const settle = () =>
      wheels.forEach((wheel) => spinCounterWheel(wheel, wheel.finalDigit));

    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      settle();
      return;
    }

    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / time, 1);

      if (progress >= 1) {
        settle();
        return;
      }

      const remaining = 1 - easeInOutSine(progress);
      wheels.forEach((wheel) => {
        const position = wheel.finalDigit - wheel.travel * remaining;
        spinCounterWheel(wheel, ((position % 10) + 10) % 10);
      });

      requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }

  /*============================================
   33. Counter: build wheels
   =============================================*/
  function buildCounterWheels(el, places, digits, negative, suffix, value) {
    el.textContent = "";
    el.appendChild(counterLabel(value));

    const inner = document.createElement("span");
    inner.style.cssText = "display:inline;white-space:nowrap;";
    inner.setAttribute("aria-hidden", "true");
    if (negative) inner.appendChild(counterSymbol("-"));

    const wheels = [];

    places.forEach((place, index) => {
      if (place === -1) inner.appendChild(counterSymbol("."));
      else if (index > 0 && place >= 0 && place % 3 === 2) {
        inner.appendChild(counterSymbol(","));
      }

      const digit = document.createElement("span");
      digit.style.cssText = "position:relative;display:inline;";

      const spacer = document.createElement("span");
      spacer.style.cssText = "display:inline;visibility:hidden;";
      spacer.textContent = "0";

      const frame = document.createElement("span");
      frame.style.cssText =
        "display:block;position:absolute;inset:0;overflow:hidden;";

      const ribbon = document.createElement("span");
      ribbon.style.cssText =
        "display:block;will-change:transform;backface-visibility:hidden;";
      COUNTER_WHEEL.forEach((number) => {
        const value = document.createElement("span");
        value.style.cssText = "display:block;text-align:center;";
        value.textContent = number;
        ribbon.appendChild(value);
      });

      frame.appendChild(ribbon);
      digit.append(spacer, frame);
      inner.appendChild(digit);

      wheels.push({ place, ribbon, frame, finalDigit: digits[index] });
    });

    if (suffix) inner.appendChild(counterSymbol(suffix));

    el.appendChild(inner);

    const cellHeight = wheels.length
      ? wheels[0].frame.getBoundingClientRect().height
      : 0;
    if (!cellHeight) return null;

    wheels.forEach((wheel) => {
      wheel.cellHeight = cellHeight;
      [...wheel.ribbon.children].forEach((value) => {
        value.style.height = `${cellHeight}px`;
        value.style.lineHeight = `${cellHeight}px`;
      });
    });

    return wheels;
  }

  /*============================================
   34. Counter: spin wheel
   =============================================*/
  function spinCounterWheel(wheel, position) {
    const offset = -position * wheel.cellHeight;
    wheel.ribbon.style.transform = `translate3d(0, ${offset}px, 0)`;
  }

  /*============================================
   35. Counter: accessible label
   =============================================*/
  function counterLabel(value) {
    const label = document.createElement("span");
    label.style.cssText =
      "position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;";
    label.textContent = value;
    return label;
  }

  /*============================================
   36. Counter: symbol cell
   =============================================*/
  function counterSymbol(character) {
    const symbol = document.createElement("span");
    symbol.style.cssText = "display:inline;";
    symbol.textContent = character;
    return symbol;
  }

  /*============================================
   37. Counter: format value
   =============================================*/
  function formatCounterValue(intPart, fracPart, negative) {
    const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${negative ? "-" : ""}${grouped}${fracPart ? `.${fracPart}` : ""}`;
  }

  /*============================================
   38. Counter: count decimals
   =============================================*/
  function countDecimals(number) {
    const [, fraction = ""] = String(number).split(".");
    return fraction.length;
  }

  /*============================================
   39. Counter: easing
   =============================================*/
  function easeInOutSine(t) {
    return (1 - Math.cos(Math.PI * t)) / 2;
  }

  /*============================================
   40. Counters (on view)
   =============================================*/
  function counterInit() {
    const counters = document.querySelectorAll(".counter[data-count-to]");
    if (!counters.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);
          const { countTo, duration, suffix } = entry.target.dataset;
          counterAnimation(entry.target, countTo, duration, suffix);
        });
      },
      { threshold: 0.3 },
    );

    counters.forEach((counter) => observer.observe(counter));
  }

  /*============================================
   41. Scroll-spy
   =============================================*/
  function scrollspyInit() {
    document.querySelectorAll("[data-scrollspy]").forEach((nav) => {
      const links = [...nav.querySelectorAll('a[href^="#"]')];
      const targets = links.map((a) =>
        document.getElementById(a.hash.slice(1)),
      );
      let frame = 0;

      const update = () => {
        frame = 0;
        const line =
          parseFloat(
            getComputedStyle(document.documentElement).scrollPaddingTop,
          ) + 1 || 1;
        let current = 0;
        targets.forEach((t, i) => {
          if (t && t.getBoundingClientRect().top <= line) current = i;
        });
        if (innerHeight + scrollY >= document.documentElement.scrollHeight - 2)
          current = targets.length - 1;
        links.forEach((a, i) =>
          a.setAttribute("aria-current", String(i === current)),
        );
      };

      addEventListener(
        "scroll",
        () => (frame ||= requestAnimationFrame(update)),
        { passive: true },
      );
      update();
    });
  }

  /*============================================
   42. Cart totals
   =============================================*/
  function cartInit() {
    document.querySelectorAll("[data-cart]").forEach((root) => {
      const TAX = 0.08;
      const list = root.querySelector("[data-cart-items]");
      const out = (name) => root.querySelector(`[data-cart-${name}]`);
      const line = (n) => `$${n.toFixed(2)}`;
      const money = (n) =>
        `$${n.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;

      const update = () => {
        let subtotal = 0;
        let count = 0;
        list.querySelectorAll("li").forEach((item) => {
          const qty = Number(item.querySelector("input").value) || 0;
          const total = Number(item.dataset.price) * qty;
          item.querySelector("[data-line-total]").textContent = line(total);
          subtotal += total;
          count += qty;
        });
        const tax = subtotal * TAX;
        out("count").textContent = `${count} ${count === 1 ? "item" : "items"}`;
        out("subtotal").textContent = money(subtotal);
        out("tax").textContent = money(tax);
        out("total").textContent = money(subtotal + tax);
        out("empty").hidden = list.children.length > 0;
      };

      list.addEventListener("input", update);
      list.addEventListener("click", (e) => {
        const remove = e.target.closest("[data-cart-remove]");
        if (!remove) return;
        const item = remove.closest("li");
        const next = item.nextElementSibling || item.previousElementSibling;
        item.remove();
        update();
        (next
          ? next.querySelector("[data-cart-remove]")
          : out("empty").querySelector("a")
        ).focus();
      });
    });
  }

  /*============================================
   43. Before / after slider
   =============================================*/
  function compareInit() {
    document.querySelectorAll("[data-compare]").forEach((box) => {
      const range = box.querySelector('input[type="range"]');
      if (!range) return;
      const update = () =>
        box.style.setProperty("--compare", `${range.value}%`);
      range.addEventListener("input", update);
      update();
    });
  }

  /*============================================
   44. Dashboard sidebar
   =============================================*/
  function dashSidebarInit() {
    const sidebar = document.querySelector(".dash-sidebar");
    const toggle = document.querySelector("[data-sidebar-toggle]");
    if (!sidebar || !toggle) return;

    const desktop = matchMedia("(min-width: 1280px)");
    const close = sidebar.querySelector("[data-sidebar-close]");
    const icons = toggle.querySelectorAll("[data-icon]");
    const set = (open) => {
      sidebar.toggleAttribute("data-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      icons.forEach((icon) =>
        icon.classList.toggle(
          "hidden",
          (icon.dataset.icon === "open") === open,
        ),
      );
    };
    const reset = () => set(desktop.matches);

    toggle.addEventListener("click", () => {
      toggle.setAttribute("data-swapped", "");
      set(!sidebar.hasAttribute("data-open"));
    });
    close?.addEventListener("click", () => {
      set(false);
      toggle.focus();
    });
    desktop.addEventListener("change", reset);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !desktop.matches) set(false);
    });
    document.addEventListener("click", (e) => {
      if (desktop.matches || !sidebar.hasAttribute("data-open")) return;
      if (!sidebar.contains(e.target) && !toggle.contains(e.target)) set(false);
    });

    sidebar.style.transition = "none";
    reset();
    sidebar.offsetWidth;
    sidebar.style.transition = "";
  }

  /*============================================
   45. Service-area radius
   =============================================*/
  function serviceRadiusInit() {
    document.querySelectorAll("[data-service-radius]").forEach((range) => {
      const scope =
        range.closest("[data-radius-scope]") ?? document.documentElement;
      const value = scope.querySelector("[data-radius-value]");
      const area = scope.querySelector("[data-radius-area]");
      const update = () => {
        const km = Number(range.value);
        const min = Number(range.min);
        const max = Number(range.max);
        range.style.setProperty("--fill", (km - min) / (max - min));
        range.setAttribute("aria-valuetext", `${km} km`);
        scope.style.setProperty("--radius-km", km);
        if (value) value.textContent = km;
        if (area)
          area.textContent = Math.round(Math.PI * km * km).toLocaleString();
      };
      range.addEventListener("input", update);
      update();
    });
  }

  /*============================================
   46. Live tracking ETA simulator
   =============================================*/
  function etaSimInit() {
    document.querySelectorAll("[data-eta-sim]").forEach((range) => {
      const scope = range.closest("main") ?? document;
      const pin = scope.querySelector("[data-eta-pin]");
      const map = pin?.closest("[data-eta-map]");
      const from = (pin?.dataset.from ?? "0,0").split(",").map(Number);
      const to = (pin?.dataset.to ?? "0,0").split(",").map(Number);
      const max = Number(range.dataset.etaMax) || 10;
      const step = scope.querySelector("[data-eta-step]");
      const update = () => {
        const p = Number(range.value) / Number(range.max);
        const minutes = Math.round(max * (1 - p));
        const arrived = minutes === 0;
        range.style.setProperty("--fill", p);
        range.setAttribute(
          "aria-valuetext",
          arrived ? "Arrived" : `${minutes} min to arrival`,
        );
        if (pin) {
          pin.style.setProperty(
            "--pin-x",
            `${from[0] + (to[0] - from[0]) * p}%`,
          );
          pin.style.setProperty(
            "--pin-y",
            `${from[1] + (to[1] - from[1]) * p}%`,
          );
        }
        map?.toggleAttribute("data-arrived", arrived);
        scope.querySelectorAll("[data-eta]").forEach((el) => {
          el.textContent = arrived
            ? (el.dataset.etaDone ?? "Arrived")
            : `${el.dataset.etaPrefix ?? ""}${minutes} min`;
        });
        scope.querySelectorAll("[data-eta-status]").forEach((el) => {
          el.textContent = arrived ? "Arrived" : "On the Way";
        });
        if (step) {
          step.classList.toggle("opacity-50", !arrived);
          const icon = step.querySelector("i");
          icon.className = arrived
            ? "ri-checkbox-circle-fill"
            : "ri-checkbox-blank-circle-line";
          icon.parentElement.classList.toggle("text-success", arrived);
          icon.parentElement.classList.toggle("text-text-secondary", !arrived);
        }
      };
      range.addEventListener("input", update);
      update();
    });
  }

  /*============================================
   47. ON / OFF switches
   =============================================*/
  function switchInit() {
    const counts = [...document.querySelectorAll("[data-switch-count]")];
    const update = () =>
      counts.forEach((count) => {
        const list = document.querySelector(count.dataset.switchCount);
        if (list)
          count.textContent = list.querySelectorAll(
            '[data-switch][aria-checked="true"]',
          ).length;
      });

    document.querySelectorAll("[data-switch]").forEach((sw) =>
      sw.addEventListener("click", () => {
        const on = sw.getAttribute("aria-checked") !== "true";
        sw.setAttribute("aria-checked", String(on));
        const label = sw.querySelector("[data-switch-label]");
        if (label) label.textContent = on ? "ON" : "OFF";
        update();
      }),
    );
    update();
  }

  /*============================================
   48. Working-hours day toggles
   =============================================*/
  function dayToggleInit() {
    document.querySelectorAll("[data-day-toggle]").forEach((button) =>
      button.addEventListener("click", () => {
        const on = button.getAttribute("aria-pressed") !== "true";
        button.setAttribute("aria-pressed", String(on));
        button.textContent = on ? "On" : "Off";
      }),
    );
  }

  /*============================================
   49. Service offerings
   =============================================*/
  function serviceOffersInit() {
    document.querySelectorAll("[data-service-offers]").forEach((list) => {
      const count = list
        .closest("section, main")
        ?.querySelector("[data-service-count]");
      const update = () => {
        if (count)
          count.textContent =
            list.querySelectorAll(".switch-sm:checked").length;
      };
      list.addEventListener("change", update);
      update();

      document
        .querySelectorAll(`[data-service-form="#${list.id}"]`)
        .forEach((form) => {
          form.addEventListener("submit", () => {
            const card = list.firstElementChild?.cloneNode(true);
            if (!card) return;
            const data = new FormData(form);
            const name = data.get("name").trim();
            const toggle = card.querySelector(".switch-sm");
            toggle.checked = data.has("active");
            toggle.setAttribute("aria-label", `Offer ${name}`);
            const slots = card.querySelectorAll("[data-fill]");
            if (slots.length) {
              slots.forEach((el) => {
                let value = String(data.get(el.dataset.fill) ?? "").trim();
                if (el.dataset.fill === "price")
                  value = Number(value).toLocaleString("en-US");
                el.textContent = (el.dataset.fillFormat || "%").replace(
                  "%",
                  value,
                );
              });
            } else {
              const option = form.elements.category.selectedOptions[0];
              const pill = card.querySelector("span");
              pill.className = `rounded-full px-2 py-0.5 text-xs leading-3.75 ${option.dataset.pill}`;
              pill.textContent = option.textContent;
              card.querySelector("h2").textContent = name;
              card.querySelector("h2 + p").textContent = data
                .get("description")
                .trim();
              card.querySelector("bdi").textContent =
                `${Number(data.get("price")).toLocaleString("en-US")}`;
            }
            list.append(card);
            update();
            form.reset();
            form
              .querySelectorAll("select")
              .forEach((s) => s.tomselect?.setValue(s.value, true));
          });
        });
    });
  }

  /*============================================
   50. Area chart
   =============================================*/
  function areaChartInit() {
    const monotone = (p) => {
      const n = p.length;
      const dx = [],
        m = [],
        t = [];
      for (let i = 0; i < n - 1; i++) {
        dx[i] = p[i + 1][0] - p[i][0];
        m[i] = (p[i + 1][1] - p[i][1]) / dx[i];
      }
      t[0] = m[0];
      t[n - 1] = m[n - 2];
      for (let i = 1; i < n - 1; i++)
        t[i] = m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2;
      for (let i = 0; i < n - 1; i++) {
        if (!m[i]) {
          t[i] = t[i + 1] = 0;
          continue;
        }
        const a = t[i] / m[i],
          b = t[i + 1] / m[i],
          s = a * a + b * b;
        if (s > 9) {
          const k = 3 / Math.sqrt(s);
          t[i] = k * a * m[i];
          t[i + 1] = k * b * m[i];
        }
      }
      let d = `M${p[0][0]},${p[0][1]}`;
      for (let i = 0; i < n - 1; i++) {
        const h = dx[i] / 3;
        d += ` C${p[i][0] + h},${p[i][1] + t[i] * h} ${p[i + 1][0] - h},${p[i + 1][1] - t[i + 1] * h} ${p[i + 1][0]},${p[i + 1][1]}`;
      }
      return d;
    };

    document.querySelectorAll("[data-area-chart]").forEach((chart, index) => {
      const labels = chart.dataset.labels.split(",");
      const values = chart.dataset.values.split(",").map(Number);
      const max = Number(chart.dataset.max);
      const step = Number(chart.dataset.step);
      const prefix = chart.dataset.prefix || "";
      const name = chart.dataset.name || "";
      const format = (v) => prefix + v.toLocaleString("en-US");
      const START = 49,
        TOP = 19;
      const tip = document.createElement("div");
      tip.className = "chart-tooltip";
      tip.hidden = true;
      let points = [],
        active = -1,
        width = 0;
      const rtl =
        (chart.parentElement?.closest("[dir]") || document.documentElement)
          .dir === "rtl";
      const sx = (x) => (rtl ? width - x : x);

      const draw = () => {
        width = chart.clientWidth;
        const bottom = chart.clientHeight - 29;
        const end = width - 4;
        const y = (v) => bottom - ((bottom - TOP) * v) / max;
        points = values.map((v, i) => [
          sx(START + ((end - START) * i) / (values.length - 1)),
          y(v),
        ]);
        const line = monotone(points);
        let grid = "";
        for (let v = 0; v <= max; v += step) {
          grid += `<line class="chart-grid" x1="${sx(START)}" x2="${sx(end)}" y1="${y(v)}" y2="${y(v)}"/>`;
          grid += `<text class="chart-axis chart-axis-y" x="${sx(0)}" y="${y(v) + 5}" text-anchor="${rtl ? "end" : "start"}">${prefix}${v / 1000}k</text>`;
        }
        const edge = (first) => (first !== rtl ? "start" : "end");
        const ticks = labels
          .map(
            (l, i) =>
              `<text class="chart-axis" x="${points[i][0]}" y="${bottom + 23}" text-anchor="${i ? (i === labels.length - 1 ? edge(false) : "middle") : edge(true)}">${l}</text>`,
          )
          .join("");
        chart.innerHTML = `<svg width="${width}" height="${chart.clientHeight}" aria-hidden="true">
          <defs><linearGradient id="area-fill-${index}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-opacity="0.2"/><stop offset="1" stop-opacity="0"/></linearGradient></defs>
          ${grid}${ticks}
          <path d="${line} L${sx(end)},${bottom} L${sx(START)},${bottom}Z" fill="url(#area-fill-${index})"/>
          <path class="chart-line" d="${line}"/>
          <line class="chart-guide" y1="${TOP}" y2="${bottom}"/>
          ${points.map(([px, py]) => `<circle class="chart-dot" cx="${px}" cy="${py}" r="4"/>`).join("")}
        </svg>`;
        chart.append(tip);
        if (active > -1) show(active);
      };

      const show = (i) => {
        active = i;
        const [px, py] = points[i];
        chart
          .querySelectorAll(".chart-dot")
          .forEach((dot, j) => dot.toggleAttribute("data-active", j === i));
        const guide = chart.querySelector(".chart-guide");
        guide.setAttribute("x1", px);
        guide.setAttribute("x2", px);
        guide.setAttribute("data-active", "");
        tip.innerHTML = `<span>${labels[i]}</span><strong>${name}: ${format(values[i])}</strong>`;
        tip.hidden = false;
        const after = px + 7,
          before = px - 7 - tip.offsetWidth;
        const start = rtl
          ? before < 0
            ? after
            : before
          : after + tip.offsetWidth > width
            ? before
            : after;
        tip.style.insetInlineStart = `${start}px`;
        tip.style.insetBlockStart = `${Math.max(0, py - tip.offsetHeight / 2 - 20)}px`;
      };

      const hide = () => {
        active = -1;
        tip.hidden = true;
        chart
          .querySelectorAll("[data-active]")
          .forEach((el) => el.removeAttribute("data-active"));
      };

      chart.addEventListener("pointermove", (e) => {
        const x = e.clientX - chart.getBoundingClientRect().left;
        let nearest = 0;
        points.forEach(([px], i) => {
          if (Math.abs(px - x) < Math.abs(points[nearest][0] - x))
            nearest = i;
        });
        if (nearest !== active) show(nearest);
      });
      chart.addEventListener("pointerleave", hide);
      chart.addEventListener("blur", hide);
      chart.addEventListener("keydown", (e) => {
        const move =
          ({ ArrowRight: 1, ArrowLeft: -1 }[e.key] || 0) * (rtl ? -1 : 1);
        if (!move) return;
        e.preventDefault();
        show(
          Math.min(
            values.length - 1,
            Math.max(0, (active < 0 ? values.length : active) + move),
          ),
        );
      });

      new ResizeObserver(() => chart.clientWidth !== width && draw()).observe(
        chart,
      );
    });
  }

  /*============================================
   51. Donut chart
   =============================================*/
  function donutInit() {
    document.querySelectorAll("[data-donut]").forEach((donut) => {
      const tip = donut.querySelector("[data-donut-tip]");
      // The legend carries the values, so the tip stays out of the a11y tree.
      tip?.setAttribute("aria-hidden", "true");
      const segments = [...donut.querySelectorAll("[data-segment]")];
      const rows = [...donut.querySelectorAll("[data-segment-row]")];
      const show = (label) => {
        const seg = segments.find((s) => s.dataset.segment === label);
        segments.forEach((s) => s.toggleAttribute("data-active", s === seg));
        tip.textContent = label;
        tip.style.setProperty("--seg", seg.style.getPropertyValue("--seg"));
        tip.hidden = false;
      };
      const hide = () => {
        tip.hidden = true;
        segments.forEach((s) => s.removeAttribute("data-active"));
      };
      [...segments, ...rows].forEach((el) => {
        const label = el.dataset.segment || el.dataset.segmentRow;
        el.addEventListener("pointerenter", () => show(label));
        el.addEventListener("pointerleave", hide);
      });
    });
  }

  /*============================================
   52. Job requests
   =============================================*/
  function jobRequestsInit() {
    document.querySelectorAll("[data-job-requests]").forEach((section) => {
      const cards = [...section.querySelectorAll("[data-job]")];
      const filters = section.querySelectorAll("[data-job-filter]");
      const detail = section.querySelector("#job-detail");
      if (!cards.length || !detail) return;

      const field = (name) => detail.querySelector(`[data-detail="${name}"]`);
      const select = (card) => {
        cards.forEach((c) =>
          c.setAttribute("aria-pressed", String(c === card)),
        );
        card.querySelectorAll("[data-field]").forEach((source) => {
          const target = field(source.dataset.field);
          if (!target) return;
          target.textContent = source.textContent;
          if (source.dataset.field === "priority")
            target.className = source.className;
        });
        field("phone").textContent = card.dataset.phone;
        field("description").textContent = card.dataset.description;
      };

      cards.forEach((card) =>
        card.addEventListener("click", () => {
          select(card);
          if (!matchMedia("(min-width: 992px)").matches)
            detail.scrollIntoView({ block: "start", behavior: "smooth" });
        }),
      );

      filters.forEach((button) =>
        button.addEventListener("click", () => {
          const value = button.dataset.jobFilter;
          filters.forEach((b) =>
            b.setAttribute("aria-pressed", String(b === button)),
          );
          cards.forEach((card) => {
            const item = card.closest("li");
            item.hidden = value !== "all" && item.dataset.priority !== value;
          });
          const current = cards.find(
            (c) => c.getAttribute("aria-pressed") === "true",
          );
          const first = cards.find((c) => !c.closest("li").hidden);
          if (first && current?.closest("li").hidden) select(first);
        }),
      );
    });
  }

  /*============================================
   53. Support tickets
   =============================================*/
  function ticketsInit() {
    document.querySelectorAll("[data-tickets]").forEach((root) => {
      const rows = [...root.querySelectorAll("tr[data-ticket]")];
      const detail = root.querySelector("[data-ticket-detail]");
      if (!rows.length || !detail) return;

      const button = (row) => row.querySelector("[data-ticket-select]");
      const field = (name) => detail.querySelector(`[data-detail="${name}"]`);
      const note = detail.querySelector("[data-ticket-note]");
      let current = rows.find(
        (row) => button(row).getAttribute("aria-pressed") === "true",
      );

      const select = (row) => {
        current = row;
        rows.forEach((r) =>
          button(r).setAttribute("aria-pressed", String(r === row)),
        );
        row.querySelectorAll("[data-field]").forEach((source) => {
          const target = field(source.dataset.field);
          if (target) target.textContent = source.textContent;
        });
        field("created").setAttribute("datetime", row.dataset.created);
        detail.hidden = false;
        if (!matchMedia("(min-width: 1536px)").matches)
          detail.scrollIntoView({ block: "start", behavior: "smooth" });
      };

      rows.forEach((row) =>
        row.addEventListener("click", (e) => {
          if (
            e.target.closest("[data-ticket-select]") ||
            !e.target.closest("button, a")
          )
            select(row);
        }),
      );

      detail
        .querySelector("[data-ticket-close]")
        ?.addEventListener("click", () => {
          detail.hidden = true;
          rows.forEach((r) => button(r).setAttribute("aria-pressed", "false"));
          if (current) button(current).focus();
          current = null;
        });

      detail.querySelectorAll("[data-ticket-action]").forEach((action) =>
        action.addEventListener("click", () => {
          if (!current) return;
          const pill = current.querySelector("[data-ticket-status]");
          pill.textContent = action.dataset.ticketAction;
          pill.className =
            `status-pill -my-1 ${action.dataset.statusClass}`.trim();
          note.textContent = `Ticket ${field("id").textContent} marked ${action.dataset.ticketAction}.`;
        }),
      );

      detail
        .querySelector("[data-ticket-reply]")
        ?.addEventListener("submit", (e) => {
          e.preventDefault();
          e.target.reset();
          note.textContent = `Reply sent on ticket ${field("id").textContent}.`;
        });
    });
  }

  /*============================================
   54. Outside-click & Escape dismissers
   =============================================*/
  function dismissersInit() {
    document.addEventListener("click", (e) => {
      if (panels.some((panel) => panel.holds(e.target))) return;
      closeAll();
    });

    document.addEventListener(
      "keydown",
      (e) => e.key === "Escape" && closeAll(),
    );

    desktop.addEventListener("change", closeAll);
  }

  /*============================================
   55. Booking table (filter & actions)
   =============================================*/
  function bookingTableInit() {
    const STATUS = {
      accept: ["accepted", "Accepted", "var(--color-primary)"],
      approve: ["published", "Published", "var(--color-success)"],
      reject: ["rejected", "Rejected", "var(--color-alert)"],
    };

    const bindActions = (body, after) =>
      body.addEventListener("click", (e) => {
        const button = e.target.closest("[data-booking-action]");
        const next = button && STATUS[button.dataset.bookingAction];
        if (!next) return;
        const row = button.closest("tr");
        const pill = row.querySelector("[data-status-pill]");
        [row.dataset.status, pill.textContent] = next;
        pill.style.setProperty("--status", next[2]);
        after?.();
      });

    document
      .querySelectorAll("[data-status-actions]")
      .forEach((body) => bindActions(body));

    document.querySelectorAll("[data-status-filter]").forEach((select) => {
      const body = document.getElementById(
        select.getAttribute("aria-controls"),
      );
      if (!body) return;
      const empty = body
        .closest("table")
        ?.parentElement.querySelector("[data-status-empty]");
      const filter = () => {
        let shown = 0;
        body.querySelectorAll("tr[data-status]").forEach((row) => {
          const match = !select.value || row.dataset.status === select.value;
          row.hidden = !match;
          shown += match;
        });
        if (empty) empty.hidden = shown > 0;
      };

      select.addEventListener("change", filter);
      bindActions(body, filter);
    });
  }

  /*============================================
   56. Focus target
   =============================================*/
  function focusTargetInit() {
    document.querySelectorAll("[data-focus-target]").forEach((button) => {
      const target = document.querySelector(button.dataset.focusTarget);
      if (!target) return;
      button.addEventListener("click", () => {
        if (button.dataset.fillValue) target.value = button.dataset.fillValue;
        target.focus({ preventScroll: true });
        target.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    });
  }

  /*============================================
   57. Avatar upload preview
   =============================================*/
  function avatarUploadInit() {
    document.querySelectorAll("[data-avatar-input]").forEach((input) => {
      let url;
      input.addEventListener("change", () => {
        const file = input.files?.[0];
        if (!file || !file.type.startsWith("image/")) return;
        if (url) URL.revokeObjectURL(url);
        url = URL.createObjectURL(file);
        document
          .querySelectorAll("[data-avatar-preview]")
          .forEach((img) => (img.src = url));
      });
    });
  }

  /*============================================
   58. Booking list (filter & search)
   =============================================*/
  function bookingListInit() {
    document.querySelectorAll("[data-booking-list]").forEach((section) => {
      const filters = section.querySelectorAll("[data-booking-filter]");
      const search = section.querySelector("[data-booking-search]");
      const empty = section.querySelector("[data-booking-empty]");
      if (!section.querySelector("tr[data-status]")) return;

      const key = (row) =>
        [...row.querySelectorAll("[data-search-key]")]
          .map((c) => c.textContent)
          .join(" ")
          .toLowerCase();
      let status = "all";
      const apply = () => {
        const query = (search?.value || "").trim().toLowerCase();
        let shown = 0;
        section.querySelectorAll("tr[data-status]").forEach((row) => {
          const match =
            (status === "all" || row.dataset.status === status) &&
            key(row).includes(query);
          row.hidden = !match;
          shown += match;
        });
        if (empty) empty.hidden = shown > 0;
      };

      filters.forEach((button) =>
        button.addEventListener("click", () => {
          status = button.dataset.bookingFilter;
          filters.forEach((b) =>
            b.setAttribute("aria-pressed", String(b === button)),
          );
          apply();
        }),
      );
      search?.addEventListener("input", apply);
      section.addEventListener("booking-list:update", apply);
    });
  }

  /*============================================
   59. Counter form
   =============================================*/
  function countFormInit() {
    document.querySelectorAll("[data-count-form]").forEach((form) => {
      form.addEventListener("submit", () => {
        const data = new FormData(form);
        const bump = (el) => {
          const [field, value] = (el.dataset.countWhen || "").split("=");
          if (field && data.get(field) !== value) return;
          const target = document.querySelector(el.dataset.count);
          if (!target) return;
          const n = parseInt(target.textContent.replace(/\D/g, ""), 10) || 0;
          target.textContent = (n + 1).toLocaleString("en-US");
        };
        form
          .querySelectorAll("select")
          .forEach(
            (s) =>
              s.selectedOptions[0]?.dataset.count && bump(s.selectedOptions[0]),
          );
        form
          .querySelectorAll("input[type=file][data-count]")
          .forEach((i) => i.files.length && bump(i));

        form.reset();
        form
          .querySelectorAll("select")
          .forEach((s) => s.tomselect?.setValue(s.value, true));
      });
    });
  }

  /*============================================
   60. Generic add-row form
   =============================================*/
  function rowFormInit() {
    document.querySelectorAll("[data-row-form]").forEach((form) => {
      const body = document.querySelector(form.dataset.rowForm);
      const template = body?.firstElementChild;
      if (!template) return;

      form.addEventListener("submit", () => {
        const data = new FormData(form);
        const row = template.cloneNode(true);
        row.hidden = false;

        row.querySelectorAll("[data-cell]").forEach((el) => {
          const field = el.dataset.cell;
          if (field === "id") {
            const [, prefix = ""] = el.textContent.match(/^(\D*)/) || [];
            const ids = [...body.querySelectorAll("tr > :first-child")].map(
              (c) => parseInt(c.textContent.replace(/\D/g, ""), 10) || 0,
            );
            el.textContent = `${prefix}${Math.max(0, ...ids) + 1}`;
            return;
          }
          if (field === "now") {
            const now = new Date();
            const pad = (n) => String(n).padStart(2, "0");
            el.dateTime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
            el.textContent = `${now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} ${now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
            return;
          }
          const input = form.elements[field];
          const option = input?.selectedOptions?.[0];
          let value =
            el.dataset.cellValue ??
            option?.textContent ??
            String(data.get(field) ?? "").trim();
          if (input?.type === "number")
            value = Number(value).toLocaleString("en-US");
          el.textContent = (el.dataset.cellFormat || "%").replace("%", value);
          if (
            option?.dataset.status &&
            (el.dataset.cellVar || el.classList.contains("status-pill"))
          ) {
            el.style.setProperty(
              el.dataset.cellVar || "--status",
              option.dataset.status,
            );
          }
          if (field === "status" && option && row.hasAttribute("data-status"))
            row.dataset.status = option.value;
        });

        const name = String(data.get("name") ?? "").trim();
        if (name)
          row
            .querySelectorAll("td:last-child button[aria-label]")
            .forEach((btn) => {
              btn.setAttribute(
                "aria-label",
                `${btn.getAttribute("aria-label").split(" ")[0]} ${name}`,
              );
            });

        body.prepend(row);
        const total = body.children.length;
        document
          .querySelectorAll("[data-row-count]")
          .forEach((el) => (el.textContent = total));
        body
          .closest("[data-booking-list]")
          ?.dispatchEvent(new Event("booking-list:update"));

        form.reset();
        form
          .querySelectorAll("select")
          .forEach((s) => s.tomselect?.setValue(s.value, true));
      });
    });
  }

  /*============================================
   61. New booking form
   =============================================*/
  function bookingFormInit() {
    document.querySelectorAll("[data-booking-form]").forEach((form) => {
      const body = document.querySelector(form.dataset.bookingForm);
      const template = body?.querySelector("tr");
      if (!template) return;

      form.addEventListener("submit", () => {
        const data = new FormData(form);
        const get = (field) => String(data.get(field) ?? "").trim();
        const status = form.elements.status.selectedOptions[0];
        const payment = form.elements.payment.selectedOptions[0];
        const row = template.cloneNode(true);
        row.hidden = false;
        row.dataset.status = status.value;

        const cells = row.children;
        const ids = [...body.querySelectorAll("tr > :first-child")].map(
          (c) => parseInt(c.textContent.replace(/\D/g, ""), 10) || 0,
        );
        cells[0].querySelector("bdi").textContent =
          `BK-${Math.max(0, ...ids) + 1}`;
        cells[1].textContent = get("customer");
        cells[2].textContent = get("service");
        cells[3].textContent = get("technician");

        const date =
          form.elements.date._flatpickr?.selectedDates[0] || new Date();
        const time = cells[4].querySelector("time");
        time.dateTime = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
        time.textContent = date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });

        const pill = (cell, option) => {
          const el = cell.querySelector(".status-pill");
          el.style.setProperty("--status", option.dataset.status);
          el.textContent = option.textContent;
        };
        pill(cells[5], status);
        cells[6].querySelector("bdi").textContent =
          `$${Number(get("amount")).toLocaleString("en-US")}`;
        pill(cells[7], payment);

        body.prepend(row);
        const total = body.querySelectorAll("tr").length;
        document
          .querySelectorAll("[data-row-count]")
          .forEach((el) => (el.textContent = total));
        body
          .closest("[data-booking-list]")
          ?.dispatchEvent(new Event("booking-list:update"));

        form.reset();
        form.elements.date._flatpickr?.clear();
        form
          .querySelectorAll("select")
          .forEach((s) => s.tomselect?.setValue(s.value, true));
      });
    });
  }

  /*============================================
   62. Add user form
   =============================================*/
  function userFormInit() {
    document.querySelectorAll("[data-user-form]").forEach((form) => {
      const body = document.querySelector(form.dataset.userForm);
      const template = body?.querySelector("tr");
      if (!template) return;

      form.addEventListener("submit", () => {
        const data = new FormData(form);
        const get = (field) => String(data.get(field) ?? "").trim();
        const name = get("name");
        const option = form.elements.status.selectedOptions[0];
        const row = template.cloneNode(true);
        row.hidden = false;
        row.dataset.status = option.value;

        const avatar = document.createElement("span");
        avatar.className =
          "grid size-12.5 shrink-0 place-items-center rounded-full bg-primary/10 font-semibold text-primary";
        avatar.setAttribute("aria-hidden", "true");
        avatar.textContent = name
          .split(/\s+/)
          .map((w) => w[0])
          .slice(0, 2)
          .join("")
          .toUpperCase();
        row.querySelector("img").replaceWith(avatar);

        const [nameEl, emailEl] = row.querySelectorAll("[data-search-key]");
        nameEl.textContent = name;
        emailEl.textContent = get("email");

        const cells = row.querySelectorAll("td");
        cells[0].querySelector("bdi").textContent = get("phone") || "—";
        cells[1].textContent = "0";
        cells[2].querySelector("bdi").textContent = "$0";
        const today = new Date();
        const time = cells[3].querySelector("time");
        time.dateTime = today.toISOString().slice(0, 10);
        time.textContent = today.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
        cells[4].textContent = get("role");
        const pill = cells[5].querySelector(".status-pill");
        pill.style.setProperty("--status", option.dataset.status);
        pill.textContent = option.textContent;
        row.querySelectorAll("td:last-child button").forEach((btn) => {
          const verb = btn.getAttribute("aria-label").split(" ")[0];
          btn.setAttribute("aria-label", `${verb} ${name}`);
        });

        body.prepend(row);
        const total = body.querySelectorAll("tr").length;
        document
          .querySelectorAll("[data-user-count]")
          .forEach((el) => (el.textContent = total));
        body
          .closest("[data-booking-list]")
          ?.dispatchEvent(new Event("booking-list:update"));

        form.reset();
        form
          .querySelectorAll("select")
          .forEach((s) => s.tomselect?.setValue(s.value, true));
      });
    });
  }

  /*============================================
   63. Preloader
   =============================================*/
  function preloaderInit() {
    const loader = document.querySelector("[data-preloader]");
    if (!loader) return Promise.resolve();

    return new Promise((resolve) => {
      let done = false;
      const hide = (instant) => {
        if (done) return;
        done = true;
        loader.toggleAttribute("data-instant", instant === true);
        loader.setAttribute("data-loaded", "");
        resolve();
      };

      addEventListener("pagereveal", (e) => e.viewTransition && hide(true));
      if (document.readyState === "complete") hide(true);
      else addEventListener("load", hide, { once: true });
      setTimeout(hide, 2500);
      addEventListener("pageshow", (e) => e.persisted && hide(true));
    });
  }

  /*============================================
   64. Scroll to top
   =============================================*/
  function scrollTopInit() {
    const button = document.querySelector("[data-scroll-top]");
    if (!button) return;

    const still = matchMedia("(prefers-reduced-motion: reduce)");
    let queued = false;

    const update = () => {
      queued = false;
      const max = document.documentElement.scrollHeight - innerHeight;
      const y = scrollY;
      button.style.setProperty(
        "--scroll-progress",
        max > 0 ? (y / max).toFixed(4) : 0,
      );
      button.toggleAttribute("data-show", y > 400);
    };

    addEventListener(
      "scroll",
      () => {
        if (queued) return;
        queued = true;
        requestAnimationFrame(update);
      },
      { passive: true },
    );
    addEventListener("resize", update);
    update();

    button.addEventListener("click", () => {
      scrollTo({ top: 0, behavior: still.matches ? "auto" : "smooth" });
    });
  }

  /*============================================
   65. Animate on scroll (AOS)
   =============================================*/
  function aosInit(ready) {
    if (!window.AOS || !document.querySelector("[data-aos]")) return;

    ready.then(() =>
      AOS.init({
        once: true,
        duration: 500,
        easing: "ease-out-cubic",
        offset: 60,
        disable: () => matchMedia("(prefers-reduced-motion: reduce)").matches,
      }),
    );
  }

  /*============================================
   66. Toast
   =============================================*/
  function toast(message, type = "success") {
    let el = document.querySelector("[data-toast]");
    if (!el) {
      el = document.createElement("div");
      el.className = "toast";
      el.setAttribute("data-toast", "");
      el.setAttribute("role", "status");
      el.setAttribute("aria-live", "polite");
      if ("popover" in el) el.popover = "manual";
      el.innerHTML =
        '<span class="toast-icon" aria-hidden="true"><i></i></span><span data-toast-text></span>';
      document.body.append(el);
    }
    el.dataset.type = type;
    el.querySelector("i").className =
      type === "error"
        ? "ri-error-warning-fill"
        : type === "info"
          ? "ri-information-fill"
          : "ri-checkbox-circle-fill";
    el.querySelector("[data-toast-text]").textContent = message;

    // Re-enter the top layer, so it paints over an open modal too.
    if (el.popover) {
      if (el.matches(":popover-open")) el.hidePopover();
      el.showPopover();
    }
    el.removeAttribute("data-show");
    void el.offsetWidth;
    el.setAttribute("data-show", "");
    clearTimeout(el.hideTimer);
    el.hideTimer = setTimeout(() => {
      el.removeAttribute("data-show");
      setTimeout(
        () => el.popover && !el.hasAttribute("data-show") && el.hidePopover(),
        300,
      );
    }, 3200);
  }

  /*============================================
   67. Demo actions & forms
   =============================================*/
  function demoInit() {
    // Buttons and links with no back end: [data-demo="message"].
    document.addEventListener("click", (e) => {
      const trigger = e.target.closest("[data-demo]");
      if (!trigger) return;
      e.preventDefault();
      if (
        trigger.hasAttribute("data-demo-confirm") &&
        !confirm(trigger.dataset.demoConfirm)
      )
        return;
      toast(
        trigger.dataset.demo || "This action is disabled in the demo.",
        trigger.dataset.demoType || "info",
      );
    });

    // Row delete: [data-row-delete="Confirm question?"] removes its row;
    // [data-row-deleted="Message."] replaces the toast.
    document.addEventListener("click", (e) => {
      const button = e.target.closest("[data-row-delete]");
      if (!button) return;
      if (!confirm(button.dataset.rowDelete)) return;
      const row = button.closest("tr, li");
      const list = row?.parentElement;
      const name =
        button.getAttribute("aria-label")?.replace(/^Delete /, "") || "Item";
      row?.remove();
      if (list)
        document
          .querySelectorAll("[data-row-count], [data-user-count]")
          .forEach((c) => (c.textContent = list.children.length));
      list
        ?.closest("[data-booking-list]")
        ?.dispatchEvent(new Event("booking-list:update"));
      toast(button.dataset.rowDeleted || `${name} deleted.`);
    });

    // CSV export: [data-export-table="#table"].
    document.addEventListener("click", (e) => {
      const button = e.target.closest("[data-export-table]");
      if (!button) return;
      const table = document.querySelector(button.dataset.exportTable);
      if (!table) return;
      const cell = (c) =>
        `"${c.textContent.replace(/\s+/g, " ").trim().replace(/"/g, '""')}"`;
      const csv = [...table.rows]
        .filter((r) => !r.hidden)
        .map((r) => [...r.cells].map(cell).join(","))
        .join("\r\n");
      const link = document.createElement("a");
      link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
      link.download = button.dataset.exportName || "export.csv";
      link.click();
      setTimeout(() => URL.revokeObjectURL(link.href), 1000);
      toast("Export downloaded.");
    });

    // Forms with no real action: validate natively, then confirm and reset.
    document.addEventListener("submit", (e) => {
      const form = e.target;
      if (e.defaultPrevented || form.method === "dialog") return;
      if (form.dataset.redirect) {
        e.preventDefault();
        location.href = form.dataset.redirect;
        return;
      }
      const action = form.getAttribute("action");
      if (action !== null && action !== "#" && action !== "") return;
      e.preventDefault();
      if (form.getAttribute("role") === "search") {
        toast("Search results are not part of this demo.", "info");
        return;
      }
      toast(form.dataset.success || "Thank you! Your request has been sent.");
      form.reset();
      form
        .querySelectorAll("select")
        .forEach((s) => s.tomselect?.setValue(s.value, true));
      form
        .querySelectorAll("[data-picker]")
        .forEach((i) => i._flatpickr?.clear());
    });
  }

  /*============================================
   68. Book new service steps
   =============================================*/
  function serviceStepsInit() {
    const params = new URLSearchParams(location.search);

    // Step 2 forwards what step 1 chose.
    document.querySelectorAll("form[data-carry]").forEach((form) => {
      params.forEach((value, key) => {
        if (form.elements[key]) return;
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        form.append(input);
      });
    });

    // Step 3 shows it.
    document.querySelectorAll("[data-summary]").forEach((slot) => {
      const value = params.get(slot.dataset.summary);
      if (!value) return;
      if (slot.dataset.summary === "date") {
        const [d, m, y] = value.split("/").map(Number);
        const date = new Date(y, m - 1, d);
        if (Number.isNaN(date.getTime())) return;
        const pad = (n) => String(n).padStart(2, "0");
        slot.setAttribute("datetime", `${y}-${pad(m)}-${pad(d)}`);
        slot.textContent = date.toLocaleDateString(
          document.documentElement.lang || "en",
          {
            month: "short",
            day: "numeric",
            year: "numeric",
          },
        );
        return;
      }
      if (slot.dataset.summary === "service") {
        const [name, price] = value.split("|");
        slot.textContent = name;
        const cost = document.querySelector("[data-summary-cost]");
        if (cost && price) cost.textContent = price;
        return;
      }
      if (slot.dataset.summary === "time") {
        const [, h, m, ap] = value.match(/(\d+):(\d+)\s*(AM|PM)/i) || [];
        const hour = (Number(h) % 12) + (/pm/i.test(ap) ? 12 : 0);
        if (h)
          slot.setAttribute(
            "datetime",
            `${String(hour).padStart(2, "0")}:${m}`,
          );
      }
      slot.textContent = value;
    });
  }

  /*============================================
   69. Theme & direction switcher
   =============================================*/
  // Fixed panel on the right edge: LTR / RTL, then light / dark / same as
  // device. The head script in every page applies the saved choice before the
  // first paint; this keeps <html data-theme> and dir up to date after that.
  function settingsInit() {
    const root = document.documentElement;
    const THEME_KEY = "fixumi-theme";
    const DIR_KEY = "fixumi-dir";
    const darkQuery = matchMedia("(prefers-color-scheme: dark)");
    const read = (key) => {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    };
    const write = (key, value) => {
      try {
        if (value === null) localStorage.removeItem(key);
        else localStorage.setItem(key, value);
      } catch {
        /* Blocked storage: the choice lasts for this page only. */
      }
    };

    const stored = read(THEME_KEY);
    let choice = stored === "light" || stored === "dark" ? stored : "system";

    const icon = (name) => `<span class="text-lg"><i class="${name}"></i></span>`;
    const panel = document.createElement("aside");
    panel.className = "settings-switcher";
    panel.setAttribute("aria-label", "Display settings");
    panel.innerHTML = `
      <div role="group" aria-label="Text direction">
        <button type="button" data-set-dir="ltr">LTR</button>
        <button type="button" data-set-dir="rtl">RTL</button>
      </div>
      <div role="group" aria-label="Colour theme">
        <button type="button" data-set-theme="light" aria-label="Light mode" title="Light mode">${icon("ri-sun-line")}</button>
        <button type="button" data-set-theme="dark" aria-label="Dark mode" title="Dark mode">${icon("ri-moon-line")}</button>
        <button type="button" data-set-theme="system" aria-label="Same as device" title="Same as device">${icon("ri-computer-line")}</button>
      </div>`;
    document.body.append(panel);

    // Dark pages show the white logo; light pages get the original back.
    const swapLogos = (dark) => {
      document.querySelectorAll("img[src$='/logo.svg'], img[data-logo-src]").forEach((img) => {
        if (!img.dataset.logoSrc) img.dataset.logoSrc = img.getAttribute("src");
        const src = img.dataset.logoSrc;
        img.setAttribute("src", dark ? src.replace(/logo\.svg$/, "logo-light.svg") : src);
      });
    };

    const apply = () => {
      const theme = choice === "system" ? (darkQuery.matches ? "dark" : "light") : choice;
      root.dataset.theme = theme;
      root.style.colorScheme = theme;
      swapLogos(theme === "dark");
      panel.querySelectorAll("[data-set-theme]").forEach((btn) => {
        btn.setAttribute("aria-pressed", String(btn.dataset.setTheme === choice));
      });
      panel.querySelectorAll("[data-set-dir]").forEach((btn) => {
        btn.setAttribute("aria-pressed", String(btn.dataset.setDir === (root.dir || "ltr")));
      });
    };

    panel.addEventListener("click", (event) => {
      const btn = event.target.closest("button");
      if (!btn) return;
      if (btn.dataset.setTheme) {
        choice = btn.dataset.setTheme;
        write(THEME_KEY, choice === "system" ? null : choice);
        apply();
      } else if (btn.dataset.setDir && btn.dataset.setDir !== (root.dir || "ltr")) {
        // Sliders, selects, pickers and charts read the direction only when
        // they start, so the page reloads in the new direction.
        write(DIR_KEY, btn.dataset.setDir);
        root.dir = btn.dataset.setDir;
        location.reload();
      }
    });

    // Under "same as device", follow the device when it switches.
    darkQuery.addEventListener("change", () => {
      if (choice === "system") apply();
    });

    apply();
  }

  /*============================================
   70. Blog posts (new post & counts)
   =============================================*/
  const NEW_POST_KEY = "fixumi-new-post";

  function blogPostsInit() {
    const section = document.querySelector("[data-blog-posts]");
    const body = section?.querySelector("tbody");
    const template = body?.querySelector("tr");
    if (!template) return;

    let post = null;
    try {
      post = JSON.parse(sessionStorage.getItem(NEW_POST_KEY));
      sessionStorage.removeItem(NEW_POST_KEY);
    } catch {
      post = null;
    }

    if (post?.title) {
      const row = template.cloneNode(true);
      const [titleEl, authorEl] = row.querySelectorAll("[data-search-key]");
      const oldTitle = titleEl.textContent;
      row.hidden = false;
      row.dataset.status = post.status;
      titleEl.textContent = post.title;
      authorEl.textContent = post.author;

      const img = row.querySelector("img");
      if (post.image) {
        img.src = post.image;
        img.alt = post.title;
      } else {
        const placeholder = section.querySelector("template[data-post-placeholder]");
        if (placeholder) img.replaceWith(placeholder.content.cloneNode(true));
      }

      row.querySelector("td").textContent = post.category;
      const time = row.querySelector("time");
      time.dateTime = post.date;
      time.textContent = post.dateLabel;
      row.querySelector("bdi").textContent = "0";
      const pill = row.querySelector(".status-pill");
      pill.style.setProperty("--status", post.statusColor);
      pill.textContent = post.statusLabel;
      row
        .querySelectorAll("[aria-label], [data-demo], [data-row-delete]")
        .forEach((el) =>
          ["aria-label", "data-demo", "data-row-delete", "data-row-deleted"].forEach((attr) => {
            const value = el.getAttribute(attr);
            if (value) el.setAttribute(attr, value.split(oldTitle).join(post.title));
          }),
        );

      body.prepend(row);
      if (post.message) toast(post.message);
    }

    const shown = section.querySelector("[data-post-shown]");
    const total = section.querySelector("[data-post-total]");
    const count = () => {
      const rows = [...body.rows];
      if (shown) shown.textContent = rows.filter((r) => !r.hidden).length;
      if (total) total.textContent = rows.length;
    };
    ["input", "click", "booking-list:update"].forEach((type) =>
      section.addEventListener(type, count),
    );
    count();
  }

  /*============================================
   71. Blog post editor
   =============================================*/
  function blogEditorInit() {
    const form = document.querySelector("form[data-blog-editor]");
    if (!form) return;
    const { title, slug, cover, status, date } = form.elements;

    const slugify = (text) =>
      text
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/[\s_-]+/g, "-");
    let slugEdited = false;
    title.addEventListener("input", () => {
      if (!slugEdited) slug.value = slugify(title.value);
    });
    slug.addEventListener("input", () => {
      const next = slugify(slug.value);
      slugEdited = slug.value !== "";
      if (slug.value !== next) slug.value = next;
    });

    const preview = form.querySelector("[data-cover-preview]");
    const drop = form.querySelector("[data-cover-drop]");
    let url = null;
    let image = null;
    const setCover = (file) => {
      if (url) URL.revokeObjectURL(url);
      url = file ? URL.createObjectURL(file) : null;
      image = null;
      preview.querySelector("img")?.remove();
      if (file) {
        const img = document.createElement("img");
        img.src = url;
        img.alt = "Cover image preview";
        img.className = "aspect-3/2 w-full rounded-base object-cover";
        preview.prepend(img);
        const token = url;
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          if (url === token) image = reader.result;
        });
        reader.readAsDataURL(file);
      }
      preview.hidden = !file;
      drop.classList.toggle("mt-3", !!file);
      drop.classList.toggle("mt-5", !file);
    };
    cover.addEventListener("change", () => {
      const file = cover.files?.[0];
      setCover(file?.type.startsWith("image/") ? file : null);
    });
    form.querySelector("[data-cover-remove]")?.addEventListener("click", () => {
      cover.value = "";
      setCover(null);
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const draft = e.submitter?.value === "draft";
      const option =
        (draft && status.querySelector('option[value="draft"]')) ||
        status.selectedOptions[0];
      const day = date?._flatpickr?.selectedDates[0] || new Date();
      const pad = (n) => String(n).padStart(2, "0");
      const name = title.value.trim();
      const label = (field) => form.elements[field]?.selectedOptions[0]?.textContent || "";
      const post = {
        title: name,
        image,
        category: label("category"),
        author: label("author"),
        date: `${day.getFullYear()}-${pad(day.getMonth() + 1)}-${pad(day.getDate())}`,
        dateLabel: day.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        status: option.value,
        statusLabel: option.textContent,
        statusColor: option.dataset.status,
        message: (
          (option.value === "draft" ? form.dataset.drafted : form.dataset.published) || ""
        ).replace("{name}", name),
      };
      const save = (value) => {
        try {
          sessionStorage.setItem(NEW_POST_KEY, JSON.stringify(value));
          return true;
        } catch {
          return false;
        }
      };
      // A large cover can overflow session storage: send the post without it.
      if (!save(post)) save({ ...post, image: null });
      location.href = form.getAttribute("action") || "blog-posts.html";
    });
  }

  /*============================================
   72. Roles & permissions
   =============================================*/
  function rolesInit() {
    const root = document.querySelector("[data-roles]");
    const list = root?.querySelector("[data-role-list]");
    if (!list?.firstElementChild) return;

    const boxes = [...root.querySelectorAll("input[data-perm]")];
    const groups = [...root.querySelectorAll("input[data-perm-group]")];
    const title = root.querySelector("[data-role-title]");
    const lockedEls = root.querySelectorAll("[data-role-locked]");
    const dirtyEl = root.querySelector("[data-role-dirty]");
    const actions = root.querySelector("[data-role-actions]");
    const resetBtn = root.querySelector("[data-role-reset]");
    const saveBtn = root.querySelector("[data-role-save]");
    const template = root.querySelector("template[data-role-template]");
    const form = document.querySelector("form[data-role-form]");
    const copy = form?.elements.copyFrom;

    const name = (li) => li.querySelector("[data-role-name]").textContent;
    const text = (key, li) => (root.dataset[key] || "").replace("{role}", name(li));
    const saved = (li) => (li.dataset.permissions || "").split(/\s+/).filter(Boolean);
    const checked = () => boxes.filter((b) => b.checked).map((b) => b.dataset.perm);
    const members = (group) => {
      const [module, action] = group.dataset.permGroup.split(":");
      return boxes.filter((b) => {
        const [m, a] = b.dataset.perm.split(":");
        return (module === "*" || module === m) && (action === "*" || action === a);
      });
    };
    let active =
      list.querySelector('[data-role-select][aria-pressed="true"]')?.closest("li") ||
      list.firstElementChild;

    const update = () => {
      groups.forEach((group) => {
        const keys = members(group);
        const on = keys.filter((b) => b.checked).length;
        group.checked = on === keys.length;
        group.indeterminate = on > 0 && on < keys.length;
      });
      const now = checked();
      const before = saved(active);
      const dirty =
        !active.hasAttribute("data-locked") &&
        (now.length !== before.length || now.some((key) => !before.includes(key)));
      if (dirtyEl) dirtyEl.hidden = !dirty;
      if (resetBtn) resetBtn.disabled = !dirty;
      if (saveBtn) saveBtn.disabled = !dirty;
    };

    const select = (li) => {
      active = li;
      const keys = saved(li);
      const locked = li.hasAttribute("data-locked");
      list
        .querySelectorAll("[data-role-select]")
        .forEach((b) => b.setAttribute("aria-pressed", String(b.closest("li") === li)));
      boxes.forEach((b) => {
        b.checked = keys.includes(b.dataset.perm);
        b.disabled = locked;
      });
      groups.forEach((g) => (g.disabled = locked));
      if (title) title.textContent = name(li);
      lockedEls.forEach((el) => (el.hidden = !locked));
      if (actions) actions.hidden = locked;
      update();
    };

    const syncCopy = () => {
      if (!copy) return;
      const none = copy.querySelector('option[value="none"]');
      copy.replaceChildren(
        ...(none ? [none] : []),
        ...[...list.children].map((li) => new Option(name(li), li.dataset.role)),
      );
      copy.value = none ? "none" : "";
      if (copy.tomselect) {
        copy.tomselect.clearOptions();
        copy.tomselect.sync();
        // Tom Select leaves a blank <option> behind while it swaps the value.
        if (none) copy.querySelector('option[value=""]')?.remove();
      }
    };

    list.addEventListener("click", (e) => {
      const remove = e.target.closest("[data-role-delete]");
      if (remove) {
        const li = remove.closest("li");
        if (!confirm(text("deleteConfirm", li))) return;
        const message = text("deleted", li);
        li.remove();
        if (li === active) select(list.firstElementChild);
        syncCopy();
        toast(message);
        return;
      }
      const button = e.target.closest("[data-role-select]");
      if (button) select(button.closest("li"));
    });

    root.addEventListener("change", (e) => {
      const box = e.target;
      if (box.matches("input[data-perm-group]")) {
        const keys = members(box);
        const allOn = keys.every((b) => b.checked);
        keys.forEach((b) => (b.checked = !allOn));
      }
      if (box.matches("input[data-perm], input[data-perm-group]")) update();
    });

    resetBtn?.addEventListener("click", () => select(active));
    saveBtn?.addEventListener("click", () => {
      const keys = checked();
      active.dataset.permissions = keys.join(" ");
      const count = active.querySelector("[data-role-count]");
      if (count) count.textContent = `${keys.length}/${boxes.length}`;
      update();
      toast(text("saved", active));
    });

    form?.addEventListener("submit", () => {
      const li = template?.content.firstElementChild?.cloneNode(true);
      if (!li) return;
      const data = new FormData(form);
      const roleName = String(data.get("name") ?? "").trim();
      const source = [...list.children].find((r) => r.dataset.role === data.get("copyFrom"));
      li.dataset.role = `role-${Date.now()}`;
      li.dataset.permissions = source ? source.dataset.permissions : "";
      li.querySelector("[data-role-name]").textContent = roleName;
      li.querySelector("[data-role-description]").textContent = String(
        data.get("description") ?? "",
      ).trim();
      li.querySelector("[data-role-count]").textContent = `${saved(li).length}/${boxes.length}`;
      const remove = li.querySelector("[data-role-delete]");
      remove?.setAttribute("aria-label", `${remove.getAttribute("aria-label").trim()} ${roleName}`);

      list.append(li);
      select(li);
      syncCopy();
      toast(text("added", li));
      form.reset();
    });

    select(active);
  }

  settingsInit();
  aosInit(preloaderInit());
  scrollTopInit();
  navPanelInit();
  searchPanelInit();
  langMenuInit();
  userMenuInit();
  stickyHeaderInit();
  videoModalInit();
  modalInit();
  userFormInit();
  bookingFormInit();
  rowFormInit();
  countFormInit();
  glowInit();
  featurePanelsInit();
  tabsInit();
  faqInit();
  ratingInit();
  billingSwitchInit();
  swiperInit();
  testimonialRailInit();
  technicianParallaxInit();
  footerMarkInit();
  scrollParallaxInit();
  selectInit();
  pickerInit();
  mapFilterInit();
  trackCardInit();
  zipCheckInit();
  bookingCalendarInit();
  storeLocatorInit();
  quantityInit();
  counterInit();
  cartInit();
  scrollspyInit();
  compareInit();
  dashSidebarInit();
  navIndicatorInit();
  dayToggleInit();
  switchInit();
  serviceRadiusInit();
  etaSimInit();
  serviceOffersInit();
  areaChartInit();
  donutInit();
  bookingTableInit();
  bookingListInit();
  focusTargetInit();
  avatarUploadInit();
  jobRequestsInit();
  ticketsInit();
  dismissersInit();
  demoInit();
  serviceStepsInit();
  blogPostsInit();
  blogEditorInit();
  rolesInit();
})();
