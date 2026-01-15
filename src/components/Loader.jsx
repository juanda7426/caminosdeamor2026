const Loader = ({ message = "Procesando..." }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.85)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10000,
        backdropFilter: "blur(4px)",
      }}
    >
      <div className="text-center bg-white p-4 rounded shadow-lg border">
        <div
          className="spinner-border text-primary mb-3"
          role="status"
          style={{ width: "3.5rem", height: "3.5rem", borderWidth: "4px" }}
        >
          <span className="visually-hidden">Cargando...</span>
        </div>
        <h5 className="mb-0 text-dark fw-bold" style={{ letterSpacing: "1px" }}>
          {message}
        </h5>
        <small className="text-muted">Por favor espere</small>
      </div>
    </div>
  );
};

export default Loader;
