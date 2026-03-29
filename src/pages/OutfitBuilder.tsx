import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, ArrowRight, RefreshCw, ShoppingBag, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { StoreHeader } from "@/components/StoreHeader";
import { StoreFooter } from "@/components/StoreFooter";
import { staticProducts, type StaticProduct } from "@/data/staticProducts";
import { supabase } from "@/integrations/supabase/client";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

type Gender = "men" | "women";
type Occasion = "everyday" | "smart-casual" | "formal" | "weekend";
type Style = "classic" | "minimal" | "layered" | "sporty-chic";

interface OutfitResult {
  outfitName: string;
  selectedProductIds: string[];
  explanation: string;
  piecesBreakdown: Array<{
    productId: string;
    role: string;
    reason: string;
  }>;
  stylingTips: string[];
  alternativeSwaps: Array<{
    originalId: string;
    alternativeId: string;
    reason: string;
  }>;
}

const occasions: Array<{ value: Occasion; label: string; emoji: string }> = [
  { value: "everyday", label: "Everyday", emoji: "☀️" },
  { value: "smart-casual", label: "Smart Casual", emoji: "✨" },
  { value: "formal", label: "Formal", emoji: "🎩" },
  { value: "weekend", label: "Weekend", emoji: "🌿" },
];

const styles: Array<{ value: Style; label: string }> = [
  { value: "classic", label: "Classic" },
  { value: "minimal", label: "Minimal" },
  { value: "layered", label: "Layered" },
  { value: "sporty-chic", label: "Sporty Chic" },
];

