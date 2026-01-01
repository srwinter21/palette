import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { GenerationResult } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post(api.generate.create.path, async (req, res) => {
    try {
      // Validate input (simulating usage of input)
      const input = api.generate.create.input.parse(req.body);
      const { budgetTier } = input;

      // Simulate async delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mocked response based on the design document
      const mockResult: GenerationResult = {
        afterImageUrl: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80", // Modern living room
        whatApplied: [
          "Warm, mid-tone wood materials",
          "Reduced visual weight in upper areas",
          "Matte black fixtures & hardware",
          "Soft neutral wall color",
          "Layout, windows, and flooring were preserved."
        ],
        estimateRange: {
          low: 27500,
          high: 33000,
          currency: "USD"
        },
        breakdown: [
          {
            category: "Cabinets / Built-ins",
            materialsLow: 8000, materialsHigh: 10000,
            laborLow: 4000, laborHigh: 5000,
            totalLow: 12000, totalHigh: 15000
          },
          {
            category: "Finishes",
            materialsLow: 2500, materialsHigh: 3500,
            laborLow: 1500, laborHigh: 2000,
            totalLow: 4000, totalHigh: 6000
          },
          {
            category: "Fixtures & Lighting",
            materialsLow: 2000, materialsHigh: 2500,
            laborLow: 1000, laborHigh: 1500,
            totalLow: 3000, totalHigh: 4000
          }
        ],
        laborSubtotal: {
          low: 8000,
          high: 10000
        },
        totalEstimate: {
          low: 27500,
          high: 33000
        },
        upgradeTips: [
          "Upgrade cabinet door styles / fronts for the biggest visual return.",
          "Add one statement light fixture or standout hardware set.",
          "Upgrade one focal surface finish (e.g., backsplash tile or wall finish)."
        ],
        savingsTips: [
          "Opt for stock cabinetry or simpler construction while keeping the same layout.",
          "Reduce custom built-ins or millwork in non-focal areas.",
          "Simplify fixture selections while preserving placement and layout."
        ]
      };

      res.status(200).json(mockResult);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}
