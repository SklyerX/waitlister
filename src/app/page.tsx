import Footer from "@/components/Footer";
import Navbar from "@/components/misc/Navbar";
import { Button, buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center mt-20">
        <h1 className="font-heading font-semibold text-3xl sm:text-5xl md:text-6xl">
          A better way to create waitlists for your apps
        </h1>
        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          Easily connect it to your applications and recieve data through
          webhooks!
        </p>
        <div className="space-x-2">
          <Link
            href="/dashboard"
            className={buttonVariants({ variant: "default" })}
          >
            Get Started
          </Link>
          <Link
            href="https://github.com/sklyerx/waitlister"
            className={buttonVariants({ variant: "secondary", size: "lg" })}
          >
            Github
          </Link>
        </div>
        <div className="border rounded-md p-2 mt-10">
          <Image
            src="/preview.png"
            alt="Emails Preview"
            className="mt-10 w-full h-full"
            width={1000}
            height={1000}
          />
        </div>
      </div>
      <Footer />
    </>
  );
}
