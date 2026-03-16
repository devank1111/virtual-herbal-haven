import { Leaf } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Leaf className="w-4 h-4 text-primary-foreground" />
            </div>
            <Link to="/admin-login">
              <span className="font-display text-lg font-bold text-background">
                AYUSH Garden
              </span>
            </Link>
          </div>

          <nav className="flex items-center gap-6">
            {[
              { label: "Home", path: "/" },
              { label: "Explore", path: "/garden" },
              { label: "Virtual Tour", path: "/tour" },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-sm text-background/60 hover:text-background transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <p className="text-xs text-background/40">
            © 2026 AYUSH Virtual Herbal Garden. Educational purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
}
