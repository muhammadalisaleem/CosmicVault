import { Sparkles, Database, Globe, Telescope, Star, ArrowRight, Layers, Eye } from 'lucide-react';
import type { Page } from '../App';

interface LandingPageProps {
  onNavigate: (page: Page) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated starfield background */}
      <div className="absolute inset-0 starfield opacity-30"></div>
      
      {/* Gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Telescope className="w-8 h-8 text-purple-400" strokeWidth={1.5} />
              </div>
              <span className="text-xl tracking-tight">Cosmic Vault</span>
            </div>
            <button
              onClick={() => onNavigate('login')}
              className="px-6 py-2.5 text-sm bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all backdrop-blur-sm"
            >
              Sign In
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="container mx-auto px-6 pt-20 pb-32">
          <div className="max-w-5xl mx-auto">
            {/* Badge */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-gray-300">Your Personal Observatory</span>
              </div>
            </div>

            {/* Main Title */}
            <div className="text-center mb-12">
              <h1 className="mb-6 bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent tracking-tight" style={{ fontSize: '4.5rem', lineHeight: '1.1' }}>
                Document the<br />Universe
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                A modern platform for astro enthusiast to catalog celestial objects, 
                log observations, and track discoveries.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center justify-center gap-4 mb-32">
              <button
                onClick={() => onNavigate('signup')}
                className="group flex items-center gap-2 px-8 py-4 bg-white text-black rounded-lg hover:bg-white/90 transition-all"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-4 gap-4">
              <div className="group p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-purple-500/5 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Database className="w-6 h-6 text-purple-400" strokeWidth={1.5} />
                </div>
                <h5 className="mb-2">SQL Database</h5>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Full CRUD with MS SQL Server integration
                </p>
              </div>

              <div className="group p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Star className="w-6 h-6 text-cyan-400" strokeWidth={1.5} />
                </div>
                <h5 className="mb-2">Celestial Catalog</h5>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Stars, galaxies, nebulae & exoplanets
                </p>
              </div>

              <div className="group p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500/20 to-pink-500/5 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Globe className="w-6 h-6 text-pink-400" strokeWidth={1.5} />
                </div>
                <h5 className="mb-2">88 Constellations</h5>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Official IAU constellation system
                </p>
              </div>

              <div className="group p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-purple-500/5 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Eye className="w-6 h-6 text-purple-400" strokeWidth={1.5} />
                </div>
                <h5 className="mb-2">Observation Logs</h5>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Track equipment & conditions
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="container mx-auto px-6 pb-32">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-3 gap-8 p-12 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm">
              <div className="text-center">
                <div className="text-4xl mb-2 bg-gradient-to-br from-white to-white/40 bg-clip-text text-transparent">128+</div>
                <div className="text-sm text-gray-400">Objects Cataloged</div>
              </div>
              <div className="text-center border-x border-white/10">
                <div className="text-4xl mb-2 bg-gradient-to-br from-white to-white/40 bg-clip-text text-transparent">47+</div>
                <div className="text-sm text-gray-400">Observations Logged</div>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2 bg-gradient-to-br from-white to-white/40 bg-clip-text text-transparent">12+</div>
                <div className="text-sm text-gray-400">Constellations Tracked</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack Section */}
        <div className="container mx-auto px-6 pb-32">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm mb-6">
                <Layers className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-gray-300">Built with modern technology</span>
              </div>
              <h3 className="text-3xl mb-4">Full-Stack Architecture</h3>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Powered by industry-standard technologies for performance and reliability
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-8 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-cyan-400" />
                </div>
                <h5 className="mb-2">React + TypeScript</h5>
                <p className="text-sm text-gray-400">Modern, type-safe UI development</p>
              </div>

              <div className="p-8 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-green-500/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <div className="text-3xl">⚡</div>
                </div>
                <h5 className="mb-2">Node.js Runtime</h5>
                <p className="text-sm text-gray-400">Fast, scalable backend services</p>
              </div>

              <div className="p-8 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-purple-500/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Database className="w-8 h-8 text-purple-400" />
                </div>
                <h5 className="mb-2">MS SQL Server</h5>
                <p className="text-sm text-gray-400">Enterprise-grade data storage</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="container mx-auto px-6 pb-20">
          <div className="max-w-4xl mx-auto">
            <div className="relative p-16 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10 border border-white/10 rounded-3xl backdrop-blur-sm text-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-cyan-500/5"></div>
              <div className="relative z-10">
                <h3 className="text-3xl mb-4">Start Your Journey</h3>
                <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                  Join astronomers documenting their observations and building comprehensive celestial catalogs.
                </p>
                <button
                  onClick={() => onNavigate('signup')}
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-lg hover:bg-white/90 transition-all"
                >
                  <span>Create Free Account</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="container mx-auto px-6 py-12 border-t border-white/10">
          <div className="max-w-5xl mx-auto flex items-center justify-between text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Telescope className="w-5 h-5 text-purple-400" strokeWidth={1.5} />
              <span>Cosmic Vault © Made with ❤️ by Haroon Osman, Ammar Hassan and Ali Saleem</span>
            </div>
            <div className="flex gap-6">
              <button className="hover:text-white transition-colors">Privacy</button>
              <button className="hover:text-white transition-colors">Terms</button>
              <button className="hover:text-white transition-colors">Contact</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}