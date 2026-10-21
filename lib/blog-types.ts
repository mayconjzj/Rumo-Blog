export type BlogPost = {
  id: number;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  status: "draft" | "published";
  created_at: string | Date;
  updated_at: string | Date;
  published_at: string | Date | null;
};
