import styled from 'styled-components';

interface ThemeToggleProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

const StyledToggle = styled.div`
  .theme-toggle {
    --toggle-size: 14px;
    --toggle-width: 10em;
    --toggle-height: 4em;
    --toggle-offset: calc((var(--toggle-height) - 3em) / 2);
    --toggle-bg: linear-gradient(180deg, 
      #0a0426 0%,
      #1a0f3c 25%,
      #2d1558 50%,
      #1a0f3c 75%,
      #0a0426 100%
    );
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
    border-radius: var(--radius);
    position: relative;
    transition: var(--transition);
    perspective: 1000px;
    overflow: hidden;
  }

  .theme-toggle__container::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 30% 50%, rgba(147, 51, 234, 0.15), transparent 50%),
                radial-gradient(circle at 70% 50%, rgba(59, 130, 246, 0.15), transparent 50%);
    opacity: 0.6;
    z-index: 1;
  }

  .theme-toggle__scenery {
    width: 100%;
    height: 100%;
    pointer-events: none;
    overflow: hidden;
    position: relative;
    border-radius: inherit;
  }

  .theme-toggle__star {
    position: absolute;
    background: #fff;
    border-radius: var(--radius);
    filter: drop-shadow(0 0 0.063em #fff);
    opacity: 0;
    animation: twinkle 4s infinite;
  }

  .theme-toggle__star:nth-child(1) {
    width: 0.125em;
    height: 0.125em;
    left: 15%;
    top: 30%;
    animation-delay: 0s;
  }

  .theme-toggle__star:nth-child(2) {
    width: 0.0875em;
    height: 0.0875em;
    left: 45%;
    top: 20%;
    animation-delay: 0.3s;
  }

  .theme-toggle__star:nth-child(3) {
    width: 0.1em;
    height: 0.1em;
    left: 75%;
    top: 35%;
    animation-delay: 0.6s;
  }

  @keyframes twinkle {
    0%, 100% { opacity: 0.2; }
    50% { opacity: 1; }
  }

  .theme-toggle__nebula {
    position: absolute;
    border-radius: 50%;
    filter: blur(1em);
    opacity: 0.15;
    background: radial-gradient(circle, var(--nebula-color) 0%, transparent 70%);
  }

  .theme-toggle__nebula:nth-child(4) {
    --nebula-color: #9333EA;
    width: 6em;
    height: 6em;
    left: -2em;
    top: -2em;
  }

  .theme-toggle__nebula:nth-child(5) {
    --nebula-color: #3B82F6;
    width: 5em;
    height: 5em;
    right: -1em;
    bottom: -1em;
  }

  .theme-toggle__nebula:nth-child(6) {
    --nebula-color: #EC4899;
    width: 4em;
    height: 4em;
    right: 30%;
    top: -1em;
    opacity: 0.1;
  }

  .logo-container {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: calc(var(--toggle-offset));
    left: var(--toggle-offset);
    width: 3em;
    height: 3em;
    transition: var(--transition);
    z-index: 2;
    transform-style: preserve-3d;
  }

  .logo {
    width: 100%;
    height: 100%;
    object-fit: contain;
    transition: var(--transition);
    position: absolute;
    backface-visibility: hidden;
  }

  .logo--light {
    transform: rotateY(0deg);
  }

  .logo--dark {
    transform: rotateY(180deg);
    filter: brightness(0.8) contrast(1.2);
  }

  .logo-shadow {
    content: "";
    width: 3em;
    height: 20%;
    border-radius: 50%;
    background: #1a0f3c;
    box-shadow: 0.313em 0 3.125em #1a0f3c;
    opacity: 0.3;
    position: absolute;
    bottom: 0.5em;
    left: calc(var(--toggle-offset) - 0.938em);
    transition: var(--transition);
    transform: skew(-70deg);
    z-index: 1;
  }

  /* Checked state animations */
  .theme-toggle__checkbox:checked + .theme-toggle__container .theme-toggle__star {
    animation-duration: 2s;
  }

  .theme-toggle__checkbox:checked + .theme-toggle__container .theme-toggle__nebula {
    opacity: 0.25;
  }

  .theme-toggle__checkbox:checked + .theme-toggle__container .logo-container {
    left: calc(100% - 3em - var(--toggle-offset));
  }

  .theme-toggle__checkbox:checked + .theme-toggle__container .logo--light {
    transform: rotateY(180deg);
  }

  .theme-toggle__checkbox:checked + .theme-toggle__container .logo--dark {
    transform: rotateY(360deg);
  }

  .theme-toggle__checkbox:checked + .theme-toggle__container .logo-shadow {
    left: calc(100% - 3em - var(--toggle-offset) + 0.938em);
    transform: skew(70deg);
    opacity: 0.4;
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
            <div className="theme-toggle__nebula" />
            <div className="theme-toggle__nebula" />
            <div className="theme-toggle__nebula" />
          </div>
          <div className="logo-container">
            <img src="/tokenuer-logo.png" alt="Light mode" className="logo logo--light" />
            <img src="/tokenuer-logo.png" alt="Dark mode" className="logo logo--dark" />
          </div>
          <div className="artificial__hidden">
            <div className="logo-shadow" />
          </div>
        </div>
      </label>
    </StyledToggle>
  );
}
