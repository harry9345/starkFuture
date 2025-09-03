import { describe, it, expect } from 'vitest'

import { getNthPlate } from '../src/getNthPlate'

describe('getNthPlate', () => {
  describe('Edge cases and validation', () => {
    it('should throw Error for negative numbers', () => {
      expect(() => getNthPlate(-1)).toThrow(
        '"n" must be a non-negative integer'
      )
    })

    it('should throw Error for non-integers', () => {
      expect(() => getNthPlate(3.14)).toThrow(
        '"n" must be a non-negative integer'
      )
    })

    it('should return empty string and set error for out of range numbers', () => {
      expect(() => getNthPlate(501363139)).toThrow('"n" is out of range')
    })
  })

  describe('All digits block (0-999999)', () => {
    it('should return 000000 for n=0', () => {
      const result = getNthPlate(0)
      expect(result).toBe('000000')
    })

    it('should return 000001 for n=1', () => {
      const result = getNthPlate(1)
      expect(result).toBe('000001')
    })

    it('should return 999999 for n=999999', () => {
      const result = getNthPlate(999999)
      expect(result).toBe('999999')
    })

    it('should return 123456 for n=123456', () => {
      const result = getNthPlate(123456)
      expect(result).toBe('123456')
    })
  })

  describe('5 digits + 1 letter block (1000000-3599999)', () => {
    it('should return 00000A for n=1000000', () => {
      const result = getNthPlate(1000000)
      expect(result).toBe('00000A')
    })

    it('should return 00000B for n=1000001', () => {
      const result = getNthPlate(1000001)
      expect(result).toBe('00000B')
    })

    it('should return 00001A for n=1000026', () => {
      const result = getNthPlate(1000026)
      expect(result).toBe('00001A')
    })

    it('should return 99999A for n=3599974', () => {
      const result = getNthPlate(3599974)
      expect(result).toBe('99999A')
    })

    it('should return 00000B for n=1000001', () => {
      const result = getNthPlate(1000001)
      expect(result).toBe('00000B')
    })

    it('should return 00000Z for n=1000025', () => {
      const result = getNthPlate(1000025)
      expect(result).toBe('00000Z')
    })
  })

  describe('4 digits + 2 letters block (3600000-10359999)', () => {
    it('should return 0000AA for n=3600000', () => {
      const result = getNthPlate(3600000)
      expect(result).toBe('0000AA')
    })

    it('should return 0001AA for n=3600676', () => {
      const result = getNthPlate(3600676)
      expect(result).toBe('0001AA')
    })

    it('should return 9999AA for n=10359324', () => {
      const result = getNthPlate(10359324)
      expect(result).toBe('9999AA')
    })

    it('should return 0000AB for n=3600001', () => {
      const result = getNthPlate(3600001)
      expect(result).toBe('0000AB')
    })

    it('should return 0000AZ for n=3600025', () => {
      const result = getNthPlate(3600025)
      expect(result).toBe('0000AZ')
    })

    it('should return 0000BA for n=3600026', () => {
      const result = getNthPlate(3600026)
      expect(result).toBe('0000BA')
    })
  })

  describe('3 digits + 3 letters block (10360000-27935999)', () => {
    it('should return 000AAA for n=10360000', () => {
      const result = getNthPlate(10360000)
      expect(result).toBe('000AAA')
    })

    it('should return 001AAA for n=10377576', () => {
      const result = getNthPlate(10377576)
      expect(result).toBe('001AAA')
    })

    it('should return 999AAA for n=27918424', () => {
      const result = getNthPlate(27918424)
      expect(result).toBe('999AAA')
    })

    it('should return 000AAB for n=10360001', () => {
      const result = getNthPlate(10360001)
      expect(result).toBe('000AAB')
    })
  })

  describe('2 digits + 4 letters block (27936000-73633599)', () => {
    it('should return 00AAAA for n=27936000', () => {
      const result = getNthPlate(27936000)
      expect(result).toBe('00AAAA')
    })

    it('should return 01AAAA for n=28392976', () => {
      const result = getNthPlate(28392976)
      expect(result).toBe('01AAAA')
    })
  })

  describe('1 digit + 5 letters block (73633600-192447359)', () => {
    it('should return 0AAAAA for n=73633600', () => {
      const result = getNthPlate(73633600)
      expect(result).toBe('0AAAAA')
    })

    it('should return 1AAAAA for n=85514976', () => {
      const result = getNthPlate(85514976)
      expect(result).toBe('1AAAAA')
    })

    it('should return 9AAAAA for n=180565984', () => {
      const result = getNthPlate(180565984)
      expect(result).toBe('9AAAAA')
    })
  })

  describe('All letters block (192447360-501363135)', () => {
    it('should return AAAAAA for n=192447360', () => {
      const result = getNthPlate(192447360)
      expect(result).toBe('AAAAAA')
    })

    it('should return AAAAAB for n=192447361', () => {
      const result = getNthPlate(192447361)
      expect(result).toBe('AAAAAB')
    })

    it('should return ZZZZZZ for n=501363135', () => {
      const result = getNthPlate(501363135)
      expect(result).toBe('ZZZZZZ')
    })
  })

  describe('Performance and large numbers', () => {
    it('should handle large numbers efficiently', () => {
      const start = Date.now()
      const result = getNthPlate(500000000)
      const end = Date.now()

      expect(result).not.toBe('')
      expect(end - start).toBeLessThan(100)
    })
  })
})
