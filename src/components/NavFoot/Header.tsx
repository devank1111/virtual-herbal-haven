import { Link, useLocation, useNavigate } from "react-router-dom";
import { Leaf, Menu, X, LogOut, User, Map, ChevronDown, ScanLine } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";


export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, signOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
  await signOut();
  setDropdownOpen(false);
  setMobileOpen(false);
  navigate("/");
};

  const navItems = user
    ? [
        // { label: "Explore Garden", path: "/garden" },
        // { label: "Virtual Tour", path: "/tour" },
      ]
    : [
        // { label: "Home", path: "/" },
        // { label: "Explore Garden", path: "/garden" },
        // { label: "Virtual Tour", path: "/tour" },
      ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center group-hover:scale-110 transition-transform">
            <Leaf className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground tracking-tight">
            Nature
            <p className="text-xs text-muted-foreground">organic & natural</p>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {item.label}
            </Link>
          ))}

<Link
  to="/scan"
  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
    location.pathname === "/scan"
      ? "bg-primary text-primary-foreground"
      : "text-muted-foreground hover:text-foreground hover:bg-muted"
  }`}
>
  <ScanLine className="w-4 h-4" />
  Scan Plant
</Link>

          {user ? (
  <div className="relative">
    <button
      onClick={() => setDropdownOpen(!dropdownOpen)}
      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition"
    >
      <img
        src={`https://ui-avatars.com/api/?name=${user.displayName || "User"}`}
        className="w-8 h-8 rounded-full border"
        alt="username"
      />

      <span className="text-sm font-medium">
        {user.displayName || "User"}
      </span>

      <ChevronDown
        className={`w-4 h-4 transition-transform ${
          dropdownOpen ? "rotate-180" : ""
        }`}
      />
    </button>

    <AnimatePresence>
      {dropdownOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 mt-2 w-56 bg-background border border-border rounded-xl shadow-lg overflow-hidden"
        >
          <Link
            to="/profile"
            className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-muted transition"
          >
            <User className="w-4 h-4" />
            View Profile
          </Link>

          <Link
            to="/tour"
            className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-muted transition"
          >
            <Map className="w-4 h-4" />
            Virtual Tour
          </Link>

          <button
  onClick={handleLogout}
  className="w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-muted transition"
>
  <LogOut className="w-4 h-4" />
  Logout
</button>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
) : (
            <Link
              to="/login"
              className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center gap-1.5"
            >
              Login
            </Link>
          )}
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-background border-b border-border"
          >
            <nav className="flex flex-col p-4 gap-1">

<Link
  to="/scan"
  onClick={() => setMobileOpen(false)}
  className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
    location.pathname === "/scan"
      ? "bg-primary text-primary-foreground"
      : "text-muted-foreground hover:text-foreground hover:bg-muted"
  }`}
>
  <ScanLine className="w-5 h-5" />
  Scan Plant
</Link>

              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
