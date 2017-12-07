/*!
 * MediaQuery
 *
 * @author Christian Sany
 * @copyright Unic AG
 */
import observer from './index';
import debounce from 'debounce';

// Bootstrap breakpoints are the default
export const defaultConfig = [
  {
    name: 'xs',
    minWidth: 0, // in pixel
  },
  {
    name: 'sm',
    minWidth: 768, // in pixel
  },
  {
    name: 'md',
    minWidth: 992, // in pixel
  },
  {
    name: 'lg',
    minWidth: 1200, // in pixel
  },
];

// Factory createMediaQueryHandler
export default (config = defaultConfig) => {
  const instance = {};

  const state = {
    width: 0,
    breakpoint: config[0].name,
  };

  // **Composition**

  Object.assign(instance, observer());

  // **Private functions**

  /**
   * TODO
   * @param {Boolean} silent - TODO
   */
  const setState = (silent = false) => {
    const oldState = Object.assign({}, state); // Cache old state

    const width = window.innerWidth;
    const matchingBreakpoints = config.filter(bp => width >= bp.minWidth);

    // Assign new state values
    state.width = width;
    state.breakpoint = matchingBreakpoints[matchingBreakpoints.length - 1]; // Last matching entry

    // Check silent option and if brakpoint changed
    if (!silent && state.breakpoint !== oldState.breakpoint) {
      state.trigger('change', oldState, state); // Trigger change event
    }
  };

  // TODO: maybe refactor as throttle and not debounce
  const resizeHandler = debounce(() => {
    setState();
    state.trigger('resize', state); // Trigger resize event
  }, 100);

  /**
   * Event listeners initialisation
   */
  const initEventListeners = () => {
    window.addEventListener('resize', resizeHandler);
  };

  /**
   * Event listeners removal
   */
  const removeEventListeners = () => {
    window.removeEventListener('resize', resizeHandler);
  };

  // **Public functions**

  /**
   * Return state object that is decoupled from internal state
   */
  instance.getState = () => Object.assign({}, state);

  /**
   * Unbind events, remove data, custom teardown
   */
  instance.destroy = () => {
    removeEventListeners();
    instance.trigger('destroy'); // Notify all listeners this instance is beeing destroyed
  };

  // **Initiation logic**

  initEventListeners();

  // Set initial state in silence mode (even though noone could be subscribed at this point)
  setState(true);

  return instance; // Expose instance
};
