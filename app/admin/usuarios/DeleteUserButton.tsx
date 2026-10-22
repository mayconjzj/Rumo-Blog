"use client";

export default function DeleteUserButton({
  userName,
  userEmail,
}: {
  userName: string;
  userEmail: string;
}) {
  return (
    <button
      type="submit"
      onClick={(event) => {
        const confirmed = window.confirm(
          `Excluir permanentemente a conta de ${userName} (${userEmail})? O usuário perderá o acesso e as sessões de login serão encerradas. Os registros de pesquisas já submetidas serão preservados. Esta ação não pode ser desfeita.`,
        );
        if (!confirmed) event.preventDefault();
      }}
      style={{
        border: "1px solid #e5b7b2",
        color: "#8c1d18",
        background: "#fff",
        padding: "10px 12px",
        fontWeight: 700,
        cursor: "pointer",
        borderRadius: 6,
      }}
    >
      Excluir conta
    </button>
  );
}
