import Image from "next/image";
import Link from "next/link";

const Header = () => {
  return (
    <header className="border-b">
      <div className="container flex h-16 items-center px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Image
            src="/logo_white.png"
            alt={"ProSonus"}
            height={40}
            width={150}
            className=""
          />
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            href="/catalog/all"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Catalog
          </Link>
          <Link
            href="/quote"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Create Quote
          </Link>
          <Link
            href="/admin"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
