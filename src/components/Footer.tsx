import { Mail } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="container mt-10 flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
      <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
        <Mail className="w-4 h-4" />
        <p>
          Built by{" "}
          <Link
            href="https://skylerx.ir"
            target="_blank"
            className="underline underline-offset-3"
          >
            SkylerX
          </Link>
          . Hosted on{" "}
          <Link
            href="https://vercel.com"
            target="_blank"
            className="underline underline-offset-3"
          >
            Vercel
          </Link>
          . The source code is available on{" "}
          <Link
            href="https://github.com/SklyerX/waitlister"
            target="_blank"
            className="underline underline-offset-3"
          >
            Github
          </Link>
          .
        </p>
      </div>
    </footer>
  );
}
