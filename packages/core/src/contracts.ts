// API contract. Source of truth for the API, the web planner, and (via OpenAPI) the iOS client.

import { z } from 'zod';
import { FEATURE_TYPES } from './features.ts';

export const ROUTE_STYLES = ['relaxed', 'scenic', 'most_beautiful'] as const;
export const INTERESTS = ['views', 'heritage', 'water', 'mountains', 'countryside', 'quiet'] as const;
export const VEHICLES = ['car', 'campervan', 'caravan'] as const;
export type RouteStyle = (typeof ROUTE_STYLES)[number];
export type Interest = (typeof INTERESTS)[number];
export type Vehicle = (typeof VEHICLES)[number];

export const LatLonSchema = z.object({
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),
});

export const PlaceSchema = LatLonSchema.extend({ label: z.string().max(300).optional() });

export const PreferencesSchema = z.object({
  rentalCar: z.boolean().default(false),
  avoidUnpaved: z.boolean().default(true),
  avoidTolls: z.boolean().default(false),
  avoidMotorways: z.boolean().default(true),
  vignettes: z.array(z.string().length(2)).default([]),
});

export const PlanRequestSchema = z.object({
  origin: PlaceSchema,
  destination: PlaceSchema,
  /** Places the driver must pass, in order (e.g. lunch stop). */
  stops: z.array(PlaceSchema).max(8).default([]),
  /**
   * How much the driver wants scenery over speed. Sets the time budget from the fastest route
   * (relaxed ≈ +15%, scenic ≈ +40%, most beautiful ≈ +80%) and how strongly time counts in ranking.
   */
  style: z.enum(ROUTE_STYLES).default('scenic'),
  /** What the driver loves; matching places count more, others less. Empty = everything equally. */
  interests: z.array(z.enum(INTERESTS)).max(INTERESTS.length).default([]),
  /** Optional hard cap on extra minutes over the fastest route. Without it the style decides. */
  extraMinutes: z.number().int().min(0).max(300).optional(),
  /** Car + caravan and campervans stay on calmer, wider roads and never take gravel. */
  vehicle: z.enum(VEHICLES).default('car'),
  departAt: z.string().datetime({ offset: true }).optional(),
  prefs: PreferencesSchema.default({}),
  maxRoutes: z.number().int().min(1).max(5).default(3),
});

const FeatureTypeSchema = z.enum(FEATURE_TYPES);

export const ScorePartsSchema = z.object({
  scenery: z.number(),
  views: z.number().nullable(),
  relief: z.number().nullable(),
  bends: z.number(),
  variety: z.number(),
  motorwayPct: z.number(),
  urbanPct: z.number(),
});

export const AdvisorySchema = z.object({
  kind: z.enum(['ztl', 'lez', 'unpaved', 'vignette', 'toll', 'pass_closed', 'pass_seasonal', 'ferry']),
  severity: z.enum(['info', 'warning', 'block']),
  title: z.string(),
  detail: z.string(),
  atKm: z.number().optional(),
});

export const ConditionsSchema = z.object({
  departure: z.string(),
  arrival: z.string(),
  sunrise: z.string().nullable(),
  sunset: z.string().nullable(),
  arrivesAfterDark: z.boolean(),
  goldenHour: z.object({ fromKm: z.number(), toKm: z.number() }).nullable(),
  glare: z.array(z.object({ fromKm: z.number(), toKm: z.number() })),
  weather: z.array(z.object({
    atKm: z.number(), eta: z.string(), cloud: z.number(), lowCloud: z.number(), precipProb: z.number(),
    precipMm: z.number(), visibilityKm: z.number().nullable(), fog: z.boolean(),
  })),
  verdict: z.enum(['great', 'good', 'mixed', 'poor']),
  notes: z.array(z.string()),
});

