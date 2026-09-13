(function () {
  if (window.__webscaleFadeMotion) return;
  window.__webscaleFadeMotion = true;

  var selector = '[data-motion="fade"]';
  var sequenceSelector = '[data-motion-sequence="fade"]';
  var viewportSequenceSelector = '[data-motion-sequence="viewport"]';
  // Catch footers globally together with sections (footer = auto-reveal section),
  // so animation works without adding attributes in components.
  var sectionSelector = '[data-motion-section], footer';
  var mediaSelector = 'img, video, picture, canvas';
  var initialTargets = new WeakSet();
  var viewportObserver = null;
  var fallbackFrame = null;

  function isMotionDisabled() {
    return document.documentElement.hasAttribute('data-motion-disabled') ||
      document.documentElement.hasAttribute('data-motion-static');
  }

  function getSequenceTargets(sequence) {
    var targets = [];

    Array.from(sequence.children).forEach(function (element, index) {
      element.style.setProperty('--motion-order', String(index));
      markMediaTarget(element);
      targets.push(element);
    });

    return targets;
  }

  // Why: media targets (images, video) do not get blur,
  // because filter on a large surface is expensive and looks worse.
  function markMediaTarget(element) {
    if (element.querySelector(mediaSelector)) {
      element.setAttribute('data-motion-media', '');
    }
  }

  function getAutoSections() {
    return Array.from(document.querySelectorAll(sectionSelector)).filter(function (section) {
      return !section.querySelector('[data-motion], [data-motion-sequence]');
    });
  }

  function getAutoLayout(section) {
    var container = Array.from(section.children).find(function (element) {
      return element.classList.contains('ui-container');
    }) || section.firstElementChild;

    if (!container) return null;
    return container.children.length === 1 ? container.firstElementChild || container : container;
  }

  // "Meaningful" children: without script/style, without absolutely positioned
  // decorations (axis lines, overlays) and without hidden elements
  // (form success/error messages) that should not animate.
  function getMeaningfulChildren(element) {
    return Array.from(element.children).filter(function (child) {
      if (child.tagName === 'SCRIPT' || child.tagName === 'STYLE') return false;
      if (child.hasAttribute('hidden')) return false;
      if (getComputedStyle(child).display === 'none') return false;
      return getComputedStyle(child).position !== 'absolute';
    });
  }

  // Text-like elements (p, span, label...) do not block container splitting
  // into units, but remain separate targets at the end of the sequence.
  function isTextLike(element) {
    return /^(P|SPAN|SMALL|LABEL|EM|STRONG)$/.test(element.tagName);
  }

  function hasSameTag(children) {
    if (children.length < 2) return false;
    var tag = children[0].tagName;
    return children.every(function (element) {
      return element.tagName === tag;
    });
  }

  // Visual box (background, border, shadow) is an atomic unit:
  // cards, buttons and form fields do not split internally,
  // even if they have many children. This ends the expansion recursion.
  function isVisualBox(element) {
    var style = getComputedStyle(element);
    if (style.backgroundColor !== 'rgba(0, 0, 0, 0)') return true;
    if (style.borderTopWidth !== '0px' || style.borderBottomWidth !== '0px') return true;
    if (style.borderLeftWidth !== '0px' || style.borderRightWidth !== '0px') return true;
    if (style.boxShadow !== 'none') return true;
    return false;
  }

  // Expanding a group into animation targets, recursively deep:
  // - marquee: descend to single cards (testimonials, logos),
  // - visual boxes (cards, buttons, fields) are atomic and end recursion,
  // - container with repeated units (same tag or only boxes,
  //   e.g. contact cards with a/div tag) splits into separate targets,
  // - chain of single wrappers: descend deeper,
  // - mixed groups (e.g. icon + text) stay as one unit.
  function expandGroup(group) {
    if (group.classList.contains('ui-marquee')) {
      // Marquee: ui-marquee > track > [grupa, kopia aria-hidden] > karty.
      // Expand both groups into cards, duplicate animates the same.
      var track = getMeaningfulChildren(group)[0];
      if (!track) return [group];
      var marqueeTargets = [];
      getMeaningfulChildren(track).forEach(function (sub) {
        expandGroup(sub).forEach(function (target) {
          marqueeTargets.push(target);
        });
      });
      return marqueeTargets.length > 0 ? marqueeTargets : [group];
    }

    var kids = getMeaningfulChildren(group);
    if (kids.length === 0) return [group];

    if (isVisualBox(group)) return [group];

    if (kids.length === 1) {
      var inner = expandGroup(kids[0]);
      return inner.length === 1 ? [group] : inner;
    }

    // Split into units: block children with same tag (cards, fields,
    // steps; text elements do not block the decision) or only visual
    // boxes (e.g. contact cards with a/div tag). Each unit is expanded
    // recursively, but boxes still end recursion.
    var blocks = kids.filter(function (kid) {
      return !isTextLike(kid);
    });
    if ((blocks.length >= 2 && hasSameTag(blocks)) || kids.every(isVisualBox)) {
      var targets = [];
      kids.forEach(function (kid) {
        expandGroup(kid).forEach(function (target) {
          targets.push(target);
        });
      });
      return targets.length > 0 ? targets : [group];
    }

    return [group];
  }

  function getAutoTargets(section) {
    var layout = getAutoLayout(section);
    if (!layout) return [];

    var groups = Array.from(layout.children).filter(function (element) {
      return element.tagName !== 'SCRIPT' && element.tagName !== 'STYLE';
    });

    if (groups.length === 0) return [layout];

    // Footers (globally): animate only the first content block (columns).
    // Last row (copyright, WebScale attribution) is NEVER hidden,
    // because at maximum scroll it might not cross the reveal threshold
    // and stay invisible forever. Single-block footers (minimal)
    // remain static.
    if (section.tagName === 'FOOTER') {
      var container = Array.from(section.children).find(function (element) {
        return element.classList.contains('ui-container');
      }) || section.firstElementChild;
      if (!container || container.children.length < 2) return [];
      groups = [groups[0]];
    }

    return groups.reduce(function (targets, group) {
      var directChildren = getMeaningfulChildren(group);
      var hasHeading = directChildren.some(function (element) {
        return /^H[1-6]$/.test(element.tagName);
      });

      // Header wrappers are split into elements in DOM order,
      // and each is further expanded (grids under the header).
      if (hasHeading && directChildren.length > 1) {
        directChildren.forEach(function (child) {
          expandGroup(child).forEach(function (target) {
            targets.push(target);
          });
        });
        return targets;
      }

      expandGroup(group).forEach(function (target) {
        targets.push(target);
      });
      return targets;
    }, []);
  }

  function prepareAutoSection(section) {
    section.setAttribute('data-motion-auto', '');

    getAutoTargets(section).forEach(function (element, index) {
      element.setAttribute('data-motion-auto-target', '');
      element.style.setProperty('--motion-auto-order', String(index));
      markMediaTarget(element);
    });
  }

  function collectTargets() {
    var targets = Array.from(document.querySelectorAll(selector));

    document.querySelectorAll(sequenceSelector).forEach(function (sequence) {
      getSequenceTargets(sequence).forEach(function (element) {
        if (!targets.includes(element)) targets.push(element);
      });
    });

    return targets;
  }

  function revealTargets() {
    if (isMotionDisabled()) return;

    var targets = collectTargets();
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    targets.forEach(function (element) {
      initialTargets.add(element);

      if (reducedMotion) {
        element.setAttribute('data-motion-visible', '');
        return;
      }

      // Two frames let the browser first apply the initial state,
      // then trigger the transition to the visible state.
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          element.setAttribute('data-motion-visible', '');
        });
      });
    });
  }

  function showTargetsImmediately() {
    if (isMotionDisabled()) return;

    // Astro transition handles full page change, so new hero must not stay hidden.
    collectTargets().forEach(function (element) {
      if (!initialTargets.has(element)) {
        element.setAttribute('data-motion-skip', '');
        element.setAttribute('data-motion-visible', '');
      }
    });
  }

  function revealViewportTarget(element) {
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        element.setAttribute('data-motion-visible', '');
      });
    });
  }

  // Dlaczego: Lenis i poziome marquee mogą zmienić położenie targetu bez
  // przekroczenia progu IntersectionObserver. Fallback domyka tylko elementy
  // widoczne w viewportcie, bez skanowania layoutu przy każdym scrollu.
  function revealVisibleFallback() {
    if (isMotionDisabled() || fallbackFrame !== null) return;

    fallbackFrame = requestAnimationFrame(function () {
      fallbackFrame = null;
      var visibleSelectors = [
        '[data-motion="fade"]',
        '[data-motion-sequence="fade"] > *',
        '[data-motion-sequence="viewport"] > *',
        '[data-motion-auto-target]'
      ].join(',');

      document.querySelectorAll(visibleSelectors).forEach(function (element) {
        if (!element.hasAttribute('data-motion-visible') && isInViewport(element)) {
          revealViewportTarget(element);
        }
      });
    });
  }

  function revealAutoSection(section) {
    getAutoTargets(section).forEach(function (element) {
      revealViewportTarget(element);
    });
  }

  // Entry wave: elements that entered the viewport in a short window
  // (80ms) get a shared, relative stagger in DOM order.
  // Without this each element would hit a separate observer callback,
  // get order 0 and the left-to-right cascade would not work.
  //
  // Why we do not overwrite --motion-auto-order: prepareAutoSection already sets
  // the global order (DOM order inside section). Overwriting it with batch index
  // resets the cascade to 0 on every entry wave, so e.g.
  // FAQ sections entering after scroll would get orders 0,1,2 instead of
  // 7,8,9 and animate in wrong order relative to the rest of section.
  var pendingBatch = [];
  var batchTimer = null;

  // Is element in viewport? Used at startup to reveal already visible
  // elements immediately (without waiting for 80ms wave), otherwise
  // a flash is visible: content flickers visible, then disappears and comes back.
  function isInViewport(element) {
    var rect = element.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0 && rect.left < window.innerWidth && rect.right > 0;
  }

  function flushBatch() {
    batchTimer = null;
    if (pendingBatch.length === 0) return;

    pendingBatch.sort(function (a, b) {
      if (a === b) return 0;
      return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
    });

    pendingBatch.forEach(function (target, index) {
      if (target.hasAttribute('data-motion-auto-target')) {
        // Keep prepared order from prepareAutoSection (DOM order),
        // so cascade is global for the whole section, not local to the wave.
        var existingOrder = target.style.getPropertyValue('--motion-auto-order');
        if (!existingOrder) {
          target.style.setProperty('--motion-auto-order', String(index));
        }
      } else {
        target.style.setProperty('--motion-order', String(index));
      }
      revealViewportTarget(target);
      viewportObserver.unobserve(target);
    });

    pendingBatch = [];
  }

  function setupViewportMotion() {
    if (viewportObserver) viewportObserver.disconnect();
    viewportObserver = null;
    if (batchTimer) clearTimeout(batchTimer);
    pendingBatch = [];

    if (isMotionDisabled()) return;

    var sequences = Array.from(document.querySelectorAll(viewportSequenceSelector));
    var autoSections = getAutoSections();
    if (sequences.length === 0 && autoSections.length === 0) return;

    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion || !('IntersectionObserver' in window)) {
      sequences.forEach(function (sequence) {
        getSequenceTargets(sequence).forEach(function (element) {
          element.setAttribute('data-motion-visible', '');
        });
      });
      autoSections.forEach(function (section) {
        prepareAutoSection(section);
        getAutoTargets(section).forEach(function (element) {
          element.setAttribute('data-motion-visible', '');
        });
      });
      return;
    }

    viewportObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        pendingBatch.push(entry.target);
      });
      if (pendingBatch.length > 0 && !batchTimer) {
        batchTimer = setTimeout(flushBatch, 80);
      }
    }, {
      // Why rootMargin 0: negative bottom margin (-12% viewport) caused
      // elements at the very bottom edge (e.g. footer bar)
      // to never cross the threshold at maximum scroll and stay
      // hidden forever. We observe targets themselves (cards, headings), not sections,
      // so margin is not needed.
      rootMargin: '0px',
      threshold: 0.15,
    });

    sequences.forEach(function (sequence) {
      getSequenceTargets(sequence).forEach(function (element) {
        if (isInViewport(element)) {
          pendingBatch.push(element);
        } else {
          viewportObserver.observe(element);
        }
      });
    });

    autoSections.forEach(function (section) {
      prepareAutoSection(section);
      // Observe each target separately, so cards animate
      // when they actually enter the viewport, not the whole section at once.
      getAutoTargets(section).forEach(function (element) {
        if (isInViewport(element)) {
          pendingBatch.push(element);
        } else {
          viewportObserver.observe(element);
        }
      });
    });

    // Reveal elements already visible at startup immediately,
    // without wave delay, so they do not flash "visible -> hidden".
    if (pendingBatch.length > 0) flushBatch();
  }

  function scheduleViewportMotion() {
    requestAnimationFrame(function () {
      setupViewportMotion();
    });
  }

  function prepareNextDocument(event) {
    var nextDocument = event.newDocument;

    if (!nextDocument || !nextDocument.documentElement) return;

    if (
      nextDocument.documentElement.hasAttribute('data-motion-disabled') ||
      nextDocument.documentElement.hasAttribute('data-motion-static')
    ) {
      nextDocument.documentElement.removeAttribute('data-motion-ready');
      return;
    }

    // Astro swaps html attributes, so new page must get motion state before swap.
    nextDocument.documentElement.setAttribute('data-motion-ready', '');
  }

  document.addEventListener('astro:page-load', showTargetsImmediately);
  document.addEventListener('astro:page-load', scheduleViewportMotion);
  document.addEventListener('astro:after-swap', scheduleViewportMotion);
  window.addEventListener('scroll', revealVisibleFallback, { passive: true });
  window.addEventListener('resize', revealVisibleFallback, { passive: true });
  document.addEventListener('astro:before-swap', function (event) {
    prepareNextDocument(event);

    if (viewportObserver) viewportObserver.disconnect();
    viewportObserver = null;
  });

  revealTargets();
  setupViewportMotion();
})();
