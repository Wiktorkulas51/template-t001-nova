// types.ts - shared types for the Building Navigator feature

export type ApartmentStatus = "available" | "reservation" | "sold";

export interface Apartment {
  id: string;
  label: string;
  status: ApartmentStatus;
  x: number;
  y: number;
  rooms: number;
  area: number;
  floor: number;
  price?: number;
  price_per_m2?: number;
  section?: "front" | "front_courtyard" | "oficyna_lewa" | "oficyna_prawa" | "przyziemia";
  comment?: string;
  finish?: string;
  pdf?: string | { url: string };
  images?: (string | { url: string })[];
  rooms_list?: { name: string; area: number }[];
  type?: string;
  // Perspective polygon [x1, y1, x2, y2, x3, y3, x4, y4]
  poly?: number[];
  hidden?: boolean;
}

export const STATUS_LABELS: Record<ApartmentStatus, string> = {
  available: "Dostępne",
  reservation: "Rezerwacja",
  sold: "Sprzedane",
};

export const STATUS_COLOR: Record<ApartmentStatus, string> = {
  available: "text-green-600",
  reservation: "text-orange-600",
  sold: "text-red-600",
};

export const STATUS_DOT_BG: Record<ApartmentStatus, string> = {
  available: "bg-green-500",
  reservation: "bg-orange-500",
  sold: "bg-red-500",
};


