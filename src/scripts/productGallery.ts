/** Switches the visible gallery panel when a thumbnail is pressed. */
export function initProductGallery(): void {
  document.querySelectorAll<HTMLElement>('[data-gallery]').forEach((gallery) => {
    const panels = gallery.querySelectorAll<HTMLElement>('[data-gallery-panel]');
    const thumbs = gallery.querySelectorAll<HTMLElement>('[data-gallery-thumb]');

    thumbs.forEach((thumb, index) => {
      thumb.addEventListener('click', () => {
        panels.forEach((panel, panelIndex) => {
          panel.hidden = panelIndex !== index;
        });
        thumbs.forEach((other, otherIndex) => {
          other.setAttribute('aria-pressed', String(otherIndex === index));
        });
      });
    });
  });
}
