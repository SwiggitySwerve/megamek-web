/**
 * Calculation Engine Tests
 * 
 * Tests for the expression evaluation system
 */

import {
  CalculationEngine,
  createDefaultUnitContext,
  expr,
  cond,
  registerAllLookupTables
} from '../../../services/systemComponents/calculations/types'

describe('CalculationEngine', () => {
  let engine: CalculationEngine
  let context: ReturnType<typeof createDefaultUnitContext>

  beforeEach(() => {
    engine = new CalculationEngine()
    registerAllLookupTables(engine)
    context = createDefaultUnitContext()
  })

  describe('Basic Expressions', () => {
    test('evaluates constant expressions', () => {
      const result = engine.evaluate(expr.constant(42), context)
      expect(result).toBe(42)
    })

    test('evaluates field reference expressions', () => {
      context.tonnage = 50
      const result = engine.evaluate(expr.field('tonnage'), context)
      expect(result).toBe(50)
    })

    test('evaluates arithmetic expressions', () => {
      context.tonnage = 50
      const result = engine.evaluate(
        expr.multiply(expr.field('tonnage'), expr.constant(0.1)),
        context
      )
      expect(result).toBe(5)
    })
  })

  describe('Math Functions', () => {
    test('ceil function rounds up', () => {
      const result = engine.evaluate(
        expr.ceil(expr.constant(3.2)),
        context
      )
      expect(result).toBe(4)
    })

    test('floor function rounds down', () => {
      const result = engine.evaluate(
        expr.floor(expr.constant(3.8)),
        context
      )
      expect(result).toBe(3)
    })

    test('round function rounds to nearest', () => {
      expect(engine.evaluate(expr.round(expr.constant(3.4)), context)).toBe(3)
      expect(engine.evaluate(expr.round(expr.constant(3.6)), context)).toBe(4)
    })
  })

  describe('Conditional Expressions', () => {
    test('evaluates simple conditional', () => {
      context.tonnage = 50
      const result = engine.evaluate(
        expr.conditional(
          cond.lessThan(expr.field('tonnage'), expr.constant(55)),
          expr.constant(0.5),
          expr.constant(1.0)
        ),
        context
      )
      expect(result).toBe(0.5)
    })

    test('evaluates nested conditionals', () => {
      context.tonnage = 60
      const result = engine.evaluate(
        expr.conditional(
          cond.lessThanOrEqual(expr.field('tonnage'), expr.constant(55)),
          expr.constant(0.5),
          expr.conditional(
            cond.lessThanOrEqual(expr.field('tonnage'), expr.constant(85)),
            expr.constant(1.0),
            expr.constant(2.0)
          )
        ),
        context
      )
      expect(result).toBe(1.0)
    })
  })

  describe('Lookup Tables', () => {
    test('looks up values from registered tables', () => {
      // Register a simple test table
      engine.registerTable('TEST_TABLE', {
        'Standard': 1.0,
        'XL (IS)': 0.5,
        'XL (Clan)': 0.5
      })

      context.engineType = 'XL (IS)'
      // Note: This will hash the string, so we'll use a direct lookup for testing
      const table = engine.getTable('TEST_TABLE')
      expect(table).toBeDefined()
      expect(table!['XL (IS)']).toBe(0.5)
    })
  })

  describe('Real-World Calculations', () => {
    test('calculates standard engine weight', () => {
      context.engineRating = 200
      context.tonnage = 50
      context.engineType = 'Standard'

      // Engine weight = (rating * tonnage / 1000) * multiplier
      // = (200 * 50 / 1000) * 1.0 = 10
      const result = engine.evaluate(
        expr.multiply(
          expr.divide(
            expr.multiply(
              expr.field('engineRating'),
              expr.field('tonnage')
            ),
            expr.constant(1000)
          ),
          expr.constant(1.0) // Standard multiplier
        ),
        context
      )
      expect(result).toBe(10)
    })

    test('calculates gyro weight', () => {
      context.engineRating = 200
      // Gyro weight = ceil(engineRating / 100) * multiplier
      // = ceil(200 / 100) * 1.0 = 2

      const result = engine.evaluate(
        expr.multiply(
          expr.ceil(
            expr.divide(
              expr.field('engineRating'),
              expr.constant(100)
            )
          ),
          expr.constant(1.0) // Standard multiplier
        ),
        context
      )
      expect(result).toBe(2)
    })

    test('calculates structure weight', () => {
      context.tonnage = 50
      // Structure weight = tonnage * 0.1 * multiplier
      // = 50 * 0.1 * 1.0 = 5

      const result = engine.evaluate(
        expr.multiply(
          expr.multiply(
            expr.field('tonnage'),
            expr.constant(0.1)
          ),
          expr.constant(1.0) // Standard multiplier
        ),
        context
      )
      expect(result).toBe(5)
    })

    test('calculates jump jet weight based on tonnage', () => {
      context.tonnage = 45
      // Jump jet weight for tonnage <= 55 is 0.5

      const result = engine.evaluate(
        expr.conditional(
          cond.lessThanOrEqual(expr.field('tonnage'), expr.constant(55)),
          expr.constant(0.5),
          expr.conditional(
            cond.lessThanOrEqual(expr.field('tonnage'), expr.constant(85)),
            expr.constant(1.0),
            expr.constant(2.0)
          )
        ),
        context
      )
      expect(result).toBe(0.5)
    })
  })

  describe('Error Handling', () => {
    test('throws error for division by zero', () => {
      expect(() => {
        engine.evaluate(
          expr.divide(expr.constant(10), expr.constant(0)),
          context
        )
      }).toThrow('Division by zero')
    })

    test('throws error for unknown lookup table', () => {
      expect(() => {
        engine.evaluate(
          expr.lookup('NONEXISTENT_TABLE', expr.constant(0)),
          context
        )
      }).toThrow('Lookup table not found')
    })
  })
})

