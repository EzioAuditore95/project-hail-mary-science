/* Reference values and physical invariants; run with node --test. */
const test = require('node:test');
const assert = require('node:assert/strict');
const P = require('../physics.js');
const near = (actual, expected, relative = 1e-9) => assert.ok(Math.abs(actual - expected) <= Math.max(1, Math.abs(expected)) * relative, `${actual} != ${expected}`);

test('Solar reference, inverse square law and fixed-radius temperature response', () => {
  near(P.stellar(1).flux, 1361);
  near(P.stellar(2).fluxRatio, .25);
  near(P.stellar(.5).fluxRatio, 4);
  near(P.stellar(1, 1.1).luminosity, 1.4641);
  near(P.stellar(2, 1.1).fluxRatio, .366025);
});
test('Rotating habitat reference and radius scaling', () => {
  near(P.rotation(20, 1).rpm, 6.686778, 1e-6);
  near(P.rotation(80, 1).rpm, P.rotation(20, 1).rpm / 2);
  near(P.rotation(20, 1).headGravityRatio, .915);
  near(P.rotation(20, 1).period * P.rotation(20, 1).rpm, 60);
  assert.ok(P.rotation(20, .165).rpm < P.rotation(20, 1).rpm);
});
test('Relativistic rocket matches published one-year and two-year benchmarks', () => {
  // Gibbs/Koks table rounds g to 1.03 ly/year²; allow 0.5% for that approximation.
  const one = P.relativity(1, 1);
  near(one.beta, .775, .003);
  near(one.earthYears, 1.19, .003);
  near(one.distanceLY, .56, .01);
  const two = P.relativity(2, 1);
  near(two.earthYears, 3.75, .005);
  near(two.distanceLY, 2.90, .005);
});
test('Relativity preserves invariant worldline and light speed throughout UI ranges', () => {
  for (const years of [.1, 1, 3, 5]) for (const gravity of [.1, 1, 1.5]) {
    const r = P.relativity(years, gravity);
    assert.ok(r.beta >= 0 && r.beta < 1);
    assert.ok(r.earthYears >= years && Number.isFinite(r.earthYears));
    assert.ok(r.distanceLY < r.earthYears);
    const scale = P.C / (gravity * P.G0 * P.YEAR);
    // Hyperbolic worldline: (distance + c²/a)² − (ct)² = (c²/a)².
    near(((r.distanceLY + scale) ** 2 - r.earthYears ** 2) / scale ** 2, 1, 1e-7);
  }
  assert.deepEqual(P.relativity(1, 0), {beta: 0, gamma: 1, earthYears: 1, distanceLY: 0});
  assert.deepEqual(P.relativity(0, 1), {beta: 0, gamma: 1, earthYears: 0, distanceLY: 0});
  near(P.relativity(1e-6, 1).earthYears, 1e-6);
});
test('Mass-energy conversion uses grams, joules and GWh consistently', () => {
  near(P.energy(1, 100).joules, 8.987551787368176e13);
  near(P.energy(1, 100).gwh, 24.96542163157827);
  near(P.energy(1, 50).gwh, P.energy(1, 100).gwh / 2);
  near(P.energy(10, 100).gwh, P.energy(1, 100).gwh * 10);
  near(P.energy(1, 0).joules, 0);
});
test('Synthetic light curves retain physical bounds and intended signatures', () => {
  for (const mode of ['transit', 'pulsation', 'dimming']) {
    for (let i = 0; i <= 300; i++) {
      const value = P.lightCurve(mode, i / 100, 10);
      assert.ok(value >= .9 - 1e-12 && value <= 1);
    }
  }
  near(P.lightCurve('transit', .5, 2), .98);
  near(P.lightCurve('transit', .5, 2), P.lightCurve('transit', 1.5, 2));
  near(P.lightCurve('dimming', 0, 10), 1);
  near(P.lightCurve('dimming', 3, 10), .9);
  assert.ok(P.lightCurve('dimming', 2, 10) < P.lightCurve('dimming', 1, 10));
});
test('Invalid physical inputs fail explicitly', () => {
  assert.throws(() => P.stellar(0), RangeError);
  assert.throws(() => P.stellar(1, -1), RangeError);
  assert.throws(() => P.rotation(-1, 1), RangeError);
  assert.throws(() => P.energy(1, 101), RangeError);
  assert.throws(() => P.energy(1, NaN), RangeError);
  assert.throws(() => P.relativity(-1, 1), RangeError);
  assert.throws(() => P.relativity(1, Infinity), RangeError);
});
