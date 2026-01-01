import { type GenerationResult, type BreakdownItem } from "@shared/schema";
import { motion } from "framer-motion";
import { Check, ArrowRight, TrendingUp, PiggyBank, PaintBucket, Download, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface ResultsViewProps {
  result: GenerationResult;
}

const formatCurrency = (val: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val);

export function ResultsView({ result }: ResultsViewProps) {
  const exportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    if (!exportRef.current) return;
    
    setIsExporting(true);
    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const contentWidth = pdfWidth - (margin * 2);
      
      const elementsToExport = exportRef.current.querySelectorAll('.pdf-section');
      
      for (let i = 0; i < elementsToExport.length; i++) {
        const element = elementsToExport[i] as HTMLElement;
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff"
        });
        
        const imgData = canvas.toDataURL("image/png");
        const imgProps = pdf.getImageProperties(imgData);
        const imgHeight = (imgProps.height * contentWidth) / imgProps.width;
        
        if (i > 0) pdf.addPage();
        
        // If an element is still too tall for one page, we just scale it to fit
        const finalHeight = imgHeight > (pageHeight - margin * 2) ? (pageHeight - margin * 2) : imgHeight;
        const finalWidth = imgHeight > (pageHeight - margin * 2) ? (imgProps.width * finalHeight) / imgProps.height : contentWidth;
        const xOffset = margin + (contentWidth - finalWidth) / 2;

        pdf.addImage(imgData, "PNG", xOffset, margin, finalWidth, finalHeight);
      }
      
      pdf.save(`Palette-Design-Plan-${Date.now()}.pdf`);
    } catch (error) {
      console.error("PDF Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end mb-4">
        <Button 
          variant="outline" 
          onClick={handleExportPDF} 
          disabled={isExporting}
          className="gap-2"
        >
          {isExporting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          Export to PDF
        </Button>
      </div>
      
      <div ref={exportRef} id="export-container" className="p-4 bg-white rounded-2xl">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-12 pb-20"
        >
          {/* Hero Section: Before/After */}
          <motion.div variants={item} className="pdf-section grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="space-y-6">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/10 group aspect-[4/3]">
                 {/* Descriptive comment for static image replacement if URL breaks */}
                 {/* unsplash interior design modern living room */}
                <img
                  src={result.afterImageUrl}
                  alt="Transformed Space"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-sm font-semibold shadow-sm text-primary">
                  Transformed Design
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <PaintBucket className="w-6 h-6 text-accent" />
                  What We Applied
                </h3>
                <ul className="space-y-4">
                  {result.whatApplied.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-1 w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span className="text-foreground/80">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-primary/5 rounded-2xl p-8 border border-primary/10">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-primary/60 mb-2">Estimated Project Cost</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl lg:text-5xl font-bold text-primary tracking-tight">
                    {formatCurrency(result.totalEstimate.low)} - {formatCurrency(result.totalEstimate.high)}
                  </span>
                </div>
                <p className="mt-2 text-muted-foreground text-sm">
                  Includes materials and estimated labor costs for your area.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Cost Breakdown Table */}
          <motion.div variants={item} className="pdf-section space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold">Detailed Cost Breakdown</h3>
              <div className="text-sm text-muted-foreground hidden sm:block">
                Estimates based on current market rates
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
                  <tr>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4 text-right">Materials</th>
                    <th className="px-6 py-4 text-right">Labor</th>
                    <th className="px-6 py-4 text-right">Total Range</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {result.breakdown.map((row: BreakdownItem, idx: number) => (
                    <tr key={idx} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">{row.category}</td>
                      <td className="px-6 py-4 text-right tabular-nums text-muted-foreground">
                        {formatCurrency(row.materialsLow)} - {formatCurrency(row.materialsHigh)}
                      </td>
                      <td className="px-6 py-4 text-right tabular-nums text-muted-foreground">
                        {formatCurrency(row.laborLow)} - {formatCurrency(row.laborHigh)}
                      </td>
                      <td className="px-6 py-4 text-right tabular-nums font-semibold text-foreground">
                        {formatCurrency(row.totalLow)} - {formatCurrency(row.totalHigh)}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-muted/20 font-semibold">
                    <td className="px-6 py-4 text-foreground">Totals</td>
                    <td className="px-6 py-4 text-right"></td>
                    <td className="px-6 py-4 text-right tabular-nums">
                      {formatCurrency(result.laborSubtotal.low)} - {formatCurrency(result.laborSubtotal.high)}
                    </td>
                    <td className="px-6 py-4 text-right tabular-nums text-primary">
                      {formatCurrency(result.totalEstimate.low)} - {formatCurrency(result.totalEstimate.high)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Tips Section */}
          <motion.div variants={item} className="pdf-section grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl p-8 border border-indigo-100 shadow-sm">
              <h3 className="text-xl font-bold text-indigo-900 mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-500" />
                Where to Splurge
              </h3>
              <ul className="space-y-4">
                {result.upgradeTips.map((tip, i) => (
                  <li key={i} className="flex gap-3 text-indigo-900/80 text-sm leading-relaxed">
                    <ArrowRight className="w-4 h-4 mt-1 text-indigo-400 flex-shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl p-8 border border-emerald-100 shadow-sm">
              <h3 className="text-xl font-bold text-emerald-900 mb-6 flex items-center gap-2">
                <PiggyBank className="w-5 h-5 text-emerald-500" />
                Smart Savings
              </h3>
              <ul className="space-y-4">
                {result.savingsTips.map((tip, i) => (
                  <li key={i} className="flex gap-3 text-emerald-900/80 text-sm leading-relaxed">
                    <ArrowRight className="w-4 h-4 mt-1 text-emerald-400 flex-shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
