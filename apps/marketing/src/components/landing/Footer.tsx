import Link from "next/link";

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Download", href: "#download" },
  ],
  Company: [
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ],
  Account: [
    { label: "Sign In", href: "/login" },
    { label: "Sign Up", href: "/signup" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-white/10 px-4 py-12 md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-block">
              <img
                src="/images/logo.png"
                alt="SkyMeet"
                className="w-28"
              />
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-6 text-gray-500">
              Meet. Connect. Collaborate.
              <br />
              A modern meeting experience built with simplicity in mind.
            </p>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-white">
                {title}
              </h3>
              <ul className="mt-5 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 transition hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-gray-600 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} SkyMeet. All rights reserved.
          </p>
          <p>
            Powered by{" "}
            <span className="text-gray-400">
              GreyHoldyngs
            </span>
            {" "}· Built by{" "}
            <span className="text-gray-400">
              Emmanuel Grey
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}