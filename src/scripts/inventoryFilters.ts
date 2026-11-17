/**
 * Client-side filtering, searching and sorting for the inventory page.
 *
 * The server renders every product card. This module reads the data-*
 * attributes that ProductGrid puts on each item and shows, hides and reorders
 * the existing elements — it never builds product markup itself.
 *
 * Markup contract (all inside the [data-inventory] root):
 *   [data-filter-search]            search input
 *   [data-filter-chip="category"]   category chips, with data-value
 *   [data-filter-select="<key>"]    condition / availability / sort selects
 *   [data-filter-count]             live result count
 *   [data-filter-open]              opens the filter sheet
 *   [data-filter-clear]             resets every filter
 *   [data-active-filters]           removable chips for applied filters
 *   [data-product-list]             the list; items are [data-product-item]
 *   [data-empty-state]              shown when nothing matches
 *   [data-filter-sheet]             <dialog> with [data-draft="<key>"] chips
 */

const ANY = 'any';

type FilterKey = 'category' | 'condition' | 'availability';
type SortOrder = 'featured' | 'name-asc' | 'name-desc';
type Filters = Record<FilterKey, string>;

interface State extends Filters {
  query: string;
  sort: SortOrder;
}

const FILTER_KEYS: FilterKey[] = ['category', 'condition', 'availability'];
const NO_FILTERS: Filters = { category: ANY, condition: ANY, availability: ANY };

function pluralize(count: number): string {
  return `${count} ${count === 1 ? 'item' : 'items'}`;
}

function matches(item: HTMLElement, filters: Filters, query: string): boolean {
  const passesFilters = FILTER_KEYS.every(
    (key) => filters[key] === ANY || item.dataset[key] === filters[key],
  );
  return passesFilters && (query === '' || (item.dataset.search ?? '').includes(query));
}

