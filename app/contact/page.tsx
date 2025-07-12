import type { Metadata } from "next";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaTwitter, FaLinkedin, FaClock, FaPaperPlane } from "react-icons/fa";

export const metadata: Metadata = {
  title: "Contact Us - NowSpike",
  description: "Get in touch with the NowSpike team. We'd love to hear from you about trending news, partnerships, or feedback.",
  keywords: "contact nowspike, news tips, partnerships, feedback, trending news contact",
  openGraph: {
    title: "Contact Us - NowSpike",
    description: "Get in touch with the NowSpike team for news tips, partnerships, or feedback.",
    url: "/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Have a trending story tip? Questions about our platform? Partnership opportunities? 
            We&apos;d love to hear from you and help you stay ahead of the trends.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <FaPaperPlane className="text-blue-600" />
              Send us a Message
            </h2>

            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  <option value="">Select a subject</option>
                  <option value="news-tip">News Tip</option>
                  <option value="partnership">Partnership Inquiry</option>
                  <option value="feedback">Feedback</option>
                  <option value="technical">Technical Support</option>
                  <option value="press">Press Inquiry</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                  placeholder="Tell us more about your inquiry..."
                ></textarea>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="newsletter"
                  name="newsletter"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor="newsletter" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Subscribe to our newsletter for trending updates
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Details */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Contact Information
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaEnvelope className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Email</h3>
                    <p className="text-gray-600 dark:text-gray-300">contact@nowspike.com</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">We respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaPhone className="text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Phone</h3>
                    <p className="text-gray-600 dark:text-gray-300">+1 (555) 123-4567</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Mon-Fri, 9 AM - 6 PM EST</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaMapMarkerAlt className="text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Office</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      123 Trending Street<br />
                      New York, NY 10001<br />
                      United States
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaClock className="text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Business Hours</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Monday - Friday: 9:00 AM - 6:00 PM EST<br />
                      Saturday: 10:00 AM - 4:00 PM EST<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Follow Us
              </h2>

              <div className="flex gap-4">
                <a
                  href="https://twitter.com/nowspike"
                  className="w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center transition-colors"
                  aria-label="Follow us on Twitter"
                >
                  <FaTwitter />
                </a>
                <a
                  href="https://linkedin.com/company/nowspike"
                  className="w-12 h-12 bg-blue-700 hover:bg-blue-800 text-white rounded-lg flex items-center justify-center transition-colors"
                  aria-label="Follow us on LinkedIn"
                >
                  <FaLinkedin />
                </a>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300 mt-4">
                Stay connected for the latest trending news and platform updates.
              </p>
            </div>

            {/* Quick Tips */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl shadow-xl p-8">
              <h2 className="text-xl font-bold mb-4">Quick Tips</h2>
              <ul className="space-y-2 text-sm">
                <li>• For breaking news tips, email us directly at tips@nowspike.com</li>
                <li>• Partnership inquiries typically receive a response within 48 hours</li>
                <li>• Technical issues? Include your browser and device information</li>
                <li>• Follow us on social media for real-time trending updates</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}