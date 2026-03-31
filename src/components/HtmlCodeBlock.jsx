export default function HtmlCodeBlock({ html }) {
  return (
    <div className="code-panel">
      <div className="section-heading">
        <div>
          <span className="eyebrow">HTML robusto</span>
          <h2>Codigo pronto para copiar</h2>
        </div>
        <p>Tabelas estruturadas e CSS inline para Gmail e Outlook.</p>
      </div>

      <pre className="code-panel__content">{html}</pre>
    </div>
  );
}
