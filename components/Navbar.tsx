"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useRouter, usePathname } from "next/navigation";
import SvgLogo from "@/components/SvgLogo";
import { User } from "@/lib/user";
import { logout } from "@/lib/actions/logout";
import {
  Newspaper,
  Compass,
  PenTool,
  LogIn,
  LogOut,
  Menu,
  Bell,
  Dot,
} from "lucide-react";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useNotifications } from "@/hooks/useNotifications";
import AnimatedLoader from "@/components/AnimatedLoader";

export function Navbar({ user }: { user: User | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const loggedIn = user !== null;
  const [open, setOpen] = useState(false);

  const sheetLinks = [
    { href: "/", text: "Feed", icon: Newspaper },
    { href: "/board", text: "Explore", icon: Compass },
    { href: "/create", text: "Post", icon: PenTool },
    { href: "/notifications", text: "Notifications", icon: Bell },
  ];
  const { notifications, loading, error } = useNotifications();

  const handleLogout = async () => {
    await logout();
    try {
      localStorage.setItem("theme", "theme-solar");
      document.documentElement.className = "theme-solar";
    } catch (error) {
      console.error("Failed to set theme:", error);
    }
    router.push("/");
    setOpen(false);
  };

  return (
    <nav className="p-4 flex justify-between items-center">
      {/* logo */}
      <Link className="flex items-center space-x-2" href="/">
        <SvgLogo />
        <span className="text-2xl font-bold hover:text-primary/90">
          EveryNyan
        </span>
      </Link>

      {/* Buttons and sheet opener */}
      <div className="flex items-center space-x-4">
        {loggedIn && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Bell />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="w-80 min-h-28 max-h-96 overflow-y-auto"
            >
              <div className="grid gap-4 h-full w-full">
                {loading && (
                  <div className="relative w-full flex h-10 items-center justify-center">
                    <div
                      className="relative rounded-full border-4 border-transparent border-t-primary border-r-primary 
                    size-5 animate-spin"
                    ></div>
                  </div>
                )}
                {error && <p>Error fetching notifications</p>}
                {notifications.map((notif,idx) => (
                  <Link
                    href={notif.link}
                    key={idx}
                    className="p-2 h-max border-b border-muted relative"
                  >
                    <h4 className="font-medium">{notif.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {notif.description}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {notif.timestamp}
                    </span>
                    <Dot
                      className={`absolute top-0 right-0 ${
                        notif.status === "read"
                          ? "hidden"
                          : "block fill-primary"
                      } `}
                    />
                  </Link>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-primaryi hover:bg-primary/40"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            className="w-full bg-background/90 backdrop-blur-lg"
            side="left"
          >
            <div className="flex flex-col items-start justify-center space-y-4 p-4 max-w-md mx-auto">
              {sheetLinks.map((link) => (
                <Link
                  key={link.text}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center justify-start space-x-4 text-xl font-bold w-full p-4 rounded-md transition-colors duration-200 ${
                    pathname === link.href
                      ? "text-primary"
                      : "text-foreground hover:text-primary/90"
                  }`}
                >
                  <link.icon className="h-6 w-6" />
                  <span>{link.text}</span>
                </Link>
              ))}
              {loggedIn ? (
                <Button
                  onClick={handleLogout}
                  className="flex items-center justify-start space-x-4 text-xl font-bold w-full px-4 py-6 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200"
                >
                  <LogOut className="h-6 w-6" />
                  <span>Log Out</span>
                </Button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-start space-x-4 text-xl font-bold w-full px-4 py-6 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200"
                >
                  <LogIn className="h-6 w-6" />
                  <span>Log In</span>
                </Link>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
