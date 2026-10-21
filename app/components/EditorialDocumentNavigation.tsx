import Link from "next/link";

export default function EditorialDocumentNavigation() {
  return (
    <>
      <nav className="editorial-document-links" aria-label="Outras informações editoriais">
        <Link href="/politica-editorial">Política editorial</Link>
        <Link href="/avaliacao-por-pares">Avaliação por pares</Link>
        <Link href="/etica-publicacao">Ética e integridade</Link>
        <Link href="/privacidade">Privacidade</Link>
      </nav>
      <Link href="/submeter" className="editorial-cta">Consultar requisitos e submeter artigo ↗</Link>
    </>
  );
}
