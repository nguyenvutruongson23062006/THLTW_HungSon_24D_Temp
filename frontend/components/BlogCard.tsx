import Link from "next/link";

type BlogCardProps = {
  id: number;
  title: string;
  description: string;
};

export default function BlogCard({
  id,
  title,
  description,
}: BlogCardProps) {
  return (
    <article>
      <h3>{title}</h3>
      <p>{description}</p>

      <Link href={`/blog/${id}`}>
        Đọc bài viết
      </Link>
    </article>
  );
}