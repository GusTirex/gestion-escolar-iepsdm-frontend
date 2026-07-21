import { Component } from "react";

/**
 * Atrapa errores de render para que la app no quede en blanco.
 * Muestra un aviso claro y permite recargar.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { fallo: false };
  }

  static getDerivedStateFromError() {
    return { fallo: true };
  }

  componentDidCatch(error, info) {
    // Queda en consola para poder diagnosticar el problema.
    console.error("Error en la interfaz:", error, info);
  }

  render() {
    if (this.state.fallo) {
      return (
        <div className="pantalla-error">
          <h2>Algo se rompió en esta pantalla</h2>
          <p>Puedes recargar la página para volver a intentarlo.</p>
          <button className="btn-primary" onClick={() => window.location.reload()}>
            Recargar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
