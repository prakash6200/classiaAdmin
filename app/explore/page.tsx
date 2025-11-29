"use client"

import { AuthenticatedLayout } from "@/components/authenticated-layout"
import { useExploreContext } from "@/lib/api/explore-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Globe, Smartphone, Apple, ExternalLink, TrendingUp, Users, 
  Building2, Sparkles, Download, CheckCircle2, Star, Shield 
} from "lucide-react"

export default function ExplorePage() {
  const { products = [] } = useExploreContext() || {}

  // ---- SAFE TOTAL DOWNLOADS ----
  const totalDownloads = products.reduce((acc, p) => {
    const raw = p?.downloads || "0"
    const clean = typeof raw === "string" ? raw.replace(/[^0-9]/g, "") : "0"
    const num = parseInt(clean)
    return acc + (isNaN(num) ? 0 : num)
  }, 0)

  // ---- SAFE AVAILABLE PLATFORMS ----
  const availablePlatforms = new Set(
    products.flatMap((p) =>
      p?.platforms
        ?.filter((pl) => pl?.available)
        ?.map((pl) => pl?.type) ?? []
    )
  ).size

  return (
    <AuthenticatedLayout breadcrumbs={[{ label: "Explore" }]}>
      <div className="p-6 space-y-8">

        {/* HERO SECTION */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0f0f1a] via-[#1a1a2e] to-[#0f0f1a] border border-[#d7b56d]/20 p-8 md:p-12">
          
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
              Discover our complete investment platforms designed for investors, distributors, and AMCs.
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

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Total Products */}
          <Card className="bg-[#0f0f1a]/80 backdrop-blur-xl border border-[#d7b56d]/20 hover:border-[#d7b56d]/40 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Products</p>
                  <p className="text-3xl font-bold text-white">{products.length}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-[#d7b56d]/10 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-[#d7b56d]" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Platforms */}
          <Card className="bg-[#0f0f1a]/80 backdrop-blur-xl border border-blue-500/20 hover:border-blue-500/40 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Platforms</p>
                  <p className="text-3xl font-bold text-white">{availablePlatforms}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Smartphone className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Downloads */}
          <Card className="bg-[#0f0f1a]/80 backdrop-blur-xl border border-emerald-500/20 hover:border-emerald-500/40 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Downloads</p>
                  <p className="text-3xl font-bold text-white">{totalDownloads}K+</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <Download className="h-6 w-6 text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rating */}
          <Card className="bg-[#0f0f1a]/80 backdrop-blur-xl border border-purple-500/20 hover:border-purple-500/40 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Avg Rating</p>
                  <p className="text-3xl font-bold text-white">4.5</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <Star className="h-6 w-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* PRODUCTS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {products.map((product) => {
            const safeFeatures = product?.features ?? []
            const safePlatforms = product?.platforms ?? []

            return (
              <Card
                key={product?.id}
                className="bg-[#0f0f1a]/80 backdrop-blur-xl border border-[#d7b56d]/20 hover:border-[#d7b56d]/40 transition-all duration-300 group overflow-hidden flex flex-col"
              >
                <CardHeader className="relative z-10 pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${product?.color} flex items-center justify-center shadow-lg`}>
                      <Building2 className="h-7 w-7 text-white" />
                    </div>

                    <Badge className="bg-[#d7b56d]/20 text-[#d7b56d] border-[#d7b56d]/40">
                      {product?.category ?? "App"}
                    </Badge>
                  </div>

                  <CardTitle className="text-2xl text-white">{product?.displayName ?? "Unnamed Product"}</CardTitle>

                  <p className="text-sm text-gray-400 mt-2">
                    {product?.description ?? "No description available."}
                  </p>

                  {/* STATS */}
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[#d7b56d]/10">
                    <div className="flex items-center gap-1.5">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm text-gray-300">
                        {product?.rating ?? "—"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Download className="h-4 w-4 text-emerald-400" />
                      <span className="text-sm text-gray-300">
                        {product?.downloads ?? "0"}
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="relative z-10 space-y-4 flex-1 flex flex-col">

                  {/* FEATURES */}
                  <div className="space-y-2 flex-1">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Key Features
                    </p>

                    <div className="space-y-1.5">
                      {safeFeatures.slice(0, 4).map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                          <CheckCircle2 className="h-4 w-4 text-[#d7b56d]" />
                          <span>{feature}</span>
                        </div>
                      ))}

                      {safeFeatures.length > 4 && (
                        <p className="text-xs text-gray-500 ml-6">
                          +{safeFeatures.length - 4} more features
                        </p>
                      )}
                    </div>
                  </div>

                  {/* PLATFORMS */}
                  <div className="space-y-3 pt-4 border-t border-[#d7b56d]/10">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Available On
                    </p>

                    <div className="grid grid-cols-1 gap-2">
                      {safePlatforms.map((platform, idx) => {
                        const Icon = platform?.icon
                        const isAvailable = platform?.available
                        const url = platform?.url ?? "#"

                        return (
                          <div key={idx}>
                            {isAvailable ? (
                              <button
                                onClick={() => window.open(url, "_blank")}
                                className="w-full flex items-center justify-between p-3 rounded-lg bg-[#1a1a2e]/50 hover:bg-[#1a1a2e] border border-[#d7b56d]/10 hover:border-[#d7b56d]/30 transition-all cursor-pointer"
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`h-9 w-9 rounded-lg bg-gradient-to-br ${product?.color} flex items-center justify-center`}>
                                    {Icon && <Icon className="h-5 w-5 text-white" />}
                                  </div>
                                  <span className="text-sm text-white">
                                    {platform?.name ?? "Platform"}
                                  </span>
                                </div>
                                <ExternalLink className="h-4 w-4 text-gray-400" />
                              </button>
                            ) : (
                              <div className="flex items-center justify-between p-3 rounded-lg bg-[#1a1a2e]/30 border border-gray-700/30 opacity-50 cursor-not-allowed">
                                <div className="flex items-center gap-3">
                                  <div className="h-9 w-9 rounded-lg bg-gray-800 flex items-center justify-center">
                                    {Icon && <Icon className="h-5 w-5 text-gray-500" />}
                                  </div>
                                  <span className="text-sm text-gray-500">
                                    {platform?.name ?? "Platform"}
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

                  {/* ACTION BUTTON */}
                  <Button
                    className={`w-full bg-gradient-to-r ${product?.color} hover:opacity-90 text-white font-semibold mt-4`}
                    onClick={() => {
                      const primary = safePlatforms.find((p) => p?.available)
                      if (primary?.url) window.open(primary.url, "_blank")
                    }}
                  >
                    Get Started with {product?.displayName ?? "Product"}
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>

                </CardContent>
              </Card>
            )
          })}
        </div>

      </div>
    </AuthenticatedLayout>
  )
}
