import styled from 'styled-components';

interface ThemeToggleProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

const StyledToggle = styled.div`
  .theme-toggle {
    --toggle-size: 16px;
    --toggle-width: 10.625em;
    --toggle-height: 5.625em;
    --toggle-offset: calc((var(--toggle-height) - 4.375em) / 2);
    --toggle-bg: linear-gradient(#2c4770, #070e2b 35%, #628cac 50% 70%, #a6c5d4) no-repeat;
    --radius: 99em;
    --transition: 0.4s;
    font-size: var(--toggle-size);
    cursor: pointer;
  }

  .theme-toggle__checkbox {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    display: none;
  }

  .theme-toggle__container {
    width: var(--toggle-width);
    height: var(--toggle-height);
    background: var(--toggle-bg);
    background-size: 100% 11.25em;
    background-position-y: -5.625em;
    border-radius: var(--radius);
    position: relative;
    transition: var(--transition);
  }

  .theme-toggle__scenery {
    width: 100%;
    height: 100%;
    pointer-events: none;
    overflow: hidden;
    position: relative;
    border-radius: inherit;
  }

  .theme-toggle__scenery::before {
    content: "";
    position: absolute;
    width: 100%;
    height: 30%;
    bottom: 0;
    background: #b18d71;
    z-index: 1;
  }

  .theme-toggle__star {
    position: absolute;
    width: 0.063em;
    height: 0.063em;
    background: #fff;
    border-radius: var(--radius);
    filter: drop-shadow(0 0 0.063em #fff);
    color: #fff;
    top: 100%;
  }

  .theme-toggle__star:nth-child(1) {
    left: 3.75em;
    box-shadow: 1.25em 0.938em, -1.25em 2.5em, 0 1.25em, 1.875em 0.625em,
      -3.125em 1.875em, 1.25em 2.813em;
    transition: 0.2s;
  }

  .theme-toggle__star:nth-child(2) {
    left: 4.688em;
    box-shadow: 0.625em 0, 0 0.625em, -0.625em -0.625em, 0.625em 0.938em,
      -3.125em 1.25em, 1.25em -1.563em;
    transition: 0.3s;
  }

  .theme-toggle__star:nth-child(3) {
    left: 5.313em;
    box-shadow: -0.625em -0.625em, -2.188em 1.25em, -2.188em 0, -3.75em -0.625em,
      -3.125em -0.625em, -2.5em -0.313em, 0.75em -0.625em;
    transition: var(--transition);
  }

  .theme-toggle__cloud {
    z-index: 1;
    position: absolute;
    border-radius: 50%;
  }

  .theme-toggle__cloud:nth-last-child(1) {
    width: 0.875em;
    height: 0.625em;
    filter: blur(0.125em) drop-shadow(0.313em 0.313em #ffffffae)
      drop-shadow(-0.625em 0 #fff) drop-shadow(-0.938em -0.125em #fff);
    right: 1.875em;
    top: 2.813em;
    background: linear-gradient(to top right, #ffffffae, #ffffffae);
    transition: var(--transition);
  }

  .theme-toggle__cloud:nth-last-child(2) {
    top: 0.625em;
    right: 4.375em;
    width: 0.875em;
    height: 0.375em;
    background: #dfdedeae;
    filter: blur(0.125em) drop-shadow(-0.313em -0.188em #e0dfdfae)
      drop-shadow(-0.625em -0.188em #bbbbbbae) drop-shadow(-1em 0.063em #cfcfcfae);
    transition: 0.6s;
  }

  .theme-toggle__cloud:nth-last-child(3) {
    top: 1.25em;
    right: 0.938em;
    width: 0.875em;
    height: 0.375em;
    background: #ffffffae;
    filter: blur(0.125em) drop-shadow(0.438em 0.188em #ffffffae)
      drop-shadow(-0.625em 0.313em #ffffffae);
    transition: 0.8s;
  }

  .logo-container {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: calc(var(--toggle-offset));
    left: var(--toggle-offset);
    width: 4.375em;
    height: 4.375em;
    transition: var(--transition);
    z-index: 2;
  }

  .logo {
    width: 100%;
    height: 100%;
    object-fit: contain;
    transition: var(--transition);
    transform: rotate(0deg);
  }

  .logo-shadow {
    content: "";
    width: 4.375em;
    height: 20%;
    border-radius: 50%;
    background: #3a271c;
    box-shadow: 0.313em 0 3.125em #3a271c;
    opacity: 0.25;
    position: absolute;
    bottom: 0;
    left: calc(var(--toggle-offset) - 0.938em);
    transition: var(--transition);
    transform: skew(-70deg);
    z-index: 1;
  }

  /* Checked state animations */
  .theme-toggle__checkbox:checked + .theme-toggle__container .theme-toggle__star:nth-child(1) {
    top: 0.625em;
  }

  .theme-toggle__checkbox:checked + .theme-toggle__container .theme-toggle__star:nth-child(2) {
    top: 1.875em;
  }

  .theme-toggle__checkbox:checked + .theme-toggle__container .theme-toggle__star:nth-child(3) {
    top: 1.25em;
  }

  .theme-toggle__checkbox:checked + .theme-toggle__container .theme-toggle__cloud {
    right: -100%;
  }

  .theme-toggle__checkbox:checked + .theme-toggle__container .logo-container {
    left: calc(100% - 4.375em - var(--toggle-offset));
  }

  .theme-toggle__checkbox:checked + .theme-toggle__container .logo {
    transform: rotate(225deg);
  }

  .theme-toggle__checkbox:checked + .theme-toggle__container .logo-shadow {
    left: calc(100% - 4.375em - var(--toggle-offset) + 0.938em);
    transform: skew(70deg);
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
          <div className="theme-toggle__scenery">
            <div className="theme-toggle__star" />
            <div className="theme-toggle__star" />
            <div className="theme-toggle__star" />
            <div className="theme-toggle__cloud" />
            <div className="theme-toggle__cloud" />
            <div className="theme-toggle__cloud" />
          </div>
          <div className="logo-container">
            <img src="/tokenuer-logo.png" alt="Theme toggle" className="logo" />
          </div>
          <div className="artificial__hidden">
            <div className="logo-shadow" />
          </div>
        </div>
      </label>
    </StyledToggle>
  );
}