export function initInventoryFilters(): void {
  const root = document.querySelector<HTMLElement>('[data-inventory]');
  const list = root?.querySelector<HTMLElement>('[data-product-list]');
  if (!root || !list) return;

  const items = Array.from(list.querySelectorAll<HTMLElement>('[data-product-item]'));
  const labels = JSON.parse(root.dataset.labels ?? '{}') as Record<
    FilterKey,
    Record<string, string>
  >;

  const searchInput = root.querySelector<HTMLInputElement>('[data-filter-search]');
  const categoryChips = root.querySelectorAll<HTMLElement>('[data-filter-chip="category"]');
  const selects = root.querySelectorAll<HTMLSelectElement>('[data-filter-select]');
  const count = root.querySelector<HTMLElement>('[data-filter-count]');
  const openLabel = root.querySelector<HTMLElement>('[data-filter-open-label]');
  const emptyState = root.querySelector<HTMLElement>('[data-empty-state]');
  const activeBar = root.querySelector<HTMLElement>('[data-active-filters]');
  const activeList = root.querySelector<HTMLElement>('[data-active-list]');
  const activeTemplate = root.querySelector<HTMLTemplateElement>('[data-active-template]');
  const sheet = root.querySelector<HTMLDialogElement>('[data-filter-sheet]');
  const draftChips = root.querySelectorAll<HTMLElement>('[data-draft]');
  const applyButton = root.querySelector<HTMLElement>('[data-sheet-apply]');

  const state: State = { ...NO_FILTERS, query: '', sort: 'featured' };
  /** Choices made in the sheet that are not applied yet. */
  let draft: Filters = { ...NO_FILTERS };

  const normalizedQuery = () => state.query.trim().toLowerCase();

  // ---- Rendering ----------------------------------------------------------

  function renderResults(): void {
    const query = normalizedQuery();
    const visible = items.filter((item) => matches(item, state, query));

    items.forEach((item) => {
      item.hidden = !visible.includes(item);
    });

    const ordered = [...items];
    if (state.sort !== 'featured') {
      const direction = state.sort === 'name-asc' ? 1 : -1;
      ordered.sort(
        (a, b) => direction * (a.dataset.name ?? '').localeCompare(b.dataset.name ?? ''),
      );
    }
    list!.append(...ordered);

    if (count) count.textContent = pluralize(visible.length);
    list!.hidden = visible.length === 0;
    if (emptyState) emptyState.hidden = visible.length > 0;
  }

  function renderControls(): void {
    categoryChips.forEach((chip) => {
      chip.setAttribute('aria-pressed', String(chip.dataset.value === state.category));
    });
    selects.forEach((select) => {
      const key = select.dataset.filterSelect as FilterKey | 'sort';
      select.value = state[key];
    });
    if (searchInput && searchInput.value !== state.query) searchInput.value = state.query;

    const sheetFilterCount = [state.condition, state.availability].filter(
      (value) => value !== ANY,
    ).length;
    if (openLabel) {
      openLabel.textContent = sheetFilterCount ? `Filter (${sheetFilterCount})` : 'Filter';
    }
  }

  function renderActiveFilters(): void {
    if (!activeBar || !activeList || !activeTemplate) return;
    const active = FILTER_KEYS.filter((key) => state[key] !== ANY);
    activeList.replaceChildren(
      ...active.map((key) => {
        const label = labels[key]?.[state[key]] ?? state[key];
        const fragment = activeTemplate.content.cloneNode(true) as DocumentFragment;
        const chip = fragment.querySelector<HTMLElement>('[data-active-chip]')!;
        chip.querySelector('[data-active-label]')!.textContent = label;
        chip.setAttribute('aria-label', `Remove filter ${label}`);
        chip.addEventListener('click', () => update({ [key]: ANY }));
        return fragment;
      }),
    );
    activeBar.hidden = active.length === 0;
  }

  function renderDraft(): void {
    draftChips.forEach((chip) => {
      const key = chip.dataset.draft as FilterKey;
      chip.setAttribute('aria-pressed', String(chip.dataset.value === draft[key]));
    });
    if (applyButton) {
      const query = normalizedQuery();
      const total = items.filter((item) => matches(item, draft, query)).length;
      applyButton.textContent = `Show ${pluralize(total)}`;
    }
  }

  /** Keeps the category in the URL so filtered views can be linked to. */
  function syncUrl(): void {
    const url = new URL(window.location.href);
    if (state.category === ANY) url.searchParams.delete('category');
    else url.searchParams.set('category', state.category);
    window.history.replaceState(null, '', url);
  }

  function update(changes: Partial<State>): void {
    Object.assign(state, changes);
    renderResults();
    renderControls();
    renderActiveFilters();
    syncUrl();
  }

  // ---- Events -------------------------------------------------------------

  searchInput?.addEventListener('input', () => update({ query: searchInput.value }));

  categoryChips.forEach((chip) => {
    chip.addEventListener('click', () => update({ category: chip.dataset.value ?? ANY }));
  });

  selects.forEach((select) => {
    select.addEventListener('change', () => {
      update({ [select.dataset.filterSelect as string]: select.value });
    });
  });

  root.querySelectorAll('[data-filter-clear]').forEach((button) => {
    button.addEventListener('click', () => update({ ...NO_FILTERS, query: '' }));
  });

  if (sheet) {
    root.querySelector('[data-filter-open]')?.addEventListener('click', () => {
      draft = {
        category: state.category,
        condition: state.condition,
        availability: state.availability,
      };
      renderDraft();
      sheet.showModal();
    });

    draftChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        draft[chip.dataset.draft as FilterKey] = chip.dataset.value ?? ANY;
        renderDraft();
      });
    });

    sheet.querySelector('[data-sheet-reset]')?.addEventListener('click', () => {
      draft = { ...NO_FILTERS };
      renderDraft();
    });

    applyButton?.addEventListener('click', () => {
      update(draft);
      sheet.close();
    });

    sheet.querySelector('[data-sheet-close]')?.addEventListener('click', () => sheet.close());

    // A click on the dialog element itself (not its panel) is a backdrop click.
    sheet.addEventListener('click', (event) => {
      if (event.target === sheet) sheet.close();
    });
  }

  // ---- Initial state ------------------------------------------------------

  const requestedCategory = new URLSearchParams(window.location.search).get('category');
  if (requestedCategory && labels.category?.[requestedCategory]) {
    state.category = requestedCategory;
  }
  update({});
}
