import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { type GenerationResult } from "@shared/schema";
import { z } from "zod";

type GenerateInput = z.infer<typeof api.generate.create.input>;

export function useGenerateDesign() {
  return useMutation<GenerationResult, Error, GenerateInput>({
    mutationFn: async (data) => {
      const res = await fetch(api.generate.create.path, {
        method: api.generate.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to generate design");
      }

      // Parse response with Zod schema from shared routes
      return api.generate.create.responses[200].parse(await res.json());
    },
  });
}
