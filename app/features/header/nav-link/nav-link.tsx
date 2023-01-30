import Link from "next/link";
import { LinkButton } from "../../../commons/components/button/button";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  href: string;
  label: string;
  exact?: boolean;
}

export const NavLink = ({ href, label, exact }: NavLinkProps) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const pathname = usePathname();
  useEffect(() => {
    if (!pathname) {
      return;
    }
    setIsActive(exact ? pathname === href : pathname.startsWith(href));
  }, [href, pathname]);
  return (
    <Link href={href} passHref legacyBehavior>
      <LinkButton theme={"underline"} active={isActive}>
        {label}
      </LinkButton>
    </Link>
  );
};
