/**
 * Tests for /api/custom-variants endpoint
 */
import { createMocks } from 'node-mocks-http';
import type { NextApiRequest, NextApiResponse } from 'next';
import handler from '@/pages/api/custom-variants';

describe('/api/custom-variants', () => {
  describe('GET method validation', () => {
    it('should reject non-GET requests (POST)', async () => {
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'POST',
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(405);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(false);
      expect(data.error).toContain('Method not allowed');
      expect(data.error).toContain('CustomUnitService');
    });

    it('should reject PUT requests', async () => {
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'PUT',
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(405);
    });

    it('should reject DELETE requests', async () => {
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'DELETE',
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(405);
    });
  });

  describe('GET storage info', () => {
    it('should return storage information', async () => {
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'GET',
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(true);
      expect(data.message).toContain('IndexedDB');
    });

    it('should return correct storage type', async () => {
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'GET',
      });

      await handler(req, res);

      const data = JSON.parse(res._getData());
      expect(data.data).toBeDefined();
      expect(data.data.storageType).toBe('IndexedDB');
    });

    it('should return storage location', async () => {
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'GET',
      });

      await handler(req, res);

      const data = JSON.parse(res._getData());
      expect(data.data.location).toBe('Browser local storage');
    });

    it('should return service reference', async () => {
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'GET',
      });

      await handler(req, res);

      const data = JSON.parse(res._getData());
      expect(data.data.service).toBe('@/services/units/CustomUnitService');
    });

    it('should return usage examples', async () => {
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'GET',
      });

      await handler(req, res);

      const data = JSON.parse(res._getData());
      expect(data.data.usage).toBeDefined();
      expect(data.data.usage.list).toBe('customUnitService.list()');
      expect(data.data.usage.create).toBe('customUnitService.create(unit)');
      expect(data.data.usage.update).toBe('customUnitService.update(id, unit)');
      expect(data.data.usage.delete).toBe('customUnitService.delete(id)');
      expect(data.data.usage.getById).toBe('customUnitService.getById(id)');
    });
  });
});

