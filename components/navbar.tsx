"use client";

import { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
  useSpring,
  useTransform,
} from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Search,
  X,
  Menu,
  LogOut,
  ChevronRight,
  LogIn,
  UserPlus,
  ShoppingBag,
  Home,
  Info,
} from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/app/contexts/UserContext";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type SearchResults = {
  id: number;
  title: string;
  description: string;
};

const categories = [
  {
    name: "Clothing",
    items: ["Basics", "Dresses", "Tops", "Skirts", "Abayas", "Tunic"],
  },
  { name: "Accessories", items: ["Scarves", "Jewelry", "Bags"] },
  { name: "Outerwear", items: ["Jackets", "Coats", "Blazers"] },
  { name: "Knitwear", items: ["Sweaters", "Cardigans", "Hoodies"] },
];

export default function ModernNavbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResults[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { user, setUser } = useUser();
  const router = useRouter();
  const { theme } = useTheme();
  const { scrollY } = useScroll();
  const scrollProgress = useSpring(0, { stiffness: 300, damping: 30 });

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();

    if (latest > previous! && latest > 150) {
      setIsNavbarVisible(false);
    } else {
      setIsNavbarVisible(true);
    }
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress = latest / maxScroll;

    scrollProgress.set(progress);
  });

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const body = document.body;

    body.style.overflow = isSidebarOpen ? "hidden" : "";

    return () => {
      body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    router.push("/");
  };

  const handleSearch = async (_query: string) => {
    setIsSearching(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const mockResults = [
      { id: 1, title: "Elegant Abaya", description: "Black, embroidered" },
      { id: 2, title: "Silk Scarf", description: "Floral pattern, multicolor" },
      { id: 3, title: "Tunic Dress", description: "Navy blue, long sleeves" },
    ];

    setSearchResults(mockResults);
    setIsSearching(false);
  };

  const Sidebar = () => (
    <motion.div
      animate={{ x: 0 }}
      className="fixed inset-y-0 left-0 z-50 w-80 bg-white dark:bg-gray-900 shadow-lg overflow-y-auto"
      exit={{ x: "-100%" }}
      initial={{ x: "-100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="p-6 flex justify-between items-center border-b">
        <Link href="/" onClick={() => setIsSidebarOpen(false)}>
          <motion.img
            alt="Logo"
            className="h-8 w-auto"
            src={theme === "light" ? "/logoblack.png" : "/logowhite.png"}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            whileHover={{ scale: 1.05 }}
          />
        </Link>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setIsSidebarOpen(false)}
        >
          <X className="h-6 w-6" />
        </Button>
      </div>
      <div className="p-6 space-y-6">
        {categories.map((category, index) => (
          <motion.div
            key={category.name}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">
              {category.name}
            </h3>
            <div className="space-y-2">
              {category.items.map((item, itemIndex) => (
                <motion.div
                  key={item}
                  animate={{ opacity: 1, x: 0 }}
                  initial={{ opacity: 0, x: -20 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.1 + itemIndex * 0.05,
                  }}
                >
                  <Button
                    className="w-full justify-start text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                    variant="ghost"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    {item}
                    <ChevronRight className="ml-auto h-4 w-4" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="border-t pt-6 mt-6 space-y-2"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <Button
            className="w-full justify-start text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
            variant="ghost"
            onClick={() => {
              setIsSidebarOpen(false);
              router.push("/");
            }}
          >
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>
          <Button
            className="w-full justify-start text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
            variant="ghost"
            onClick={() => {
              setIsSidebarOpen(false);
              router.push("/cart");
            }}
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            Cart
          </Button>
          <Button
            className="w-full justify-start text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
            variant="ghost"
            onClick={() => {
              setIsSidebarOpen(false);
              router.push("/about");
            }}
          >
            <Info className="mr-2 h-4 w-4" />
            About
          </Button>
          {user ? (
            <Button
              className="w-full justify-start text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
              variant="ghost"
              onClick={() => {
                setIsSidebarOpen(false);
                handleLogout();
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </Button>
          ) : (
            <>
              <Button
                className="w-full justify-start text-gray-600 bg-white"
                variant="ghost"
                onClick={() => {
                  setIsSidebarOpen(false);
                  router.push("/Auth/sign-in");
                }}
              >
                <LogIn className="mr-2 h-4 w-4" />
                Sign in
              </Button>
              <Button
                className="w-full justify-start text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                variant="ghost"
                onClick={() => {
                  setIsSidebarOpen(false);
                  router.push("/Auth/sign-up");
                }}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Sign up
              </Button>
            </>
          )}
        </motion.div>
      </div>
    </motion.div>
  );

  const scrollBarWidth = useTransform(scrollProgress, [0, 1], ["0%", "100%"]);

  return (
    <>
      <motion.nav
        animate={{ y: isNavbarVisible ? 0 : "-100%" }}
        className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md shadow-sm"
        initial={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <motion.div
          className="h-1 bg-primary origin-left"
          style={{ scaleX: scrollBarWidth }}
        />
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              className="hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors duration-200"
              size="icon"
              variant="ghost"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <motion.div
              className="flex items-center space-x-2 cursor-pointer"
              transition={{ type: "spring", stiffness: 50, damping: 10 }}
              whileHover={{ scale: 1.03 }}
              onClick={() => router.push("/")}
            >
              <motion.img
                alt="Logo"
                className="h-8 w-auto"
                src="/logoonly.png"
              />
              <motion.span className="font-bold text-lg hidden sm:inline bg-clip-text text-black bg-gradient-to-r from-primary to-secondary">
                AALAA Designs
              </motion.span>
            </motion.div>
          </div>

          <div className="hidden md:flex items-center gap-8 space-x-4">
            <NavLink href="/">
              <Home className="mr-2 h-6 w-6" />
              <span>Home</span>
            </NavLink>
            <NavLink href="/cart">
              <ShoppingBag className="mr-2 h-6 w-6" />

              <span>Cart</span>
            </NavLink>
            <NavLink href="/about">
              <Info className="mr-2 h-6 w-6" />
              <span>About </span>{" "}
            </NavLink>
          </div>

          <div className="flex items-center space-x-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="icon-button transition-colors duration-200"
                    size="icon"
                    variant="ghost"
                    onClick={() => setIsSearchOpen(true)}
                  >
                    <Search className="h-5 w-5 hover:fill-gray-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Search</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <DropdownMenu>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button
                        className="icon-button transition-colors duration-200"
                        size="icon"
                        variant="ghost"
                      >
                        <Avatar>
                          <AvatarImage src={"https://github.com/shadcn.png"} />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>User menu</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <DropdownMenuContent
                align="end"
                className="w-56 bg-white rounded-xl"
              >
                {user ? (
                  <>
                    <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
                      Settings
                    </DropdownMenuItem>
                    {user.role === "admin" && (
                      <DropdownMenuItem
                        className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                        onSelect={() =>
                          (window.location.href =
                            "https://aalaadesigns-dashboard.vercel.app/")
                        }
                      >
                        Dashboard
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                      onSelect={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem
                      className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                      onSelect={() => router.push("/Auth/sign-in")}
                    >
                      <LogIn className="mr-2 h-4 w-4" />
                      <span>Sign in</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                      onSelect={() => router.push("/Auth/sign-up")}
                    >
                      <UserPlus className="mr-2 h-4 w-4" />
                      <span>Sign up</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <TooltipProvider>
              <Tooltip>
                {/*<TooltipTrigger asChild>
                  <Button
                    className="icon-button transition-colors duration-200"
                    size="icon"
                    variant="ghost"
                    onClick={() =>
                      setTheme(theme === "dark" ? "light" : "dark")
                    }
                  >
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </TooltipTrigger>*/}
                <TooltipContent>
                  <p>Toggle theme</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>{isSidebarOpen && <Sidebar />}</AnimatePresence>

      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-start justify-center pt-20"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              animate={{ scale: 1, opacity: 1 }}
              className="bg-card shadow-xl overflow-hidden max-w-3xl w-full bg-white rounded"
              exit={{ scale: 0.9, opacity: 0 }}
              initial={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative bg-white">
                <Input
                  ref={searchInputRef}
                  className="w-full py-6 px-4 text-lg bg-white rounded"
                  placeholder="Search..."
                  onChange={(e) => handleSearch(e.target.value)}
                />
                <Button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 transition-colors duration-200"
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsSearchOpen(false)}
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
              {(searchResults.length > 0 || isSearching) && (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="p-2 rounded bg-white"
                  exit={{ opacity: 0, y: 10 }}
                  initial={{ opacity: 0, y: 10 }}
                  transition={{ delay: 0.1 }}
                >
                  {isSearching ? (
                    <div className="text-center bg-white">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        Searching...
                      </p>
                    </div>
                  ) : (
                    <ul className="space-y-2">
                      {searchResults.map((result) => (
                        <motion.li
                          key={result.id}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-2 hover:bg-accent rounded-md cursor-pointer transition-colors duration-200 hover:bg-gray-400"
                          initial={{ opacity: 0, y: 5 }}
                          transition={{ delay: 0.1 }}
                        >
                          <h3 className="font-medium">{result.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {result.description}
                          </p>
                        </motion.li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link className="relative group " href={href}>
      <span
        className={`text-xl flex items-center font-medium ${isActive ? "text-primary" : "hover:text-primary hover:opacity-80"} transition-colors duration-200`}
      >
        {children}
      </span>
      <span
        className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 ${isActive ? "w-full" : "group-hover:w-full"}`}
      />
    </Link>
  );
}

const SearchResults = React.memo(
  ({ results }: { results: SearchResults[] }) => {
    SearchResults.displayName = "SearchResults";

    return (
      <div className="search-results">
        {results.map((result) => (
          <div
            key={result.id}
            className="p-2 hover:bg-accent rounded-md cursor-pointer"
          >
            <h4 className="font-medium">{result.title}</h4>
            <p className="text-sm text-muted-foreground">
              {result.description}
            </p>
          </div>
        ))}
      </div>
    );
  }
);
