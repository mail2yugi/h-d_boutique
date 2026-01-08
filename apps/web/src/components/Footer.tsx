import { MapPin, Phone } from 'lucide-react';
import { contactInfo } from '@hd-boutique/types';

export function Footer() {
  return (
    <footer className="bg-brand-text text-white mt-20">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="font-display text-2xl font-bold mb-4">H & D Boutique</h3>
            <p className="text-gray-300 mb-4">
              Exquisite custom-tailored blouses, designer sarees, lehengas, and bridal wear. 
              Traditional elegance meets contemporary style.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-xl font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <a
                href={`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-300 hover:text-brand-accent transition-colors"
              >
                <Phone className="w-5 h-5 mr-2" />
                {contactInfo.whatsapp}
              </a>
              <a
                href={contactInfo.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-300 hover:text-brand-accent transition-colors"
              >
                <MapPin className="w-5 h-5 mr-2" />
                Visit Our Boutique
              </a>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-display text-xl font-semibold mb-4">Business Hours</h4>
            <div className="text-gray-300 space-y-1">
              <p>Monday - Saturday: 10:00 AM - 8:00 PM</p>
              <p>Sunday: By Appointment</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} H & D Boutique. All rights reserved.</p>
          <p className="mt-2 text-sm">Built with ❤️ using 100% free services</p>
        </div>
      </div>
    </footer>
  );
}
