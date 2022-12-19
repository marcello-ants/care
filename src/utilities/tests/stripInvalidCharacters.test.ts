import stripInvalidCharacters from '../stripInvalidCharacters';

describe('stripInvalidCharacters', () => {
  it('should strip out Ὂ', () => {
    expect(stripInvalidCharacters('HellὊ')).toBe('Hell');
  });

  it('should strip out ÿ', () => {
    expect(stripInvalidCharacters('ÿes')).toBe('es');
  });
  it('should strip out ὠÿ', () => {
    expect(stripInvalidCharacters('ὠhatÿ')).toBe('hat');
  });

  it('should strip out Ὣ♂', () => {
    expect(stripInvalidCharacters('Ὣ6♂')).toBe('6');
  });

  it('should strip out <>', () => {
    expect(stripInvalidCharacters('<home>')).toBe('home');
  });

  it('should not strip out anything', () => {
    expect(stripInvalidCharacters('hello5$!123^&()-_{}[]')).toBe('hello5$!123^&()-_{}[]');
  });
});
