/**
 * BreakpointManager
 *
 * @author Christian Sany
 * @copyright Unic AG
 */

import observer from '@unic/composite-observer';
import throttle from 'raf-throttle';

const defaultBreakpoints = {
  xs: 0,
  sm: 768,
  md: 992,
  lg: 1200,
};

// Factory createBreakpointManager
export default ({ breakpoints = defaultBreakpoints, unit = 'px' } = {}) => {
  const instance = {};
  breakpoints = Object.entries(breakpoints) // eslint-disable-line
    .map(([key, val]) => ({
      name: key,
      minWidth: val,
    }))
    .sort((a, b) => a.minWidth - b.minWidth);

  const state = {
    width: 0,
    breakpoint: breakpoints[0].name,
  };

  // **Composition**

  Object.assign(instance, observer());

  // **Private functions**

  /**
   * Get the window with depending on the unit
   * @return {Integer/Float}
   */
  const getWindowWidth = () => {
    switch (unit) {
      case 'px':
        return document.body.offsetWidth;
      case 'em':
        return (
          document.body.offsetWidth /
          parseFloat(window.getComputedStyle(document.body).fontSize)
        );
      default:
        throw new Error('Please provide either px or em as unit');
    }
  };

  /**
   * Set the new state
   */
  const setState = () => {
    const oldState = Object.assign({}, state); // Cache old state

    const width = getWindowWidth(); // document.body.offsetWidth;
    const matchingBreakpoints = breakpoints.filter(bp => width >= bp.minWidth);

    // Assign new state values
    state.width = width;
    state.breakpoint = matchingBreakpoints[matchingBreakpoints.length - 1]; // Last matching entry

    // Check silent option and if brakpoint changed
    if (state.breakpoint.name !== oldState.breakpoint.name) {
      instance.trigger('change', oldState, state); // Trigger change event
    }
  };

  /**
   * Throttled resize handler
   */
  const resizeHandler = throttle(() => {
    setState();
    instance.trigger('resize', state); // Trigger resize event
  });

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
   * Match the current breakpoint with given breakpoint or array of breakpoints
   * @param {String|Array} match - The desired match/matches that should be checked for
   * @return {Boolean} - Returns true if current breakpoint is maching any given breakpoint
   */
  instance.matches = match => {
    if (!match) {
      throw new Error('match() expected one parameter.');
    }

    if (typeof match === 'string') {
      return match === state.breakpoint.name;
    } else if (Array.isArray(match)) {
      return match.includes(state.breakpoint.name);
    }

    throw new Error(
      'Sorry man, it seems your given value is neither of type string nor is it an array.',
    );
  };

  /**
   * Unbind events, remove data, custom teardown
   */
  instance.destroy = () => {
    removeEventListeners();
    instance.trigger('destroy'); // Notify all listeners this instance is beeing destroyed
  };

  // **Initiation logic**

  initEventListeners();

  // Set initial state
  setState();

  return instance; // Expose instance
};
