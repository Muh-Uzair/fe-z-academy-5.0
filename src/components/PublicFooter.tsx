"use client";

import Link from "next/link";
import { Globe, Mail, MessageCircle, Video } from "lucide-react";
import Logo from "@/components/Logo";

const currentYear = 2026;

const PublicFooter = () => {
  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand & Socials */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Logo light />
            <p className="text-primary-foreground/80 max-w-sm">
              Z-Academy is the leading online learning platform. We connect passionate instructors with eager students to democratize education worldwide.
            </p>
            <div className="flex items-center gap-4">
              <Link href="#" className="p-2 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-full transition-colors">
                <Globe className="h-5 w-5" />
              </Link>
              <Link href="#" className="p-2 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-full transition-colors">
                <MessageCircle className="h-5 w-5" />
              </Link>
              <Link href="#" className="p-2 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-full transition-colors">
                <Video className="h-5 w-5" />
              </Link>
              <Link href="#" className="p-2 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-full transition-colors">
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Links - Company */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-lg mb-2">Company</h3>
            <Link href="/about-us" className="text-primary-foreground/80 hover:text-primary-foreground hover:underline transition-colors">About Us</Link>
            <Link href="#" className="text-primary-foreground/80 hover:text-primary-foreground hover:underline transition-colors">Careers</Link>
            <Link href="#" className="text-primary-foreground/80 hover:text-primary-foreground hover:underline transition-colors">Blog</Link>
            <Link href="#" className="text-primary-foreground/80 hover:text-primary-foreground hover:underline transition-colors">Contact</Link>
          </div>

          {/* Links - Resources */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-lg mb-2">Resources</h3>
            <Link href="/courses" className="text-primary-foreground/80 hover:text-primary-foreground hover:underline transition-colors">All Courses</Link>
            <Link href="#" className="text-primary-foreground/80 hover:text-primary-foreground hover:underline transition-colors">Instructors</Link>
            <Link href="#" className="text-primary-foreground/80 hover:text-primary-foreground hover:underline transition-colors">Pricing</Link>
            <Link href="#" className="text-primary-foreground/80 hover:text-primary-foreground hover:underline transition-colors">FAQ</Link>
          </div>

          {/* Links - Legal */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-lg mb-2">Legal</h3>
            <Link href="#" className="text-primary-foreground/80 hover:text-primary-foreground hover:underline transition-colors">Terms of Service</Link>
            <Link href="#" className="text-primary-foreground/80 hover:text-primary-foreground hover:underline transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-primary-foreground/80 hover:text-primary-foreground hover:underline transition-colors">Cookie Policy</Link>
            <Link href="#" className="text-primary-foreground/80 hover:text-primary-foreground hover:underline transition-colors">Accessibility</Link>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-primary-foreground/70 text-sm">
            © {currentYear} Z-Academy. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-primary-foreground/70">
            <Link href="#" className="hover:text-primary-foreground transition-colors">English (US)</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
