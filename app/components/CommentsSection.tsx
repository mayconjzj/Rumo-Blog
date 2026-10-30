"use client";

import { FormEvent, useEffect, useState } from "react";

type Comment = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
};

type CommentsSectionProps = {
  articleSlug: string;
};

export default function CommentsSection({ articleSlug }: CommentsSectionProps) {
  const storageKey = `rumo-comments:${articleSlug}`;
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    // Defer browser storage hydration until after the effect has committed.
    const timer = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(storageKey);
        if (saved) setComments(JSON.parse(saved) as Comment[]);
      } catch {
        setNotice("Não foi possível carregar os comentários salvos neste navegador.");
      } finally {
        setReady(true);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, [storageKey]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanName = name.trim();
    const cleanMessage = message.trim();

    if (!cleanName || !cleanMessage) {
      setNotice("Preencha seu nome e escreva um comentário.");
      return;
    }

    const nextComments = [
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name: cleanName.slice(0, 60),
        message: cleanMessage.slice(0, 1200),
        createdAt: new Date().toLocaleDateString("pt-BR"),
      },
      ...comments,
    ];

    setComments(nextComments);
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(nextComments));
      setNotice("Comentário publicado neste navegador.");
    } catch {
      setNotice("Comentário adicionado à tela, mas não foi possível salvá-lo no navegador.");
    }
    setName("");
    setMessage("");
  }

  return (
    <section className="comments-section" id="comentarios" aria-labelledby="comments-title">
      <div className="comments-heading">
        <div>
          <span className="article-kicker">CONVERSA ABERTA</span>
          <h2 id="comments-title">Comentários <span>({comments.length})</span></h2>
          <p>Compartilhe uma ideia ou deixe uma pergunta sobre o artigo.</p>
        </div>
      </div>

      <form className="comment-form" onSubmit={handleSubmit}>
        <label htmlFor={`comment-name-${articleSlug}`}>Seu nome</label>
        <input
          id={`comment-name-${articleSlug}`}
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={60}
          placeholder="Como podemos chamar você?"
          required
        />
        <label htmlFor={`comment-message-${articleSlug}`}>Seu comentário</label>
        <textarea
          id={`comment-message-${articleSlug}`}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          maxLength={1200}
          rows={4}
          placeholder="Escreva sua contribuição..."
          required
        />
        <div className="comment-form-footer">
          <span>Até 1.200 caracteres</span>
          <button type="submit">Publicar comentário <span aria-hidden="true">↗</span></button>
        </div>
        {notice && <p className="comment-notice" role="status">{notice}</p>}
      </form>

      <div className="comment-list" aria-live="polite">
        {!ready ? (
          <p className="comments-empty">Carregando comentários...</p>
        ) : comments.length === 0 ? (
          <div className="comments-empty">
            <span className="empty-comment-mark">“</span>
            <p>Seja a primeira pessoa a comentar.</p>
            <span>Boas conversas começam com uma boa pergunta.</span>
          </div>
        ) : (
          comments.map((comment) => (
            <article className="comment-item" key={comment.id}>
              <div className="comment-avatar" aria-hidden="true">
                {comment.name.charAt(0).toUpperCase()}
              </div>
              <div className="comment-content">
                <div className="comment-meta">
                  <strong>{comment.name}</strong>
                  <time>{comment.createdAt}</time>
                </div>
                <p>{comment.message}</p>
              </div>
            </article>
          ))
        )}
      </div>
      <p className="comments-disclaimer">
        Nesta versão, os comentários ficam armazenados apenas neste navegador. Para que todos os visitantes possam vê-los, será necessário conectar um banco de dados e implementar proteção contra spam.
      </p>
    </section>
  );
}
