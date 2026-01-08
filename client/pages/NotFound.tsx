import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-2xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <div>
          <h1 className="text-7xl sm:text-8xl font-bold text-primary mb-4">
            404
          </h1>
          <p className="text-3xl font-bold text-foreground mb-2">
            Page Not Found
          </p>
          <p className="text-lg text-muted-foreground">
            Sorry, the page you're looking for doesn't exist yet. Let's get you
            back on track.
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all hover:scale-105 text-lg"
        >
          Return to Home
          <ArrowRight size={20} />
        </Link>

        <div className="pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            If you believe this is a mistake, please reach out to us.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
