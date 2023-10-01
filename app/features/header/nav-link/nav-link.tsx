"use client";
import { LinkButton } from "@components/button/button";
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
  }, [exact, href, pathname]);
  return (
    <LinkButton theme={"underline"} active={isActive} href={href}>
      {label}
    </LinkButton>
  );
};
