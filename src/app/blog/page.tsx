import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Styling tips, product drops and updates from the Mirra team.",
  alternates: { canonical: "/blog" },
};

function formatDate(date: string) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <>
      <Header />
      <main className="flex-1 px-6 py-12 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <h1 className="font-display text-3xl text-ink-900 sm:text-4xl">
            The Mirra Blog
          </h1>
          <p className="mt-2 max-w-xl text-ink-700">
            Styling tips, product drops and updates from the Mirra team.
          </p>

          {posts.length === 0 ? (
            <p className="mt-12 text-sm text-ink-500">
              No posts yet — check back soon.
            </p>
          ) : (
            <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group"
                >
                  {post.coverImage ? (
                    <div className="aspect-video w-full overflow-hidden rounded-xl bg-ink-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.coverImage}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  ) : null}
                  <p className="mt-4 text-xs text-ink-500">
                    {formatDate(post.date)}
                  </p>
                  <h2 className="mt-1 font-display text-xl text-ink-900 group-hover:underline">
                    {post.title}
                  </h2>
                  <p className="mt-2 text-sm text-ink-700">{post.excerpt}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
