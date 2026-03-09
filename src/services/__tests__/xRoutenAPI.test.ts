import { describe, it, expect } from 'vitest';
import { getDestinationId } from '../xRoutenAPI';

describe('getDestinationId', () => {
  it('returns the destination id from the URL search string', () => {
    expect(getDestinationId('?destination=abc123')).toBe('abc123');
  });

  it('returns null when destination param is missing', () => {
    expect(getDestinationId('')).toBeNull();
    expect(getDestinationId('?other=value')).toBeNull();
  });

  it('returns empty string when destination param is present but empty', () => {
    expect(getDestinationId('?destination=')).toBe('');
  });

  it('handles multiple params correctly', () => {
    expect(getDestinationId('?foo=bar&destination=xyz&baz=1')).toBe('xyz');
  });
});
