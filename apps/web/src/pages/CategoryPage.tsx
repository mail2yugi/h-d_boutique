import { useParams } from 'react-router-dom';
import { categoryLabels, categoryDescriptions, ProductCategory } from '@hd-boutique/types';
import { Sparkles, Heart, Crown, Scissors, Shirt } from 'lucide-react';

// Category-specific content with images and details
const categoryContent: Record<ProductCategory, {
  icon: any;
  heroImage: string;
  gallery: string[];
  tagline: string;
  features: string[];
  process: string[];
}> = {
  BLOUSE: {
    icon: Shirt,
    heroImage: '/h-d_boutique/images/categories/blouse-hero.png',
    gallery: [
      '/h-d_boutique/images/categories/blouse-1.png',
      '/h-d_boutique/images/categories/blouse-2.png',
      '/h-d_boutique/images/categories/blouse-3.png',
    ],
    tagline: 'Where Tradition Meets Contemporary Elegance',
    features: [
      'Custom measurements for the perfect fit',
      'Intricate hand embroidery and embellishments',
      'Wide variety of neckline and sleeve designs',
      'Premium fabrics: silk, velvet, brocade & more',
      'Express tailoring available',
    ],
    process: [
      'Consultation & Design Selection',
      'Precise Measurement Taking',
      'Fabric & Embellishment Choice',
      'Expert Tailoring & Fitting',
      'Final Touches & Delivery',
    ],
  },
  SAREE_DESIGNER_WORK: {
    icon: Sparkles,
    heroImage: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=1200&h=600&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1616091216791-a5360b5fc78a?w=400&h=300&fit=crop&q=80',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=300&fit=crop&q=80',
      'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=400&h=300&fit=crop&q=80',
    ],
    tagline: 'Timeless Sarees, Masterful Artistry',
    features: [
      'Handcrafted designer borders and pallus',
      'Zari, sequin, and stone embellishments',
      'Modern & traditional design fusion',
      'Customizable color combinations',
      'Complete blouse coordination',
    ],
    process: [
      'Inspiration & Style Discussion',
      'Saree & Work Type Selection',
      'Embellishment & Color Planning',
      'Artisan Craftsmanship',
      'Quality Check & Delivery',
    ],
  },
  LEHANGA: {
    icon: Crown,
    heroImage: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1200&h=600&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=300&fit=crop&q=80',
      'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400&h=300&fit=crop&q=80',
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop&q=80',
    ],
    tagline: 'Royal Elegance for Your Special Moments',
    features: [
      'Stunning bridal & festive lehengas',
      'Hand-embroidered with premium threads',
      'Coordinated choli and dupatta sets',
      'Customizable silhouettes and flares',
      'Designer motifs and patterns',
    ],
    process: [
      'Vision & Occasion Discussion',
      'Design & Silhouette Selection',
      'Fabric & Embroidery Finalization',
      'Expert Crafting & Detailing',
      'Trial Fitting & Final Delivery',
    ],
  },
  BRIDAL_CUSTOMIZATION: {
    icon: Heart,
    heroImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=600&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=400&h=300&fit=crop&q=80',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=300&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&h=300&fit=crop&q=80',
    ],
    tagline: 'Your Dream Wedding, Our Passionate Creation',
    features: [
      'Complete bridal outfit customization',
      'Exclusive designs tailored to your style',
      'Premium fabrics and finest embellishments',
      'Multiple fitting sessions included',
      'Accessory coordination assistance',
    ],
    process: [
      'Bridal Consultation & Vision Board',
      'Design Conceptualization',
      'Fabric & Embellishment Sourcing',
      'Progressive Fittings & Adjustments',
      'Pre-Wedding Final Touches',
    ],
  },
  CUSTOM_STITCHING: {
    icon: Scissors,
    heroImage: 'https://images.unsplash.com/photo-1558769132-cb1aea841c87?w=1200&h=600&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1558769132-cb1aea841c87?w=400&h=300&fit=crop&q=80',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=300&fit=crop&q=80',
      'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=400&h=300&fit=crop&q=80',
    ],
    tagline: 'Precision Tailoring, Personal Touch',
    features: [
      'Alteration & adjustment services',
      'Custom fit for any garment type',
      'Designer replica stitching',
      'Fabric consultation available',
      'Quick turnaround options',
    ],
    process: [
      'Garment Assessment & Measurement',
      'Style & Modification Discussion',
      'Fabric Analysis & Planning',
      'Meticulous Tailoring Process',
      'Quality Assurance & Handover',
    ],
  },
};

