function AppIcon({ name, size = 18, className = "" }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": "true",
    className,
  };

  const stroke = {
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  switch (name) {
    case "home":
      return (
        <svg {...common}>
          <path {...stroke} d="M3 11.5 12 4l9 7.5" />
          <path {...stroke} d="M5 10.5V20h14v-9.5" />
          <path {...stroke} d="M10 20v-6h4v6" />
        </svg>
      );
    case "book":
      return (
        <svg {...common}>
          <path {...stroke} d="M6 4.5h9.5A2.5 2.5 0 0 1 18 7v13a2 2 0 0 0-2-2H6a2 2 0 0 1-2-2v-9.5A2 2 0 0 1 6 4.5Z" />
          <path {...stroke} d="M8 8h6" />
          <path {...stroke} d="M8 11h4.5" />
        </svg>
      );
    case "file":
      return (
        <svg {...common}>
          <path {...stroke} d="M7 4.5h6.5L18 9v10.5A2.5 2.5 0 0 1 15.5 22h-8A2.5 2.5 0 0 1 5 19.5v-13A2 2 0 0 1 7 4.5Z" />
          <path {...stroke} d="M13.5 4.5V9H18" />
          <path {...stroke} d="M8 13h6" />
          <path {...stroke} d="M8 16h4" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...common}>
          <path {...stroke} d="M7 3.5v3M17 3.5v3" />
          <path {...stroke} d="M5 6.5h14" />
          <path {...stroke} d="M6 5.5h12A2 2 0 0 1 20 7.5v10A2.5 2.5 0 0 1 17.5 20h-11A2.5 2.5 0 0 1 4 17.5v-10A2 2 0 0 1 6 5.5Z" />
          <path {...stroke} d="M8 11h3M8 14h3M13 11h3" />
        </svg>
      );
    case "graduation":
      return (
        <svg {...common}>
          <path {...stroke} d="m4 9 8-4 8 4-8 4-8-4Z" />
          <path {...stroke} d="M7 10.5V14c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5v-3.5" />
          <path {...stroke} d="M20 9v5" />
        </svg>
      );
    case "users":
      return (
        <svg {...common}>
          <path {...stroke} d="M16.5 10.5a3 3 0 1 0-3-3" />
          <path {...stroke} d="M4.5 18.5c0-3 2.7-5.5 6-5.5s6 2.5 6 5.5" />
          <path {...stroke} d="M17.5 18.5c0-2.1 1.5-3.8 3.5-4.3" />
        </svg>
      );
    case "clipboard":
      return (
        <svg {...common}>
          <path {...stroke} d="M9 5h6a2 2 0 0 1 2 2v12H7V7a2 2 0 0 1 2-2Z" />
          <path {...stroke} d="M10 3.5h4A1.5 1.5 0 0 1 15.5 5v1H8.5V5A1.5 1.5 0 0 1 10 3.5Z" />
          <path {...stroke} d="M10 11h4M10 14h4" />
        </svg>
      );
    case "chart":
      return (
        <svg {...common}>
          <path {...stroke} d="M5 19.5h14" />
          <path {...stroke} d="M7 17v-5" />
          <path {...stroke} d="M12 17V8.5" />
          <path {...stroke} d="M17 17v-8" />
          <path {...stroke} d="M7 12.5 12 8.5l3 2 5-5" />
        </svg>
      );
    case "check":
      return (
        <svg {...common}>
          <path {...stroke} d="M20 12a8 8 0 1 1-2.3-5.7" />
          <path {...stroke} d="m9 12 2.2 2.2L16 9.4" />
        </svg>
      );
    case "clock":
      return (
        <svg {...common}>
          <path {...stroke} d="M12 7v5l3 2" />
          <path {...stroke} d="M20 12a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z" />
        </svg>
      );
    case "x-circle":
      return (
        <svg {...common}>
          <path {...stroke} d="M12 20a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z" />
          <path {...stroke} d="m9.5 9.5 5 5" />
          <path {...stroke} d="m14.5 9.5-5 5" />
        </svg>
      );
    case "school":
      return (
        <svg {...common}>
          <path {...stroke} d="M4 10 12 6l8 4-8 4-8-4Z" />
          <path {...stroke} d="M6.5 11.2V16c0 1.7 2.5 3 5.5 3s5.5-1.3 5.5-3v-4.8" />
        </svg>
      );
    case "settings":
      return (
        <svg {...common}>
          <path {...stroke} d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" />
          <path {...stroke} d="M19.4 12a7.3 7.3 0 0 0-.1-1l1.8-1.4-1.8-3.1-2.1.8a7.4 7.4 0 0 0-1.7-1l-.3-2.2H10l-.3 2.2a7.4 7.4 0 0 0-1.7 1l-2.1-.8L4.1 9.6l1.8 1.4a7.3 7.3 0 0 0 0 2L4.1 14.4l1.8 3.1 2.1-.8a7.4 7.4 0 0 0 1.7 1l.3 2.2h4.4l.3-2.2a7.4 7.4 0 0 0 1.7-1l2.1.8 1.8-3.1-1.8-1.4c.1-.3.1-.7.1-1Z" />
        </svg>
      );
    default:
      return null;
  }
}

export default AppIcon;