import React from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  links: Array<{ id: string; label: string }>;
}

export function MobileMenu({ isOpen, onClose, links }: MobileMenuProps) {
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const headerOffset = 80;
      const elementPosition = section.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Menu panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-xs bg-white dark:bg-gray-900 shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="px-4 py-6">
          <ul className="space-y-4">
            {links.map((link) => (
              <li key={link.id}>
                <button
                  onClick={() => {
                    scrollToSection(link.id);
                  }}
                  className="block py-2 text-base font-medium text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer w-full text-left"
                  data-optimizely="nav-link"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}