export default function OutfitBuilder() {
  const [step, setStep] = useState(0);
  const [gender, setGender] = useState<Gender | null>(null);
  const [occasion, setOccasion] = useState<Occasion | null>(null);
  const [style, setStyle] = useState<Style | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OutfitResult | null>(null);
  const [error, setError] = useState("");
  const addStaticItem = useCartStore((s) => s.addStaticItem);

  const filteredProducts = useMemo(() => {
    if (!gender) return staticProducts;
    return staticProducts.filter((p) => p.category === gender);
  }, [gender]);

  const resultProducts = useMemo(() => {
    if (!result) return [];
    return result.selectedProductIds
      .map((id) => staticProducts.find((p) => p.id === id))
      .filter(Boolean) as StaticProduct[];
  }, [result]);

  const totalPrice = useMemo(
    () => resultProducts.reduce((sum, p) => sum + p.price, 0),
    [resultProducts]
  );

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("outfit-suggestion", {
        body: {
          gender: gender || "unisex",
          occasion: occasion || "everyday",
          style: style || "classic",
          products: filteredProducts.map((p) => ({
            id: p.id,
            title: p.title,
            category: p.category,
            tags: p.tags,
            price: p.price,
            currency: p.currency,
          })),
        },
      });

      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);
      setResult(data);
      setStep(3);
    } catch (e) {
      console.error(e);
      setError("Could not generate outfit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAllToCart = () => {
    resultProducts.forEach((p) => {
      addStaticItem(p, "M", 1);
    });
    toast.success(`${resultProducts.length} items added to bag`);
  };

  const resetAll = () => {
    setStep(0);
    setGender(null);
    setOccasion(null);
    setStyle(null);
    setResult(null);
    setError("");
  };

  const canProceed = () => {
    if (step === 0) return gender !== null;
    if (step === 1) return occasion !== null;
    if (step === 2) return style !== null;
    return false;
  };

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else if (step === 2) {
      handleGenerate();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />

      <main className="pt-24 pb-20">
        <div className="container max-w-2xl mx-auto px-5">
          {/* Header */}
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-gold mb-3 flex items-center justify-center gap-2">
              <Sparkles className="w-3.5 h-3.5" /> AI Stylist
            </p>
            <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-3">
              Build Your Outfit
            </h1>
            <p className="font-sans text-sm text-muted-foreground max-w-md mx-auto">
              Answer a few questions and let our AI curate the perfect ensemble from our collection.
            </p>
          </motion.div>

          {/* Progress */}
          {step < 3 && !loading && (
            <div className="flex items-center gap-2 mb-10 max-w-xs mx-auto">
              {[0, 1, 2].map((s) => (
                <div
                  key={s}
                  className={`flex-1 h-[2px] rounded-full transition-all duration-500 ${
                    s <= step ? "bg-foreground" : "bg-border"
                  }`}
                />
              ))}
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* Loading */}
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-20"
              >
                <motion.div
                  className="mx-auto w-16 h-16 rounded-full border-2 border-foreground/10 border-t-foreground flex items-center justify-center mb-6"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-5 h-5 text-foreground" />
                </motion.div>
                <p className="font-serif text-lg text-foreground mb-2">Curating your look</p>
                <p className="font-sans text-[11px] text-muted-foreground uppercase tracking-[0.15em]">
                  Analyzing style, color harmony & fit
                </p>
              </motion.div>
            )}

            {/* Step 0: Gender */}
            {step === 0 && !loading && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">Step 1 of 3</p>
                  <h2 className="font-serif text-xl text-foreground">Who are you styling?</h2>
                </div>
                <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                  {(["men", "women"] as Gender[]).map((g) => (
                    <button
                      key={g}
                      onClick={() => setGender(g)}
                      className={`relative h-28 rounded-sm border-2 flex flex-col items-center justify-center gap-2 transition-all duration-300 ${
                        gender === g
                          ? "border-foreground bg-foreground text-background"
                          : "border-border hover:border-foreground/40 text-foreground"
                      }`}
                    >
                      <span className="font-serif text-2xl">{g === "men" ? "♂" : "♀"}</span>
                      <span className="font-sans text-[11px] uppercase tracking-[0.15em] font-medium">
                        {g === "men" ? "Men" : "Women"}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 1: Occasion */}
            {step === 1 && !loading && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">Step 2 of 3</p>
                  <h2 className="font-serif text-xl text-foreground">What's the occasion?</h2>
                </div>
                <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                  {occasions.map((o) => (
                    <button
                      key={o.value}
                      onClick={() => setOccasion(o.value)}
                      className={`h-20 rounded-sm border-2 flex flex-col items-center justify-center gap-1.5 transition-all duration-300 ${
                        occasion === o.value
                          ? "border-foreground bg-foreground text-background"
                          : "border-border hover:border-foreground/40 text-foreground"
                      }`}
                    >
                      <span className="text-lg">{o.emoji}</span>
                      <span className="font-sans text-[11px] uppercase tracking-[0.12em] font-medium">{o.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Style */}
            {step === 2 && !loading && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">Step 3 of 3</p>
                  <h2 className="font-serif text-xl text-foreground">Pick your style vibe</h2>
                </div>
                <div className="flex flex-wrap justify-center gap-3 max-w-md mx-auto">
                  {styles.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => setStyle(s.value)}
                      className={`h-11 px-6 rounded-sm border-2 font-sans text-[11px] uppercase tracking-[0.12em] font-medium transition-all duration-300 ${
                        style === s.value
                          ? "border-foreground bg-foreground text-background"
                          : "border-border hover:border-foreground/40 text-foreground"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Result */}
            {step === 3 && result && !loading && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                {/* Outfit Name & Explanation */}
                <div className="text-center space-y-3">
                  <motion.p
                    className="font-sans text-[10px] uppercase tracking-[0.3em] text-gold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    Your curated look
                  </motion.p>
                  <motion.h2
                    className="font-serif text-2xl md:text-3xl text-foreground"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {result.outfitName}
                  </motion.h2>
                  <motion.p
                    className="font-sans text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {result.explanation}
                  </motion.p>
                </div>

                {/* Product Cards */}
                <div className={`grid gap-4 ${resultProducts.length === 1 ? "grid-cols-1 max-w-xs mx-auto" : resultProducts.length === 2 ? "grid-cols-2" : resultProducts.length === 3 ? "grid-cols-3" : "grid-cols-2 md:grid-cols-4"}`}>
                  {resultProducts.map((product, i) => {
                    const breakdown = result.piecesBreakdown.find(
                      (b) => b.productId === product.id
                    );
                    return (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + i * 0.1 }}
                        className="group"
                      >
                        <Link to={`/product/static/${product.handle}`}>
                          <div className="aspect-square bg-secondary/50 rounded-sm overflow-hidden mb-3 relative">
                            <img
                              src={product.image}
                              alt={product.title}
                              className="w-full h-full object-contain mix-blend-multiply p-4 group-hover:scale-105 transition-transform duration-500"
                            />
                            {breakdown && (
                              <div className="absolute top-2 left-2 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-sm">
                                <span className="font-sans text-[9px] uppercase tracking-[0.15em] text-foreground font-medium">
                                  {breakdown.role}
                                </span>
                              </div>
                            )}
                          </div>
                          <p className="font-serif text-sm text-foreground mb-0.5 group-hover:underline underline-offset-2">{product.title}</p>
                          <p className="font-sans text-[11px] text-muted-foreground">
                            {product.currency} {product.price.toLocaleString()}
                          </p>
                        </Link>
                        {breakdown && (
                          <p className="font-sans text-[10px] text-muted-foreground/70 mt-1.5 leading-relaxed">
                            {breakdown.reason}
                          </p>
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                {/* Total */}
                <motion.div
                  className="flex items-center justify-between border-t border-b border-border py-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <span className="font-sans text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                    Complete outfit
                  </span>
                  <span className="font-serif text-lg text-foreground">
                    EGP {totalPrice.toLocaleString()}
                  </span>
                </motion.div>

                {/* Styling Tips */}
                {result.stylingTips?.length > 0 && (
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-foreground font-medium">
                      Styling tips
                    </p>
                    {result.stylingTips.map((tip, i) => (
                      <p key={i} className="font-sans text-[11px] text-muted-foreground leading-relaxed">
                        ✦ {tip}
                      </p>
                    ))}
                  </motion.div>
                )}

                {/* Alternative Swaps */}
                {result.alternativeSwaps?.length > 0 && (
                  <motion.div
                    className="space-y-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                  >
                    <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-foreground font-medium">
                      Alternative swaps
                    </p>
                    {result.alternativeSwaps.map((swap, i) => {
                      const orig = staticProducts.find((p) => p.id === swap.originalId);
                      const alt = staticProducts.find((p) => p.id === swap.alternativeId);
                      if (!orig || !alt) return null;
                      return (
                        <div key={i} className="flex items-center gap-3 bg-muted/30 rounded-sm p-3">
                          <div className="w-10 h-10 bg-secondary/50 rounded-sm overflow-hidden flex-shrink-0">
                            <img src={orig.image} alt="" className="w-full h-full object-contain mix-blend-multiply p-1" />
                          </div>
                          <ArrowRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                          <div className="w-10 h-10 bg-secondary/50 rounded-sm overflow-hidden flex-shrink-0">
                            <img src={alt.image} alt="" className="w-full h-full object-contain mix-blend-multiply p-1" />
                          </div>
                          <p className="font-sans text-[10px] text-muted-foreground leading-relaxed flex-1">
                            {swap.reason}
                          </p>
                        </div>
                      );
                    })}
                  </motion.div>
                )}

                {/* Actions */}
                <motion.div
                  className="flex gap-3 pt-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                >
                  <button
                    onClick={resetAll}
                    className="flex-1 h-12 border border-border font-sans text-[11px] uppercase tracking-[0.15em] text-foreground hover:bg-muted/50 transition-colors flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Start Over
                  </button>
                  <button
                    onClick={handleAddAllToCart}
                    className="flex-1 h-12 bg-foreground text-background font-sans text-[11px] uppercase tracking-[0.15em] hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" /> Add All to Bag
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error */}
          {error && (
            <motion.p
              className="text-center font-sans text-[11px] text-destructive mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.p>
          )}

          {/* Navigation Buttons */}
          {step < 3 && !loading && (
            <motion.div
              className="flex gap-3 mt-10 max-w-sm mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {step > 0 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="h-12 px-6 border border-border font-sans text-[11px] uppercase tracking-[0.15em] text-foreground hover:bg-muted/50 transition-colors flex items-center gap-2"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Back
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex-1 h-12 bg-foreground text-background font-sans text-[11px] uppercase tracking-[0.15em] hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {step === 2 ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5" /> Generate Outfit
                  </>
                ) : (
                  <>
                    Continue <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </motion.div>
          )}
        </div>
      </main>

      <StoreFooter />
    </div>
  );
}
