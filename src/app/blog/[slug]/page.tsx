import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAllPosts, getPostBySlug } from "@/lib/blog";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${slug}` },
  };
}

function formatDate(date: string) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <>
      <Header />
      <main className="flex-1 px-6 py-12 sm:px-10">
        <article className="mx-auto max-w-2xl">
          <p className="text-xs text-ink-500">
            {formatDate(post.date)} · {post.author}
          </p>
          <h1 className="mt-2 font-display text-3xl text-ink-900 sm:text-4xl">
            {post.title}
          </h1>

          {post.coverImage ? (
            <div className="mt-8 aspect-video w-full overflow-hidden rounded-xl bg-ink-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.coverImage}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          ) : null}

          <div className="mt-8">
            <ReactMarkdown
              components={{
                h1: (props) => (
                  <h2
                    className="mt-8 font-display text-2xl text-ink-900"
                    {...props}
                  />
                ),
                h2: (props) => (
                  <h2
                    className="mt-8 font-display text-2xl text-ink-900"
                    {...props}
                  />
                ),
                h3: (props) => (
                  <h3
                    className="mt-6 font-display text-xl text-ink-900"
                    {...props}
                  />
                ),
                p: (props) => (
                  <p className="mt-4 leading-relaxed text-ink-700" {...props} />
                ),
                a: (props) => (
                  <a
                    className="text-ink-900 underline underline-offset-2 hover:text-ink-700"
                    {...props}
                  />
                ),
                ul: (props) => (
                  <ul
                    className="mt-4 list-disc space-y-1 pl-5 text-ink-700"
                    {...props}
                  />
                ),
                ol: (props) => (
                  <ol
                    className="mt-4 list-decimal space-y-1 pl-5 text-ink-700"
                    {...props}
                  />
                ),
                blockquote: (props) => (
                  <blockquote
                    className="mt-4 border-l-2 border-ink-300 pl-4 text-ink-500 italic"
                    {...props}
                  />
                ),
                strong: (props) => (
                  <strong className="font-semibold text-ink-900" {...props} />
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
