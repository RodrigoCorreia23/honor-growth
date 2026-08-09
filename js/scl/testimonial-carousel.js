window.HonorTestimonialCarousel = (function () {
  'use strict';

  function init() {
    var track = document.querySelector('.hg-tstrip');
    if (!track) return;
    var cards = Array.prototype.slice.call(track.querySelectorAll('.hg-tstrip-card'));
    if (!cards.length) return;

    function updatePadding() {
      var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      var totalWidth = cards.reduce(function (sum, card) { return sum + card.offsetWidth; }, 0);
      totalWidth += gap * (cards.length - 1);
      var pad = Math.max(0, (track.clientWidth - totalWidth) / 2);
      track.style.paddingLeft = pad + 'px';
      track.style.paddingRight = pad + 'px';
    }

    function centerX(el) {
      var rect = el.getBoundingClientRect();
      return rect.left + rect.width / 2;
    }

    function nearestCard() {
      var trackCenter = centerX(track);
      var closest = null;
      var closestDist = Infinity;
      cards.forEach(function (card) {
        var dist = Math.abs(centerX(card) - trackCenter);
        if (dist < closestDist) { closestDist = dist; closest = card; }
      });
      return closest;
    }

    function updateActive() {
      var closest = nearestCard();
      cards.forEach(function (card) { card.classList.toggle('is-active', card === closest); });
    }

    /* Calcula o scrollLeft manualmente em vez de usar scrollIntoView:
       scrollIntoView pode "subir" e rolar um ancestral fora do carrossel
       (a própria página) se o browser não considerar o track scrollável
       no momento — mexendo a landing page inteira em vez de só do track. */
    function scrollLeftFor(card) {
      var trackRect = track.getBoundingClientRect();
      var cardRect = card.getBoundingClientRect();
      var offset = (cardRect.left + cardRect.width / 2) - (trackRect.left + trackRect.width / 2);
      return track.scrollLeft + offset;
    }

    function centerCardInstant(card) {
      track.scrollLeft = scrollLeftFor(card);
    }

    var rafPending = false;
    function onScroll() {
      if (rafPending) return;
      rafPending = true;
      requestAnimationFrame(function () { updateActive(); rafPending = false; });
    }

    track.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', function () {
      var current = track.querySelector('.hg-tstrip-card.is-active') || cards[0];
      updatePadding();
      centerCardInstant(current);
      updateActive();
    });

    /* Arraste com o rato (o toque já tem scroll nativo).
       Só capturamos o ponteiro depois de confirmar que é mesmo um arraste
       (>3px) — capturar já no pointerdown desviaria o "click" do alvo real
       (botões, vídeo) para o track, quebrando o play/mute e o clique
       lateral que centra o carrossel. */
    var isDown = false;
    var moved = false;
    var startX = 0;
    var startScroll = 0;
    var activePointerId = null;

    track.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'touch') return;
      isDown = true;
      moved = false;
      startX = e.clientX;
      startScroll = track.scrollLeft;
      activePointerId = e.pointerId;
    });

    track.addEventListener('pointermove', function (e) {
      if (!isDown) return;
      var dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 3) {
        moved = true;
        track.classList.add('is-dragging');
        try { track.setPointerCapture(activePointerId); } catch (err) {}
      }
      if (moved) { track.scrollLeft = startScroll - dx; }
    });

    function endDrag() {
      if (!isDown) return;
      isDown = false;
      track.classList.remove('is-dragging');
      if (moved && activePointerId !== null) {
        try { track.releasePointerCapture(activePointerId); } catch (err) {}
      }
      /* scrollLeft definido via JS não aciona o scroll-snap nativo — sem
         isto o carrossel pode ficar parado "entre" dois vídeos depois de
         um arraste, em vez de voltar a centrar um deles. */
      if (moved) {
        var target = nearestCard();
        if (target) centerCard(target);
      }
    }

    track.addEventListener('pointerup', endDrag);
    track.addEventListener('pointerleave', endDrag);
    track.addEventListener('pointercancel', endDrag);

    function centerCard(card) {
      var supportsSmooth = 'scrollBehavior' in document.documentElement.style;
      if (supportsSmooth) {
        track.scrollTo({ left: scrollLeftFor(card), behavior: 'smooth' });
      } else {
        track.scrollLeft = scrollLeftFor(card);
      }
    }

    /* Clicar num vídeo lateral "gira" o carrossel até ele ficar ao centro;
       só o vídeo já central deixa o clique passar para o play/mute.
       Também evita disparar o play/pause logo após um arraste. */
    cards.forEach(function (card) {
      card.addEventListener('click', function (e) {
        if (moved) { e.stopPropagation(); e.preventDefault(); return; }
        if (!card.classList.contains('is-active')) {
          e.stopPropagation();
          e.preventDefault();
          centerCard(card);
        }
      }, true);
    });

    /* Começa com o vídeo do MEIO da lista em foco (não o primeiro) —
       é o que faz o carrossel parecer "um ao centro, os outros do lado". */
    var middleIndex = Math.floor((cards.length - 1) / 2);
    updatePadding();
    centerCardInstant(cards[middleIndex]);
    updateActive();
  }

  return { init: init };
}());
