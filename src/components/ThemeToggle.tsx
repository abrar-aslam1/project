import styled from 'styled-components';

interface ThemeToggleProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

const StyledToggle = styled.div`
  .theme-toggle {
    --toggle-size: 50px;
    --transition: 300ms;
  }

  .theme-toggle__checkbox {
    display: none;
  }

  .theme-toggle__container {
    width: var(--toggle-size);
    height: var(--toggle-size);
    position: relative;
    border-radius: 9999px;
    cursor: pointer;
    background: linear-gradient(to bottom right, rgba(168, 85, 247, 0.1), rgba(59, 130, 246, 0.1));
    transition: var(--transition);
    perspective: 500px;
    transform-style: preserve-3d;
    overflow: hidden;
  }

  .dark .theme-toggle__container {
    background: linear-gradient(to bottom right, rgba(168, 85, 247, 0.2), rgba(59, 130, 246, 0.2));
  }

  .theme-toggle__container:hover {
    background: linear-gradient(to bottom right, rgba(168, 85, 247, 0.2), rgba(59, 130, 246, 0.2));
  }

  .dark .theme-toggle__container:hover {
    background: linear-gradient(to bottom right, rgba(168, 85, 247, 0.3), rgba(59, 130, 246, 0.3));
  }

  .theme-toggle__logo {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform var(--transition);
    backface-visibility: hidden;
  }

  .theme-toggle__logo img {
    width: 32px;
    height: 32px;
    object-fit: contain;
  }

  .theme-toggle__logo--dark {
    transform: rotateY(180deg);
  }

  .theme-toggle__checkbox:checked + .theme-toggle__container .theme-toggle__logo--light {
    transform: rotateY(180deg);
  }

  .theme-toggle__checkbox:checked + .theme-toggle__container .theme-toggle__logo--dark {
    transform: rotateY(0);
  }
`;

export function ThemeToggle({ isDarkMode, onToggleDarkMode }: ThemeToggleProps) {
  return (
    <StyledToggle>
      <label className="theme-toggle">
        <input 
          type="checkbox" 
          className="theme-toggle__checkbox" 
          checked={isDarkMode}
          onChange={onToggleDarkMode}
        />
        <div className="theme-toggle__container">
          <div className="theme-toggle__logo theme-toggle__logo--light">
            <img src="/tokenuer-logo.png" alt="Light mode" />
          </div>
          <div className="theme-toggle__logo theme-toggle__logo--dark">
            <img src="/tokenuer-logo.png" alt="Dark mode" />
          </div>
        </div>
      </label>
    </StyledToggle>
  );
}
