import { GEOCODE_URL } from "../utils/constants.ts";

export interface GeocodeResult {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
}

export async function geocodeCity(name: string): Promise<GeocodeResult | null> {
  const url = `${GEOCODE_URL}?name=${encodeURIComponent(name)}&count=1&language=es&format=json`;
  const res = await fetch(url);
  const data = await res.json() as { results?: GeocodeResult[] };
  return data.results?.[0] ?? null;
}
