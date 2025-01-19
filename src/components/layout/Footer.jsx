import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { 
  Activity,
  Twitter, 
  Instagram, 
  Send,
  MapPin,
  Mail,
  Phone
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">EnnyGo</h3>
            <p className="text-muted-foreground">
              Transform your athletic journey with creative activity naming and virtual events.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>123 Fitness Street, Active City</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>hello@ennygo.com</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Quick Links</h3>
            <nav className="space-y-2">
              <Link to="/about" className="block text-muted-foreground hover:text-primary transition-colors">
                About Us
              </Link>
              <Link to="/events" className="block text-muted-foreground hover:text-primary transition-colors">
                Events
              </Link>
              <Link to="/blog" className="block text-muted-foreground hover:text-primary transition-colors">
                Blog
              </Link>
              <Link to="/contact" className="block text-muted-foreground hover:text-primary transition-colors">
                Contact
              </Link>
            </nav>
          </div>

          {/* Connect Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Connect</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" asChild>
                <a href="https://strava.com" target="_blank" rel="noopener noreferrer" aria-label="Strava">
                  <Activity className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" size="icon" asChild>
                <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                  <Twitter className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" size="icon" asChild>
                <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <Instagram className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Newsletter</h3>
            <p className="text-muted-foreground">
              Subscribe to get updates about new features and events.
            </p>
            <div className="flex gap-2">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="max-w-[200px]"
              />
              <Button size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Footer Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>&copy; {currentYear} EnnyGo. All rights reserved.</p>
          <nav className="flex gap-4">
            <Link to="/privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link to="/cookies" className="hover:text-primary transition-colors">
              Cookie Policy
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 