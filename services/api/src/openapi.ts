// Prints the OpenAPI 3.1 document generated from the zod contract (npm run openapi -w services/api).

import { zodToJsonSchema } from 'zod-to-json-schema';
import * as C from '@scenic/core/contracts';

const schemas = {
  PlanRequest: C.PlanRequestSchema, PlanResponse: C.PlanResponseSchema, ExploreRequest: C.ExploreRequestSchema, ExploreResponse: C.ExploreResponseSchema, ExploreDestination: C.ExploreDestinationSchema, RouteOption: C.RouteOptionSchema,
  GeocodeResult: C.GeocodeResultSchema, Trip: C.TripSchema, Rating: C.RatingSchema,
  SyncRequest: C.SyncRequestSchema, SyncResponse: C.SyncResponseSchema,
};
const components: Record<string, unknown> = {};
for (const [name, s] of Object.entries(schemas)) components[name] = zodToJsonSchema(s, { target: 'openApi3', $refStrategy: 'none' });

const ref = (n: string) => ({ $ref: `#/components/schemas/${n}` });
const json = (n: string) => ({ content: { 'application/json': { schema: ref(n) } } });
const auth = [{ bearer: [] }];

const doc = {
  openapi: '3.1.0',
  info: { title: 'Scenic Route API', version: '0.1.0', description: 'Plan scenic drives. See docs/ARCHITECTURE.md.' },
  servers: [{ url: 'http://localhost:8787' }],
  components: { schemas: components, securitySchemes: { bearer: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } } },
  paths: {
    '/v1/explore': { post: { operationId: 'explore', requestBody: json('ExploreRequest'), responses: { 200: { description: 'Scenic places within a drive time', ...json('ExploreResponse') }, 400: { description: 'Invalid request' }, 422: { description: 'Nothing reachable' } } } },
    '/v1/plan': { post: { operationId: 'plan', requestBody: json('PlanRequest'), responses: { 200: { description: 'Ranked routes', ...json('PlanResponse') }, 400: { description: 'Invalid request' }, 422: { description: 'No route' } } } },
    '/v1/geocode': { get: { operationId: 'geocode', parameters: [{ name: 'q', in: 'query', required: true, schema: { type: 'string' } }, { name: 'lang', in: 'query', schema: { type: 'string' } }, { name: 'lat', in: 'query', schema: { type: 'number' } }, { name: 'lon', in: 'query', schema: { type: 'number' } }], responses: { 200: { description: 'Places', content: { 'application/json': { schema: { type: 'object', properties: { results: { type: 'array', items: ref('GeocodeResult') } } } } } } } } },
    '/v1/auth/anonymous': { post: { operationId: 'authAnonymous', responses: { 200: { description: 'Token', content: { 'application/json': { schema: { type: 'object', properties: { userId: { type: 'string' }, token: { type: 'string' } } } } } } } } },
    '/v1/auth/apple': { post: { operationId: 'authApple', security: auth, requestBody: { content: { 'application/json': { schema: { type: 'object', required: ['identityToken'], properties: { identityToken: { type: 'string' } } } } } }, responses: { 200: { description: 'Token' }, 401: { description: 'Not verified' } } } },
    '/v1/trips': { get: { operationId: 'listTrips', security: auth, responses: { 200: { description: 'Trips', content: { 'application/json': { schema: { type: 'object', properties: { trips: { type: 'array', items: ref('Trip') } } } } } } } } },
    '/v1/trips/{id}': {
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
      get: { operationId: 'getTrip', security: auth, responses: { 200: { description: 'Trip', ...json('Trip') }, 404: { description: 'Not found' } } },
      put: { operationId: 'putTrip', security: auth, requestBody: json('Trip'), responses: { 200: { description: 'Stored', ...json('Trip') }, 409: { description: 'Server has a newer version', ...json('Trip') } } },
      delete: { operationId: 'deleteTrip', security: auth, responses: { 204: { description: 'Deleted' } } },
    },
    '/v1/sync': { post: { operationId: 'sync', security: auth, requestBody: json('SyncRequest'), responses: { 200: { description: 'Changes since cursor', ...json('SyncResponse') } } } },
    '/v1/ratings': { post: { operationId: 'addRatings', security: auth, requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { ratings: { type: 'array', items: ref('Rating') } } } } } }, responses: { 201: { description: 'Stored' } } } },
    '/v1/regions': { get: { operationId: 'regions', responses: { 200: { description: 'Regions and offline packs' } } } },
    '/healthz': { get: { operationId: 'health', responses: { 200: { description: 'OK' } } } },
  },
};

process.stdout.write(JSON.stringify(doc, null, 2) + '\n');
