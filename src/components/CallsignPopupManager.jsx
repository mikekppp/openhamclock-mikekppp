/**
 * CallsignPopupManager — singleton context provider for callsign popups.
 *
 * Renders a <CallsignPopup> whenever a callsign is requested. Provides
 * a hook (useCallsignPopup) so any component can request/show a popup.
 *
 * Usage in any component:
 *   const { showPopup } = useCallsignPopup();
 *   <CallsignLink call={spot.call} onClick={(e) =>
 *     showPopup(spot.call, e.currentTarget)
 *   } />
 */
import { createContext, useContext, useState, useCallback, useRef } from 'react';
import CallsignPopup from './CallsignPopup.jsx';

const CallsignPopupContext = createContext(null);

export function CallsignPopupProvider({ children }) {
  const [popupState, setPopupState] = useState({ open: false, call: null, anchorRef: null, location: null });
  const anchorRef = useRef(null);
  const popupHeightRef = useRef(160); // default estimate, updated by popup after render

  const showPopup = useCallback((call, anchorEl, location) => {
    anchorRef.current = anchorEl;
    setPopupState({ open: true, call, anchorRef, location });
  }, []);

  const hidePopup = useCallback(() => {
    setPopupState({ open: false, call: null, anchorRef: null, location: null });
  }, []);

  return (
    <CallsignPopupContext.Provider value={{ showPopup, hidePopup }}>
      {children}
      {popupState.open && popupState.call && (
        <CallsignPopup
          anchorRef={popupState.anchorRef}
          call={popupState.call}
          location={popupState.location}
          onClose={hidePopup}
          popupHeightRef={popupHeightRef}
        />
      )}
    </CallsignPopupContext.Provider>
  );
}

export function useCallsignPopup() {
  const ctx = useContext(CallsignPopupContext);
  if (!ctx) {
    throw new Error('useCallsignPopup must be used within a CallsignPopupProvider');
  }
  return ctx;
}

export default CallsignPopupProvider;
