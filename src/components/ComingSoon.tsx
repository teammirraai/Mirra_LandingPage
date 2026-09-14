import Header from "./Header";
import Footer from "./Footer";

export default function ComingSoon({
  title,
  body,
}: {
  title: string;
  body?: string;
}) {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <h1 className="font-display text-3xl text-ink-900">{title}</h1>
        <p className="mt-3 max-w-md text-sm text-ink-500">
          {body ?? "This page is coming soon."}
        </p>
      </main>
      <Footer />
    </>
  );
}
