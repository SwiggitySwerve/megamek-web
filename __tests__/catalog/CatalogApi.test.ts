import handler from '../../pages/api/catalog'
import httpMocks from 'node-mocks-http'

describe('Catalog API', () => {
  test('GET /api/catalog returns results', async () => {
    const req = httpMocks.createRequest({ method: 'GET', url: '/api/catalog', query: { text: 'laser', techBase: 'Inner Sphere', unitType: 'BattleMech', page: '1', pageSize: '10' } })
    const res = httpMocks.createResponse()

    // @ts-expect-error - Mock request/response types don't exactly match Next.js API types but are compatible for testing
    await handler(req, res)

    expect(res.statusCode).toBe(200)
    const data = res._getJSONData()
    expect(Array.isArray(data.items)).toBe(true)
    expect(data.items.length).toBeGreaterThan(0)
  })
})