export default function CategoryPage() {
  const { category } = useParams();
  const categoryKey = category?.toUpperCase().replace(/-/g, '_') as ProductCategory;
  const content = categoryContent[categoryKey];
  const Icon = content.icon;

  if (!content) {
    return <div className="container-custom py-8">Category not found</div>;
  }
  
  return (
    <div className="pb-16">
      {/* Hero Section */}
      <div 
        className="relative h-96 bg-cover bg-center"
        style={{ backgroundImage: `url(${content.heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
        <div className="relative container-custom h-full flex flex-col justify-center text-white">
          <div className="flex items-center mb-4">
            <Icon className="w-12 h-12 mr-4" />
            <h1 className="font-display text-5xl font-bold">
              {categoryLabels[categoryKey]}
            </h1>
          </div>
          <p className="text-2xl font-light max-w-2xl">
            {content.tagline}
          </p>
        </div>
      </div>

      <div className="container-custom mt-12">
        {/* Description Section */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <p className="text-xl text-gray-700 leading-relaxed">
            {categoryDescriptions[categoryKey]}
          </p>
        </div>

        {/* Gallery Section */}
        <div className="mb-16">
          <h2 className="font-display text-3xl font-bold text-center mb-8">
            Our Craftsmanship
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {content.gallery.map((image, index) => (
              <div 
                key={index}
                className="relative h-64 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <img 
                  src={image} 
                  alt={`${categoryLabels[categoryKey]} ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Features & Process Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Features */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="font-display text-2xl font-semibold mb-6 flex items-center">
              <Sparkles className="w-6 h-6 mr-3 text-brand-primary" />
              What We Offer
            </h2>
            <ul className="space-y-3">
              {content.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-brand-primary mr-3 mt-1">✦</span>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Process */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="font-display text-2xl font-semibold mb-6 flex items-center">
              <Scissors className="w-6 h-6 mr-3 text-brand-primary" />
              Our Process
            </h2>
            <ol className="space-y-4">
              {content.process.map((step, index) => (
                <li key={index} className="flex items-start">
                  <span className="flex-shrink-0 w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center font-semibold mr-3">
                    {index + 1}
                  </span>
                  <span className="text-gray-700 mt-1">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-brand-primary to-pink-700 p-12 rounded-2xl shadow-2xl text-white text-center">
          <h2 className="font-display text-3xl font-bold mb-4">
            Ready to Create Something Beautiful?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Let's bring your vision to life. Contact us for a personalized consultation 
            and discover how we can craft the perfect {categoryLabels[categoryKey].toLowerCase()} for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/919916632308"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-white text-brand-primary px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Chat on WhatsApp
            </a>
            <a
              href="https://www.google.de/maps/place/H%26D+Boutique/@12.8950787,77.6121472,17z/data=!3m1!4b1!4m6!3m5!1s0x3bae15eab9be867d:0x430af845237e7feb!8m2!3d12.8950735!4d77.6147221!16s%2Fg%2F11yfsm90r3?entry=ttu&g_ep=EgoyMDI2MDEwNC4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/20 transition-colors border-2 border-white"
            >
              <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C7.589 0 4 3.589 4 8c0 6.5 8 16 8 16s8-9.5 8-16c0-4.411-3.589-8-8-8zm0 11.5c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4z"/>
              </svg>
              Visit Our Store
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
