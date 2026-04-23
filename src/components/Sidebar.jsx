import { useTheme } from '../context/ThemeContext';

export default function Sidebar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="sidebar" aria-label="Application navigation">
      <div className="sidebar__logo" aria-label="Invoice App">
        <svg width="28" height="26" viewBox="0 0 28 26" fill="none" aria-hidden="true">
          <path fillRule="evenodd" clipRule="evenodd"
            d="M14 0L28 26H14V13L0 26V0H14Z" fill="white" fillOpacity="0.5"/>
          <path fillRule="evenodd" clipRule="evenodd"
            d="M14 26V13L28 26H14Z" fill="white"/>
        </svg>
      </div>

      <div className="sidebar__bottom">
        <button
          className="sidebar__theme-btn"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d="M10 2V1M10 19v-1M2 10H1M19 10h-1M4.22 4.22l-.71-.71M16.49 16.49l-.71-.71M4.22 15.78l-.71.71M16.49 3.51l-.71.71M7 10a3 3 0 106 0 3 3 0 00-6 0z"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
                stroke="currentColor" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
          )}
        </button>

        <div className="sidebar__divider" aria-hidden="true" />

        <div className="sidebar__avatar" aria-label="User profile">KA</div>
      </div>
    </aside>
  );
}
