import { test } from 'node:test';
import assert from 'node:assert/strict';
import { addDay, newJourney, removeDay, updateDay, toTrip, fromTrip, totals, defaultName, duration } from '../src/journey.ts';
import { TripSchema } from '@scenic/core';

const SIENA = { lat: 43.3188, lon: 11.3308, label: 'Siena, Toscana' };
const PIENZA = { lat: 43.0766, lon: 11.6787, label: 'Pienza, Toscana' };
const ORBETELLO = { lat: 42.44, lon: 11.21, label: 'Orbetello, Toscana' };
const route = (id: string, km: number, minutes: number) => ({ id, rank: 1, label: 'Most scenic', source: 'via_spots' as const, score: 70, parts: { scenery: 70, views: null, relief: 50, bends: 40, variety: 50, motorwayPct: 0, urbanPct: 0 }, summary: 'x', km, minutes, extraMinutes: 10, polyline: '_p~iF~ps|U', bbox: [43, 11, 43.3, 11.6] as [number, number, number, number], highlights: [], scenicStops: [], bestStretch: null, conditions: null, advisories: [], handoff: { googleMaps: 'https://g', appleMaps: 'https://a' } });

test('days chain: a new day starts where the last ended, and edits propagate', () => {
  let j = newJourney('00000000-0000-4000-8000-000000000001');
  j = updateDay(j, 0, { origin: SIENA });
  j = updateDay(j, 0, { destination: PIENZA });
  j = addDay(j);
  assert.deepEqual(j.days[1].origin, PIENZA);
  j = updateDay(j, 0, { destination: ORBETELLO });
  assert.deepEqual(j.days[1].origin, ORBETELLO, 'linked start follows the changed destination');
  assert.equal(defaultName(j), 'Siena to Orbetello');
  assert.equal(removeDay(j, 1).days.length, 1);
  assert.equal(removeDay(removeDay(j, 1), 0).days[0].origin, null);
});

test('changing a day invalidates its plan; totals use chosen routes', () => {
  let j = updateDay(updateDay(newJourney('00000000-0000-4000-8000-000000000002'), 0, { origin: SIENA }), 0, { destination: PIENZA });
  const plan = { planId: 'p', modelVersion: 'm', fastest: { km: 50, minutes: 50 }, routes: [route('a', 60, 70), route('b', 80, 95)], warnings: [], attribution: [] };
  j = updateDay(j, 0, { plan, chosenRouteId: 'b' });
  assert.deepEqual(totals(j), { km: 80, minutes: 95, days: 1, planned: 1 });
  assert.equal(updateDay(j, 0, { extraMinutes: 30 }).days[0].plan, null);
});

test('journey ↔ trip round-trip passes the API schema', () => {
  let j = updateDay(updateDay(newJourney('00000000-0000-4000-8000-000000000003'), 0, { origin: SIENA }), 0, { destination: PIENZA, departAt: '' });
  j = updateDay(j, 0, { departAt: '2026-06-01T08:30' });
  j = updateDay(j, 0, { plan: { planId: 'p', modelVersion: 'm', fastest: { km: 50, minutes: 50 }, routes: [route('a', 60, 70)], warnings: [], attribution: [] }, chosenRouteId: 'a' });
  const trip = TripSchema.parse(toTrip(j, new Date('2026-05-01T10:00:00Z')));
  assert.equal(trip.days[0].date, '2026-06-01');
  assert.equal(trip.days[0].route?.id, 'a');
  const back = fromTrip(trip);
  assert.equal(back.days[0].chosenRouteId, 'a');
  assert.equal(duration(95), '1 h 35 min');
});
