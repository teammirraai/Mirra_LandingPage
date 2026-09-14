export default function Footer() {
  return (
    <footer className="mt-auto bg-ink px-6 pt-16 pb-8 text-surface sm:px-10">
      <div className="mx-auto max-w-7xl">
        <h3 className="font-display text-2xl">Shop women&rsquo;s fashion, all in one place.</h3>
        <p className="mt-2 max-w-sm text-sm text-surface/60">
          Ethnic wear, western wear, footwear, swimwear, loungewear and
          winterwear — search once, find it everywhere.
        </p>
      </div>

      <div className="mx-auto mt-16 max-w-7xl">
        <p className="font-display text-xl">Meet Mirra.</p>
        <p className="mt-1 text-sm text-surface/60">
          Your one search for women&rsquo;s fashion across every brand we carry.
        </p>
      </div>

      <div className="mx-auto mt-10 flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-2 border-t border-surface/15 pt-6 text-xs text-surface/50">
        <a href="mailto:support.mirraai@gmail.com" className="hover:text-surface">
          support.mirraai@gmail.com
        </a>
        <a
          href="https://askmirra.ai/privacy-policy.html"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-surface"
        >
          Privacy
        </a>
        <a
          href="https://askmirra.ai/terms-and-conditions.html"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-surface"
        >
          Terms
        </a>
        <a
          href="https://askmirra.ai/delete-account.html"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-surface"
        >
          Delete Account
        </a>
        <span className="ml-auto">
          © {new Date().getFullYear()} Threadmind Labs Pvt. Ltd.
        </span>
      </div>
    </footer>
  );
}
