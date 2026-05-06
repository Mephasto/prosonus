"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function SearchInput({
  defaultValue = "",
}: {
  defaultValue?: string;
}) {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = (new FormData(e.currentTarget).get("q") as string).trim();
    if (q) {
      router.push(`/catalog/search?q=${encodeURIComponent(q)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full md:w-64">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        name="q"
        placeholder="Search products..."
        defaultValue={defaultValue}
        className="pl-8 w-full"
      />
    </form>
  );
}
