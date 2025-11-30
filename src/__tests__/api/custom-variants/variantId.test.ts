/**
 * Tests for /api/custom-variants/[variantId] endpoint
 */
import { createMocks } from 'node-mocks-http';
import type { NextApiRequest, NextApiResponse } from 'next';
import handler from '@/pages/api/custom-variants/[variantId]';

describe('/api/custom-variants/[variantId]', () => {
  describe('Parameter validation', () => {
    it('should reject requests without variantId', async () => {
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'GET',
        query: {},
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(false);
      expect(data.error).toBe('Invalid variant ID');
    });

    it('should reject array variantId', async () => {
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'GET',
        query: { variantId: ['id1', 'id2'] },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(false);
      expect(data.error).toBe('Invalid variant ID');
    });
  });

  describe('GET method validation', () => {
    it('should reject non-GET requests (POST)', async () => {
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'POST',
        query: { variantId: 'test-variant-123' },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(405);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(false);
      expect(data.error).toContain('Method not allowed');
    });

    it('should reject PUT requests', async () => {
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'PUT',
        query: { variantId: 'test-variant-123' },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(405);
    });

    it('should reject DELETE requests', async () => {
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'DELETE',
        query: { variantId: 'test-variant-123' },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(405);
    });
  });

  describe('GET variant info', () => {
    it('should return variant information', async () => {
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'GET',
        query: { variantId: 'atlas-custom-1' },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(true);
      expect(data.message).toContain('atlas-custom-1');
      expect(data.message).toContain('IndexedDB');
    });

    it('should include variantId in response data', async () => {
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'GET',
        query: { variantId: 'my-custom-mech' },
      });

      await handler(req, res);

      const data = JSON.parse(res._getData());
      expect(data.data).toBeDefined();
      expect(data.data.variantId).toBe('my-custom-mech');
    });

    it('should return correct storage type', async () => {
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'GET',
        query: { variantId: 'test-variant' },
      });

      await handler(req, res);

      const data = JSON.parse(res._getData());
      expect(data.data.storageType).toBe('IndexedDB');
    });

    it('should return service reference', async () => {
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'GET',
        query: { variantId: 'test-variant' },
      });

      await handler(req, res);

      const data = JSON.parse(res._getData());
      expect(data.data.service).toBe('@/services/units/CustomUnitService');
    });

    it('should return correct usage examples with variantId', async () => {
      const variantId = 'marauder-custom';
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'GET',
        query: { variantId },
      });

      await handler(req, res);

      const data = JSON.parse(res._getData());
      expect(data.data.usage).toBeDefined();
      expect(data.data.usage.get).toBe(`customUnitService.getById('${variantId}')`);
      expect(data.data.usage.update).toBe(`customUnitService.update('${variantId}', updatedData)`);
      expect(data.data.usage.delete).toBe(`customUnitService.delete('${variantId}')`);
      expect(data.data.usage.exists).toBe(`customUnitService.exists('${variantId}')`);
    });

    it('should handle special characters in variantId', async () => {
      const variantId = 'test-variant_123';
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'GET',
        query: { variantId },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
      const data = JSON.parse(res._getData());
      expect(data.data.variantId).toBe(variantId);
    });
  });
});

