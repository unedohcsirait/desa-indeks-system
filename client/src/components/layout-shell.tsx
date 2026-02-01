import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, Database, ClipboardList, Menu, UserCircle, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface LayoutShellProps {
  children: ReactNode;
  title?: string;
}

export function LayoutShell({ children, title }: LayoutShellProps) {
  const [location] = useLocation();
  const [theme, setTheme] = useState<"light" | "dark">(
    () => (localStorage.getItem("theme") as "light" | "dark") || "light"
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/villages", label: "Data Desa", icon: Database },
    { href: "/assessments", label: "Penilaian Indeks", icon: ClipboardList },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white dark:bg-slate-950 border-r border-border">
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <ClipboardList className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg leading-tight dark:text-white">Indeks Desa</h1>
            <p className="text-xs text-muted-foreground font-medium">System Admin</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group cursor-pointer",
                  isActive 
                    ? "bg-primary/10 text-primary font-semibold shadow-sm" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-slate-400 group-hover:text-slate-600")} />
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border/50">
        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
              <UserCircle className="w-6 h-6 text-slate-400" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate dark:text-white">Administrator</p>
              <p className="text-xs text-muted-foreground truncate">Sistem Indeks Desa</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 shrink-0 fixed inset-y-0 left-0 z-50">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <ClipboardList className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-sm dark:text-white">Indeks Desa</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72">
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:pl-72 pt-16 lg:pt-0">
        <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <header className="flex items-center justify-between">
            {title && (
              <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
                {title}
              </h2>
            )}
            <div className="hidden lg:block">
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </Button>
            </div>
          </header>
          {children}
        </div>
      </main>
    </div>
  );
}