export const RouteOptionSchema = z.object({
  id: z.string(),
  rank: z.number().int(),
  label: z.string(),
  source: z.enum(['fastest', 'scenic_model', 'via_spots', 'alternative']),
  score: z.number(),
  parts: ScorePartsSchema,
  summary: z.string(),
  km: z.number(),
  minutes: z.number(),
  extraMinutes: z.number(),
  /** Google encoded polyline, precision 5. */
  polyline: z.string(),
  bbox: z.tuple([z.number(), z.number(), z.number(), z.number()]),
  highlights: z.array(z.object({ name: z.string(), type: FeatureTypeSchema, atKm: z.number() })),
  scenicStops: z.array(LatLonSchema.extend({ name: z.string(), types: z.array(FeatureTypeSchema) })),
  bestStretch: z.object({ fromKm: z.number(), toKm: z.number() }).nullable(),
  conditions: ConditionsSchema.nullable(),
  advisories: z.array(AdvisorySchema),
  handoff: z.object({ googleMaps: z.string(), appleMaps: z.string() }),
});

export const PlanResponseSchema = z.object({
  planId: z.string(),
  modelVersion: z.string(),
  fastest: z.object({ km: z.number(), minutes: z.number() }),
  /** The extra-time budget the planner used (from the style, capped by extraMinutes). */
  budgetMinutes: z.number().optional(),
  routes: z.array(RouteOptionSchema),
  /** Problems that did not stop planning, e.g. "weather unavailable". */
  warnings: z.array(z.string()),
  attribution: z.array(z.string()),
});

export const GeocodeResultSchema = PlaceSchema.extend({ label: z.string(), kind: z.string().optional() });

const Uuid = z.string().uuid();
const Iso = z.string().datetime({ offset: true });

export const TripDaySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  origin: PlaceSchema,
  destination: PlaceSchema,
  stops: z.array(PlaceSchema).default([]),
  extraMinutes: z.number().int().min(0).max(300).default(45),
  route: RouteOptionSchema.optional(),
});

export const TripSchema = z.object({
  id: Uuid,
  name: z.string().min(1).max(120),
  notes: z.string().max(5000).default(''),
  days: z.array(TripDaySchema).min(1).max(60),
  /** How the journey was planned, so it can be re-planned the same way. */
  style: z.enum(ROUTE_STYLES).optional(),
  interests: z.array(z.enum(INTERESTS)).optional(),
  vehicle: z.enum(VEHICLES).optional(),
  createdAt: Iso,
  updatedAt: Iso,
  deleted: z.boolean().default(false),
});

export const RatingSchema = z.object({
  id: Uuid,
  tripId: Uuid.optional(),
  planId: z.string().optional(),
  routeId: z.string().optional(),
  thumbs: z.enum(['up', 'down']),
  comment: z.string().max(2000).optional(),
  modelVersion: z.string(),
  score: z.number(),
  parts: ScorePartsSchema,
  polyline: z.string(),
  drivenAt: Iso.optional(),
  createdAt: Iso,
});

export const SyncRequestSchema = z.object({
  cursor: z.number().int().min(0).nullable().default(null), // Swift Codable omits nil keys
  changes: z.object({
    trips: z.array(TripSchema).max(500).default([]),
    ratings: z.array(RatingSchema).max(500).default([]),
  }).default({}),
});

export const SyncResponseSchema = z.object({
  cursor: z.number().int(),
  changes: z.object({ trips: z.array(TripSchema), ratings: z.array(RatingSchema) }),
  /** Ids of client changes the server ignored because it had a newer version. */
  rejected: z.array(z.string()),
});

export type PlanRequest = z.infer<typeof PlanRequestSchema>;
export type PlanRequestInput = z.input<typeof PlanRequestSchema>;
export type PlanResponse = z.infer<typeof PlanResponseSchema>;
export type RouteOption = z.infer<typeof RouteOptionSchema>;
export type Preferences = z.infer<typeof PreferencesSchema>;
export type Place = z.infer<typeof PlaceSchema>;
export type GeocodeResult = z.infer<typeof GeocodeResultSchema>;
export type Trip = z.infer<typeof TripSchema>;
export type TripDay = z.infer<typeof TripDaySchema>;
export type Rating = z.infer<typeof RatingSchema>;
export type SyncRequest = z.infer<typeof SyncRequestSchema>;
export type SyncResponse = z.infer<typeof SyncResponseSchema>;
