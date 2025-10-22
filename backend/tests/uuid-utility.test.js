/**
 * UUID Utility Tests
 * Tests for the CommonJS-compatible UUID wrapper
 */

const { uuidv4, v4, v4Sync } = require('../src/utils/uuid');

describe('UUID Utility', () => {
    test('v4Sync should generate valid UUID v4', () => {
        const uuid = v4Sync();
        expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    test('uuidv4 should generate valid UUID v4 (backward compatibility)', () => {
        const uuid = uuidv4();
        expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    test('v4 async should generate valid UUID v4', async () => {
        const uuid = await v4();
        expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    test('generated UUIDs should be unique', () => {
        const uuid1 = v4Sync();
        const uuid2 = v4Sync();
        expect(uuid1).not.toBe(uuid2);
    });

    test('generated UUIDs should be strings', () => {
        const uuid = v4Sync();
        expect(typeof uuid).toBe('string');
        expect(uuid).toHaveLength(36); // Standard UUID length with dashes
    });
});