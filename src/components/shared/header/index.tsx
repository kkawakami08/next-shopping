import Image from "next/image";
import Link from "next/link";
import { APP_NAME, paths } from "@/lib/constants";
import Menu from "./menu";

const Header = () => {
  return (
    <header className="w-full border-b px-10 py-3">
      <div className="flex justify-between items-center">
        <div className="">
          <Link href={paths.home()} className="flex items-center">
            <Image
              src={"/images/logo.svg"}
              alt={`${APP_NAME} logo`}
              height={48}
              width={48}
              priority
            />
            <span className="hidden font-bold text-2xl ml-3 lg:block">
              {APP_NAME}
            </span>
          </Link>
        </div>
        <Menu />
      </div>
    </header>
  );
};

export default Header;
