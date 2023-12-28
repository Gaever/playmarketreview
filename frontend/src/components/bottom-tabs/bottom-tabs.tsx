"use client";
import { useChatList } from "@/lib/services/chat/use-chat-list";
import Link from "next/link";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import React from "react";
import { Badge, Nav, NavItem, NavLink } from "react-bootstrap";
import { BagFill, BagPlusFill, ChatFill, HeartFill, PersonFill } from "react-bootstrap-icons";
import styles from "./style.module.scss";

export interface TabItem {
  title: string;
  icon: React.ReactElement;
  href: string;
}

const tabItems: TabItem[] = [
  { href: "/", title: "Rechercher", icon: <BagFill size={20} /> },
  { href: "/favorites", title: "Favoris", icon: <HeartFill size={20} /> },
  { href: "/my-ads", title: "Annonces", icon: <BagPlusFill size={20} /> },
  { href: "/chats", title: "Chat", icon: <ChatFill size={20} /> },
  {
    href: "/profile",
    title: "Profil",
    icon: <PersonFill size={20} />,
  },
];

export interface BottomTabsProps {}

const BottomTabs: React.FC<BottomTabsProps> = () => {
  const pathname = usePathname();
  const sp = useSearchParams();
  const { targetUserId } = useParams();
  const authCallbackUrl = sp.get("callbackUrl");

  const { unreadChats } = useChatList({ activeChatTargetUserId: targetUserId as string });

  return (
    <Nav className="fixed-bottom justify-content-around bg-light">
      {tabItems.map((item, index) => {
        const isHomeRoute = item.href === "/" && pathname === "/" && !authCallbackUrl;
        const isActiveRoute =
          (item.href !== "/" && pathname.startsWith(item.href)) ||
          (authCallbackUrl && authCallbackUrl.startsWith(item.href));

        const isActive = isHomeRoute || isActiveRoute;

        return (
          <NavItem key={index}>
            <NavLink
              as={Link}
              href={item.href}
              active
              prefetch
              className={`position-relative d-flex flex-column align-items-center text-black-50 ${
                isActive ? styles.activeItem : ""
              }`}
            >
              {item.icon}
              <span className={styles.itemTitle}>{item.title}</span>
              {item.href === "/chats" && (unreadChats ?? 0) > 0 ? (
                <div className={`position-absolute ${styles["unread-messages"]}`}>
                  <Badge bg="danger" pill>
                    {unreadChats}
                  </Badge>
                </div>
              ) : null}
            </NavLink>
          </NavItem>
        );
      })}
    </Nav>
  );
};

export default BottomTabs;
