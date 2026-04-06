import { describe, it, expect } from 'vitest';
import { normalize } from './text';

describe('normalize', () => {
  it('strips accents from Spanish characters', () => {
    expect(normalize('Colegio Público')).toBe('colegio publico');
  });

  it('handles tildes (ñ → n)', () => {
    expect(normalize('Niño')).toBe('nino');
  });

  it('lowercases mixed case', () => {
    expect(normalize('COLEGIO San Patricio')).toBe('colegio san patricio');
  });

  it('returns empty string for empty input', () => {
    expect(normalize('')).toBe('');
  });

  it('passes through strings with no accents unchanged', () => {
    expect(normalize('colegio san jose')).toBe('colegio san jose');
  });

  it('handles multiple accent types (á é í ó ú ü)', () => {
    expect(normalize('Ángel José María Ürsula')).toBe('angel jose maria ursula');
  });

  it('handles real school names from Chilean data', () => {
    expect(normalize('Liceo Bicentenario de Excelencia')).toBe('liceo bicentenario de excelencia');
    expect(normalize('Escuela Básica Nº 1')).toBe('escuela basica nº 1');
  });
});
