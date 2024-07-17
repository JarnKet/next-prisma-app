import Link from "next/link";
import { Button } from "./ui/button";

export default function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between py-4 border-b">
      <Link href={"/"}>
        <h1 className="font-bold text-3xl">Next.js</h1>
      </Link>
      <Link href={"/post/create"}>
        <Button>ສ້າງໂພສ</Button>
      </Link>
    </nav>
  );
}
