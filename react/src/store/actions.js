// Action Types
export const COLLAPSE_MENU = 'COLLAPSE_MENU';
export const COLLAPSE_HEADERMENU = 'COLLAPSE_HEADERMENU';
export const COLLAPSE_TOGGLE = 'COLLAPSE_TOGGLE';
export const PAGE_TYPE = 'PAGE_TYPE';

// Action Creators
export const collapseMenu = () => ({
  type: COLLAPSE_MENU
});

export const collapseHeaderMenu = (collapsed) => ({
  type: COLLAPSE_HEADERMENU,
  collapsed
});

export const toggleCollapse = (menu) => ({
  type: COLLAPSE_TOGGLE,
  menu
});

export const setPageType = (pageType) => ({
  type: PAGE_TYPE,
  pageType
});
