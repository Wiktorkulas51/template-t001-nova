import type { StudioTemplateId } from "@/studio/engine/schema";
import { defaultStudioAdapter } from "./default.adapter";
import { blushStudioAdapter } from "./blush.adapter";
import type { StudioAdapter } from "./types";

const ADAPTERS: Record<StudioTemplateId, StudioAdapter> = {
  default: defaultStudioAdapter,
  blush: blushStudioAdapter,
};

export function getStudioAdapter(template: StudioTemplateId): StudioAdapter {
  return ADAPTERS[template];
}

export function listStudioAdapters(): StudioAdapter[] {
  return Object.values(ADAPTERS);
}
