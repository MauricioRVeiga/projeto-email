export default function PreviewFrame({ html }) {
  return (
    <div className="preview-shell">
      <div className="preview-shell__toolbar">
        <span className="preview-shell__dot" />
        <span className="preview-shell__dot" />
        <span className="preview-shell__dot" />
        <p>Visualizacao em tempo real</p>
      </div>

      <iframe
        className="preview-shell__frame"
        srcDoc={html}
        title="Preview do email Gold Credit Capital"
      />
    </div>
  );
}
