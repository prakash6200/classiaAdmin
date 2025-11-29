"use client"

import { AuthenticatedLayout } from "@/components/authenticated-layout"
import { useExploreContext } from "@/lib/api/explore-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Globe, 
  Smartphone, 
  Apple, 
  ExternalLink, 
  TrendingUp, 
  Users, 
  Building2,
  Sparkles,
  Download,
  CheckCircle2,
  Star,
  Calendar,
  Shield
} from "lucide-react"

export default function ExplorePage() {
  const { products } = useExploreContext()

  const totalDownloads = products.reduce((acc, p) => {
    const downloads = p.downloads?.replace(/[^0-9]/g, "") || "0"
    return acc + parseInt(downloads)
  }, 0)

  const availablePlatforms = new Set(
    products.flatMap((p) => p.platforms.filter((pl) => pl.available).map((pl) => pl.type))
  ).size

  return (
    <AuthenticatedLayout breadcrumbs={[{ label: "Explore", }]}>
      <div className="p-6 space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0f0f1a] via-[#1a1a2e] to-[#0f0f1a] border border-[#d7b56d]/20 p-8 md:p-12">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#d7b56d]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#d7b56d]/3 rounded-full blur-3xl" />
          
          <div className="relative z-10 max-w-4xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#d7b56d] to-[#c9a860] flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#d7b56d] via-[#c9a860] to-[#d7b56d] bg-clip-text text-transparent">
                Explore Our Products
              </h1>
            </div>
            <p className="text-lg text-gray-300 mb-6">
              Discover our comprehensive suite of investment and management platforms designed to empower investors, distributors, and AMCs in the financial ecosystem.
            </p>
            <div className="flex flex-wrap gap-3">
              <Badge className="bg-[#d7b56d]/20 text-[#d7b56d] border-[#d7b56d]/40 px-4 py-2 text-sm">
                <Shield className="h-3.5 w-3.5 mr-1.5" />
                Secure & Reliable
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/40 px-4 py-2 text-sm">
                <Users className="h-3.5 w-3.5 mr-1.5" />
                {totalDownloads}K+ Users
              </Badge>
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40 px-4 py-2 text-sm">
                <Star className="h-3.5 w-3.5 mr-1.5" />
                Highly Rated
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-[#0f0f1a]/80 backdrop-blur-xl border border-[#d7b56d]/20 hover:border-[#d7b56d]/40 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Total Products</p>
                  <p className="text-3xl font-bold text-white">{products.length}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-[#d7b56d]/10 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-[#d7b56d]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0f0f1a]/80 backdrop-blur-xl border border-blue-500/20 hover:border-blue-500/40 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Platforms</p>
                  <p className="text-3xl font-bold text-white">{availablePlatforms}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Smartphone className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0f0f1a]/80 backdrop-blur-xl border border-emerald-500/20 hover:border-emerald-500/40 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Downloads</p>
                  <p className="text-3xl font-bold text-white">{totalDownloads}K+</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <Download className="h-6 w-6 text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0f0f1a]/80 backdrop-blur-xl border border-purple-500/20 hover:border-purple-500/40 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Avg Rating</p>
                  <p className="text-3xl font-bold text-white">4.5</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <Star className="h-6 w-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card
              key={product.id}
              className="bg-[#0f0f1a]/80 backdrop-blur-xl border border-[#d7b56d]/20 hover:border-[#d7b56d]/40 transition-all duration-300 group overflow-hidden flex flex-col"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 ${product.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              
              <CardHeader className="relative z-10 pb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${product.color} flex items-center justify-center shadow-lg`}>
                    <Building2 className="h-7 w-7 text-white" />
                  </div>
                  <Badge className="bg-[#d7b56d]/20 text-[#d7b56d] border-[#d7b56d]/40">
                    {product.category}
                  </Badge>
                </div>
                <CardTitle className="text-2xl text-white group-hover:text-[#d7b56d] transition-colors">
                  {product.displayName}
                </CardTitle>
                <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                  {product.description}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[#d7b56d]/10">
                  <div className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm text-gray-300">{product.rating}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Download className="h-4 w-4 text-emerald-400" />
                    <span className="text-sm text-gray-300">{product.downloads}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="relative z-10 space-y-4 flex-1 flex flex-col">
                {/* Features */}
                <div className="space-y-2 flex-1">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Key Features
                  </p>
                  <div className="space-y-1.5">
                    {product.features.slice(0, 4).map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                        <CheckCircle2 className="h-4 w-4 text-[#d7b56d] flex-shrink-0 mt-0.5" />
                        <span className="leading-tight">{feature}</span>
                      </div>
                    ))}
                    {product.features.length > 4 && (
                      <p className="text-xs text-gray-500 ml-6 mt-1">
                        +{product.features.length - 4} more features
                      </p>
                    )}
                  </div>
                </div>

                {/* Platforms */}
                <div className="space-y-3 pt-4 border-t border-[#d7b56d]/10">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Available On
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {product.platforms.map((platform, idx) => {
                      const Icon = platform.icon
                      return (
                        <div key={idx} className="relative">
                          {platform.available ? (
                            <a
                              href={platform.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between p-3 rounded-lg bg-[#1a1a2e]/50 hover:bg-[#1a1a2e] border border-[#d7b56d]/10 hover:border-[#d7b56d]/30 transition-all group/link"
                            >
                              <div className="flex items-center gap-3">
                                <div className={`h-9 w-9 rounded-lg bg-gradient-to-br ${product.color} flex items-center justify-center shadow-md`}>
                                  <Icon className="h-5 w-5 text-white" />
                                </div>
                                <span className="text-sm font-medium text-white">
                                  {platform.name}
                                </span>
                              </div>
                              <ExternalLink className="h-4 w-4 text-gray-400 group-hover/link:text-[#d7b56d] transition-colors" />
                            </a>
                          ) : (
                            <div className="flex items-center justify-between p-3 rounded-lg bg-[#1a1a2e]/30 border border-gray-700/30 opacity-50 cursor-not-allowed">
                              <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-lg bg-gray-800 flex items-center justify-center">
                                  <Icon className="h-5 w-5 text-gray-500" />
                                </div>
                                <span className="text-sm font-medium text-gray-500">
                                  {platform.name}
                                </span>
                              </div>
                              <Badge variant="secondary" className="text-xs bg-gray-800 text-gray-500">
                                Coming Soon
                              </Badge>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Primary Action */}
                <Button
                  className={`w-full bg-gradient-to-r ${product.color} hover:opacity-90 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-xl mt-4`}
                  onClick={() => {
                    const primaryPlatform = product.platforms.find((p) => p.available)
                    if (primaryPlatform) window.open(primaryPlatform.url, "_blank")
                  }}
                >
                  Get Started with {product.displayName}
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <Card className="bg-gradient-to-br from-[#d7b56d]/10 via-[#c9a860]/5 to-transparent border border-[#d7b56d]/20 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
          <CardContent className="relative p-8 md:p-12 text-center">
            <div className="max-w-3xl mx-auto">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-[#d7b56d] to-[#c9a860] mb-6">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-black mb-3">
                Ready to Transform Your Investment Journey?
              </h3>
              <p className="text-gray-400 mb-8 text-lg">
                Join thousands of satisfied users and start experiencing the power of Classia Capital's ecosystem today.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  className="bg-[#d7b56d] hover:bg-[#c9a860] text-[#0a0a0f] font-semibold px-8 py-6 text-base shadow-lg hover:shadow-xl transition-all"
                  onClick={() => window.open("https://classiacapital.com/", "_blank")}
                >
                  <Globe className="mr-2 h-5 w-5" />
                  Visit Our Website
                </Button>
                <Button
                  variant="outline"
                  className="border-[#d7b56d]/40 text-[#d7b56d] hover:bg-[#d7b56d]/10 font-semibold px-8 py-6 text-base"
                  onClick={() => window.open("https://play.google.com/store/apps/details?id=com.classia.capital", "_blank")}
                >
                  <Smartphone className="mr-2 h-5 w-5" />
                  Download on Android
                </Button>
                <Button
                  variant="outline"
                  className="border-[#d7b56d]/40 text-[#d7b56d] hover:bg-[#d7b56d]/10 font-semibold px-8 py-6 text-base"
                  onClick={() => window.open("https://apps.apple.com/in/app/classia-capital/id6748376094", "_blank")}
                >
                  <Apple className="mr-2 h-5 w-5" />
                  Download on iOS
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  )
}