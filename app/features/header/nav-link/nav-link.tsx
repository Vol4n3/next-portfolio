import Link from "next/link";
import { LinkButton } from "../../../commons/components/button/button";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  href: string;
  label: string;
}

export const NavLink = ({ href, label }: NavLinkProps) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const pathname = usePathname();
  useEffect(() => {
    if (!pathname) {
      return;
    }
    setIsActive(
      href.length > 1 ? pathname.startsWith(href) : pathname === href
    );
  }, [href, pathname]);
  return (
    <Link href={href} passHref legacyBehavior>
      <LinkButton theme={"underline"} active={isActive}>
        {label}
      </LinkButton>
    </Link>
  );
};
