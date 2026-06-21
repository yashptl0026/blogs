import Header from "@/components/Header";
import ModernFooter from "@/components/Footer/ModernFooter";
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="min-h-screen flex flex-col bg-editorial-bg font-sans text-editorial-text">
      <Header />
      
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full text-center">
        <h1 className="text-4xl md:text-6xl font-black font-display tracking-tight mb-6">
          Contact Us
        </h1>
        <p className="text-lg text-editorial-muted max-w-2xl mx-auto">
          We'd love to hear from you. Whether you have a question about destinations, pricing, or anything else, our team is ready to answer all your questions.
        </p>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 flex-1">
        
        {/* Contact Info */}
        <div className="space-y-10">
          <div>
            <h2 className="text-2xl font-bold font-display mb-6">Get in Touch</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-50 p-3 rounded-full text-blue-600">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-editorial-text">Email</h3>
                  <p className="text-editorial-muted mt-1">hello@aesthete.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-blue-50 p-3 rounded-full text-blue-600">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-editorial-text">Phone</h3>
                  <p className="text-editorial-muted mt-1">+91 (800) 123-4567</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-blue-50 p-3 rounded-full text-blue-600">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-editorial-text">Office</h3>
                  <p className="text-editorial-muted mt-1">123 Travel Avenue, Mumbai, India 400001</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-editorial-card rounded-3xl p-8 border border-editorial-border shadow-sm">
          <form className="space-y-6" action="#" method="POST">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="first-name" className="text-sm font-bold text-editorial-text">First name</label>
                <input type="text" id="first-name" className="w-full px-4 py-3 rounded-xl border border-editorial-border bg-editorial-bg text-editorial-text focus:border-blue-500 outline-none transition-colors" />
              </div>
              <div className="space-y-2">
                <label htmlFor="last-name" className="text-sm font-bold text-editorial-text">Last name</label>
                <input type="text" id="last-name" className="w-full px-4 py-3 rounded-xl border border-editorial-border bg-editorial-bg text-editorial-text focus:border-blue-500 outline-none transition-colors" />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-bold text-editorial-text">Email address</label>
              <input type="email" id="email" className="w-full px-4 py-3 rounded-xl border border-editorial-border bg-editorial-bg text-editorial-text focus:border-blue-500 outline-none transition-colors" />
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-bold text-editorial-text">Message</label>
              <textarea id="message" rows={4} className="w-full px-4 py-3 rounded-xl border border-editorial-border bg-editorial-bg text-editorial-text focus:border-blue-500 outline-none transition-colors resize-none"></textarea>
            </div>
            <button type="button" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-colors">
              Send Message
            </button>
          </form>
        </div>
      </section>

      <ModernFooter />
    </main>
  );
}
