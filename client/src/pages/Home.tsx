import { useState } from "react";
import { useGenerateDesign } from "@/hooks/use-generation";
import { UploadCard } from "@/components/UploadCard";
import { BudgetSelector } from "@/components/BudgetSelector";
import { ResultsView } from "@/components/ResultsView";
import { Loader2, Palette, Sparkles, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type BudgetTier = "budget" | "mid" | "luxury";

export default function Home() {
  const { toast } = useToast();
  const generateMutation = useGenerateDesign();
  
  // State
  const [spaceImage, setSpaceImage] = useState<File | null>(null);
  const [inspoImage, setInspoImage] = useState<File | null>(null);
  const [spacePreview, setSpacePreview] = useState<string | null>(null);
  const [inspoPreview, setInspoPreview] = useState<string | null>(null);
  const [budgetTier, setBudgetTier] = useState<BudgetTier>("mid");

  const handleSpaceUpload = (file: File | null) => {
    setSpaceImage(file);
    if (file) setSpacePreview(URL.createObjectURL(file));
    else setSpacePreview(null);
  };

  const handleInspoUpload = (file: File | null) => {
    setInspoImage(file);
    if (file) setInspoPreview(URL.createObjectURL(file));
    else setInspoPreview(null);
  };

  const handleGenerate = () => {
    if (!spaceImage || !inspoImage) {
      toast({
        title: "Missing Images",
        description: "Please upload both your current space and an inspiration photo.",
        variant: "destructive",
      });
      return;
    }

    generateMutation.mutate({ budgetTier }, {
      onError: (err) => {
        toast({
          title: "Generation Failed",
          description: err.message,
          variant: "destructive",
        });
      }
    });
  };

  const canGenerate = spaceImage && inspoImage;
  const isGenerating = generateMutation.isPending;
  const result = generateMutation.data;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
              <Palette size={20} />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">Palette</span>
          </div>
          <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            How it works
          </a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Intro */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-display text-primary">
            Where your style meets your space.
          </h1>
          <p className="text-lg text-muted-foreground">
            Upload a photo of your room and an inspiration image. We'll generate a stunning design plan and accurate cost estimate instantly.
          </p>
        </div>

        {/* Input Section */}
        <AnimatePresence mode="wait">
          {!result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              className="space-y-12"
            >
              {/* Step 1: Uploads */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <UploadCard
                  title="Your Space"
                  description="Upload a clear photo of the room you want to redesign."
                  image={spacePreview}
                  onImageChange={handleSpaceUpload}
                  className="h-full"
                />
                <UploadCard
                  title="Inspiration"
                  description="Upload a photo that captures the style you love."
                  image={inspoPreview}
                  onImageChange={handleInspoUpload}
                  className="h-full"
                />
              </div>

              {/* Step 2: Budget */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                    2
                  </div>
                  <h3 className="text-xl font-bold">Select your budget tier</h3>
                </div>
                <BudgetSelector selected={budgetTier} onSelect={setBudgetTier} />
              </div>

              {/* Action */}
              <div className="flex flex-col items-center pt-8">
                <button
                  onClick={handleGenerate}
                  disabled={!canGenerate || isGenerating}
                  className={cn(
                    "relative overflow-hidden group px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 transform",
                    !canGenerate || isGenerating
                      ? "bg-muted text-muted-foreground cursor-not-allowed"
                      : "bg-primary text-primary-foreground shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-1 active:translate-y-0"
                  )}
                >
                  <span className="relative z-10 flex items-center gap-3">
                    {isGenerating ? (
                      <>
                        <Loader2 className="animate-spin" />
                        Generating Design...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Generate Design + Estimate
                        <ChevronRight className="w-5 h-5 opacity-50 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                  
                  {/* Hover effect background */}
                  {!isGenerating && canGenerate && (
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  )}
                </button>
                
                {!canGenerate && (
                  <p className="mt-4 text-sm text-muted-foreground animate-pulse">
                    Please upload both images to continue
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Section */}
        {result && (
          <div className="mt-8">
             <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-bold font-display text-primary">Your Design Plan</h2>
                <button 
                  onClick={() => window.location.reload()}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  Start Over
                </button>
             </div>
             <ResultsView result={result} />
          </div>
        )}
      </main>
    </div>
  );
}
