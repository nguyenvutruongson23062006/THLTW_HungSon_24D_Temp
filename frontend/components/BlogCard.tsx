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
    <article className="flex h-full min-w-0 flex-col border-t border-slate-700 pt-6">
      <h3 className="text-lg font-semibold leading-7 text-white">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-400">{description}</p>

      <Link
        href={`/blog/${id}`}
        aria-label={`Đọc bài viết: ${title}`}
        className="mt-auto inline-flex min-h-11 items-center gap-2 self-start rounded-sm pt-5 text-sm font-semibold text-blue-400 transition-colors hover:text-blue-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400"
      >
        Đọc bài viết
        <svg
          aria-hidden="true"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14m-6-6 6 6-6 6" />
        </svg>
      </Link>
    </article>
  );
}
