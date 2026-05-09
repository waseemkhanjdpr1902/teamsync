import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Home,
  FileText,
  Link2,
  QrCode,
  User,
  Settings,
  CreditCard,
  Key,
  BarChart3,
  LogOut,
  Menu,
  X,
  Search,
  Bell,
  Moon,
  Sun,
  ChevronRight,
} from 'lucide-react';
import pb from '@/lib/pocketbaseClient';

const DashboardLayout = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const navigate = useNavigate();
  const location = useLocation();

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
  };

  const sidebarLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'CV Builder', path: '/dashboard/cv-builder', icon: FileText },
    { name: 'Resume Analyzer', path: '/dashboard/resume-analyzer', icon: FileText },
    { name: 'URL Shortener', path: '/dashboard/url-shortener', icon: Link2 },
    { name: 'QR Code Generator', path: '/dashboard/qr-code-generator', icon: QrCode },
    { name: 'Profile', path: '/dashboard/profile', icon: User },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
    { name: 'Subscription', path: '/dashboard/subscription', icon: CreditCard },
    { name: 'API Keys', path: '/dashboard/api-keys', icon: Key },
    { name: 'Usage History', path: '/dashboard/usage', icon: BarChart3 },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center gap-4 px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary"></div>
            <span className="text-xl font-bold hidden sm:inline">UselessAI</span>
          </Link>

          <div className="flex-1 flex items-center gap-4 max-w-md ml-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search tools..."
                className="pl-9 w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>

            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage 
                      src={currentUser?.avatar ? pb.files.getUrl(currentUser, currentUser.avatar) : undefined} 
                      alt={currentUser?.name || 'User'} 
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => navigate('/dashboard/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/dashboard/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="flex">
        <aside
          className={`fixed lg:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 border-r bg-background transition-transform duration-200 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <nav className="flex flex-col gap-1 p-4 overflow-y-auto h-full">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {link.name}
                  {isActive(link.path) && <ChevronRight className="h-4 w-4 ml-auto" />}
                </Link>
              );
            })}
          </nav>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
