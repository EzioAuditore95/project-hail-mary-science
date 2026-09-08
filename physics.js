/* Modelli didattici puri. Unità SI internamente; nessuna dipendenza dal DOM. */
(function (root) {
  'use strict';
  const C = 299792458;
  const G0 = 9.80665;
  const YEAR = 365.25 * 24 * 3600;
  const SOLAR_FLUX = 1361;
  const positive = (value, name) => {
    if (!Number.isFinite(value) || value <= 0) throw new RangeError(`${name} deve essere positivo e finito`);
  };
  function stellar(distanceAU, temperatureRatio = 1) {
    positive(distanceAU, 'Distanza'); positive(temperatureRatio, 'Temperatura');
    const luminosity = temperatureRatio ** 4;
    const fluxRatio = luminosity / distanceAU ** 2;
    return {luminosity, fluxRatio, flux: SOLAR_FLUX * fluxRatio};
  }
  function rotation(radius, gravityG) {
    positive(radius, 'Raggio'); positive(gravityG, 'Gravità');
    const omega = Math.sqrt(gravityG * G0 / radius);
    return {omega, rpm: omega * 60 / (2 * Math.PI), period: 2 * Math.PI / omega,
      headGravityRatio: Math.max(0, radius - 1.7) / radius};
  }
  function relativity(years, gravityG) {
    if (!Number.isFinite(years) || years < 0) throw new RangeError('Tempo non valido');
    if (!Number.isFinite(gravityG) || gravityG < 0) throw new RangeError('Accelerazione non valida');
    if (gravityG === 0) return {beta: 0, gamma: 1, earthYears: years, distanceLY: 0};
    const a = gravityG * G0;
    const x = a * years * YEAR / C;
    const gamma = Math.cosh(x);
    return {beta: Math.tanh(x), gamma, earthYears: C / a * Math.sinh(x) / YEAR,
      distanceLY: C / (a * YEAR) * 2 * Math.sinh(x / 2) ** 2};
  }
  function energy(massGrams, efficiencyPercent) {
    positive(massGrams, 'Massa');
    if (!Number.isFinite(efficiencyPercent) || efficiencyPercent < 0 || efficiencyPercent > 100) throw new RangeError('Rendimento non valido');
    const joules = massGrams / 1000 * C ** 2 * efficiencyPercent / 100;
    return {joules, gwh: joules / 3.6e12, equivalentMassGrams: massGrams * efficiencyPercent / 100};
  }
  // Forme sintetiche esplicative; non sono fit di dati osservativi.
  function lightCurve(mode, phase, depthPercent) {
    const depth = depthPercent / 100;
    const p = ((phase % 1) + 1) % 1;
    if (mode === 'transit') {
      const offset = Math.abs(p - 0.5);
      const covered = offset < 0.1 ? 1 : offset < 0.17 ? (0.17 - offset) / 0.07 : 0;
      return 1 - depth * covered;
    }
    if (mode === 'pulsation') return 1 - depth * (0.5 - 0.5 * Math.cos(2 * Math.PI * phase));
    if (mode === 'dimming') return 1 - depth * Math.max(0, Math.min(1, phase / 3));
    throw new RangeError('Modello di curva non valido');
  }
  const api = Object.freeze({C, G0, YEAR, SOLAR_FLUX, stellar, rotation, relativity, energy, lightCurve});
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.PhmPhysics = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
