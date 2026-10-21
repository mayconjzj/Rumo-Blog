"use client";

import { deleteBlogAction } from "./actions";

export default function DeleteArticleButton({ id, title }: { id: number; title: string }) {
  return (
    <form action={deleteBlogAction} onSubmit={(event) => {
      if (!window.confirm(`Apagar permanentemente o artigo “${title}”? Essa ação não pode ser desfeita.`)) event.preventDefault();
    }}>
      <input type="hidden" name="id" value={id} />
      <button type="submit" style={{ padding: 0, border: 0, color: "#b42318", background: "transparent", cursor: "pointer", font: "inherit", fontSize: 11, fontWeight: 700 }}>Apagar definitivamente</button>
    </form>
  );
}
