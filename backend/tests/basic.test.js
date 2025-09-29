// Simple test to verify basic setup
describe('Basic Setup', () => {
  test('should pass basic test', () => {
    expect(true).toBe(true);
  });

  test('should have test environment set', () => {
    expect(process.env.NODE_ENV).toBe('test');
  });
});