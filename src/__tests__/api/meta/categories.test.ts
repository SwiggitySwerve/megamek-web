/**
 * Tests for /api/meta/categories endpoint
 */
import { createMocks } from 'node-mocks-http';
import type { NextApiRequest, NextApiResponse } from 'next';
import handler from '@/pages/api/meta/categories';

describe('/api/meta/categories', () => {
  describe('GET method validation', () => {
    it('should reject non-GET requests', async () => {
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'POST',
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(405);
      const data = JSON.parse(res._getData());
      expect(data.message).toBe('Method not allowed');
    });

    it('should reject PUT requests', async () => {
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'PUT',
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(405);
    });
  });

  describe('GET unit categories', () => {
    it('should return an array of categories', async () => {
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'GET',
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
      const data = JSON.parse(res._getData());
      expect(Array.isArray(data)).toBe(true);
    });

    it('should include meks category', async () => {
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'GET',
      });

      await handler(req, res);

      const data = JSON.parse(res._getData());
      expect(data).toContain('meks');
    });

    it('should include vehicles category', async () => {
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'GET',
      });

      await handler(req, res);

      const data = JSON.parse(res._getData());
      expect(data).toContain('vehicles');
    });

    it('should include infantry category', async () => {
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'GET',
      });

      await handler(req, res);

      const data = JSON.parse(res._getData());
      expect(data).toContain('infantry');
    });

    it('should include battlearmor category', async () => {
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'GET',
      });

      await handler(req, res);

      const data = JSON.parse(res._getData());
      expect(data).toContain('battlearmor');
    });

    it('should include aerospace categories', async () => {
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'GET',
      });

      await handler(req, res);

      const data = JSON.parse(res._getData());
      expect(data).toContain('fighters');
      expect(data).toContain('dropships');
      expect(data).toContain('warship');
      expect(data).toContain('jumpships');
    });

    it('should include all expected categories', async () => {
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'GET',
      });

      await handler(req, res);

      const data = JSON.parse(res._getData());
      const expectedCategories = [
        'meks',
        'vehicles',
        'infantry',
        'battlearmor',
        'ge',
        'fighters',
        'dropships',
        'warship',
        'protomeks',
        'convfighter',
        'smallcraft',
        'spacestation',
        'jumpships',
        'handheld',
      ];

      expect(data).toEqual(expect.arrayContaining(expectedCategories));
      expect(data.length).toBe(expectedCategories.length);
    });
  });
});

