import PropTypes from 'prop-types';
import { createContext, useReducer, useContext } from 'react';

// project imports
import * as actionType from 'store/actions';
import { CONFIG } from 'config/constant';

// initial state (spreads CONFIG from your config/constant)
const initialState = {
  ...CONFIG,
  isOpen: [], // for active default menu
  isTrigger: [] // for active default menu, set blank for horizontal
};

// create context
const ConfigContext = createContext({});
const { Provider } = ConfigContext;

/**
 * ConfigProvider
 * - Provides { state, dispatch } to consumers via context
 */
function ConfigProvider({ children }) {
  let trigger = [];
  let open = [];

  const [state, dispatch] = useReducer((stateData, action) => {
    switch (action.type) {
      case actionType.COLLAPSE_MENU:
        return {
          ...stateData,
          collapseMenu: !stateData.collapseMenu
        };
      case actionType.COLLAPSE_HEADERMENU:
        return {
          ...stateData,
          collapseHeaderMenu: !stateData.collapseHeaderMenu
        };

      case actionType.COLLAPSE_TOGGLE:
        if (action.menu.type === 'sub') {
          open = stateData.isOpen;
          trigger = stateData.isTrigger;

          const triggerIndex = trigger.indexOf(action.menu.id);
          if (triggerIndex > -1) {
            open = open.filter((item) => item !== action.menu.id);
            trigger = trigger.filter((item) => item !== action.menu.id);
          }

          if (triggerIndex === -1) {
            open = [...open, action.menu.id];
            trigger = [...trigger, action.menu.id];
            trigger = [...trigger, action.menu.id];
          }
        } else {
          open = stateData.isOpen;
          const triggerIndex = stateData.isTrigger.indexOf(action.menu.id);
          trigger = triggerIndex === -1 ? [action.menu.id] : [];
          open = triggerIndex === -1 ? [action.menu.id] : [];
        }

        return {
          ...stateData,
          isOpen: open,
          isTrigger: trigger
        };
      default:
        throw new Error(`Unhandled action type: ${action?.type}`);
    }
  }, initialState);

  return (
    <Provider value={{ state, dispatch }}>
      {children}
    </Provider>
  );
}

/**
 * useConfig hook
 * - Returns a flattened config object for easy destructuring:
 *    const { isCollapsed, collapseMenu, isOpen, dispatch } = useConfig();
 *
 * - Also provides backward/forward compatibility by mapping likely aliases:
 *    isCollapsed -> collapseMenu
 */
function useConfig() {
  const context = useContext(ConfigContext);
  if (!context || !context.state) {
    throw new Error('useConfig must be used inside a ConfigProvider');
  }

  const { state, dispatch } = context;

  // Map common aliases to ensure older components keep working.
  // If your CONFIG already defines these keys, these will not overwrite them.
  const mapped = {
    ...state,
    // compatibility alias: many components may expect isCollapsed
    isCollapsed: state.isCollapsed ?? state.collapseMenu ?? false,
    // keep explicit collapseMenu as well
    collapseMenu: state.collapseMenu ?? state.isCollapsed ?? false,
    // keep original arrays
    isOpen: state.isOpen ?? [],
    isTrigger: state.isTrigger ?? [],
    // provide dispatch for actions
    dispatch
  };

  return mapped;
}

export { ConfigContext, ConfigProvider, useConfig };

ConfigProvider.propTypes = { children: PropTypes.any };
