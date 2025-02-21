import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ButtonAsLink({
  linkToPage,
  text,
  size,
}: {
  linkToPage: string;
  text: string;
  size?: string;
}) {
  const fontSize = size ? size : "";
  return (
    <Button asChild>
      <Link href={linkToPage} className={fontSize}>
        {text}
      </Link>
    </Button>
  );
}
