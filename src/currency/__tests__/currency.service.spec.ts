import { Test, TestingModule } from '@nestjs/testing';
import { CurrencyService } from '../currency.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCurrencyDto } from '../dto/create-currency.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

describe('CurrencyService', () => {
  let service: CurrencyService;

  const mockPrisma = {
    currency: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  const mockCurrency = {
    id: 'uuid-123',
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    isActive: true,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CurrencyService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<CurrencyService>(CurrencyService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createCurrencyDto: CreateCurrencyDto = {
      code: 'USD',
      name: 'US Dollar',
      symbol: '$',
    };
    it('should create currency successfully', async () => {
      mockPrisma.currency.create.mockResolvedValue(mockCurrency);

      const result = await service.create(createCurrencyDto);

      expect(result).toEqual({
        id: 'uuid-123',
        code: 'USD',
        name: 'US Dollar',
        symbol: '$',
        isActive: true,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });

      expect(mockPrisma.currency.create).toHaveBeenCalledWith({
        data: {
          ...createCurrencyDto,
          code: 'USD',
        },
      });
    });
    it('should normalize currency code to uppercase', async () => {
      const lowerCaseDto: CreateCurrencyDto = {
        code: 'eur',
        name: 'Euro',
      };

      mockPrisma.currency.create.mockResolvedValue({
        code: 'EUR',
        name: 'Euro',
      });

      const result = await service.create(lowerCaseDto);

      expect(result.code).toBe('EUR');
      expect(mockPrisma.currency.create).toHaveBeenCalledWith({
        data: {
          ...lowerCaseDto,
          code: 'EUR',
        },
      });
    });
    it('should throw ConflictException when currency code already exists', async () => {
      const prismaError = new Prisma.PrismaClientKnownRequestError(
        'Unique constraint failed on the fields: (`code`)',
        {
          code: 'P2002',
          clientVersion: '6.19.0',
          meta: { target: ['code'] },
        },
      );
      mockPrisma.currency.create.mockRejectedValue(prismaError);

      await expect(service.create(createCurrencyDto)).rejects.toThrow(
        ConflictException,
      );

      await expect(service.create(createCurrencyDto)).rejects.toThrow(
        'Currency with code USD already exists',
      );
    });
    it('should rethrow unknown Prisma errors', async () => {
      const unknownError = new Error('Unknown Prisma error');
      mockPrisma.currency.create.mockRejectedValue(unknownError);

      await expect(service.create(createCurrencyDto)).rejects.toThrow(
        'Unknown Prisma error',
      );
    });
  });
  describe('findAll', () => {
    it('should return active currencies by default', async () => {
      const mockCurrencies = [
        { ...mockCurrency, id: '1', code: 'USD' },
        { ...mockCurrency, id: '2', code: 'EUR' },
      ];

      mockPrisma.currency.findMany.mockResolvedValue(mockCurrencies);

      const result = await service.findAll();

      expect(result).toHaveLength(2);
      expect(result[0].code).toBe('USD');
      expect(result[1].code).toBe('EUR');
      expect(mockPrisma.currency.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        orderBy: { code: 'asc' },
      });
    });

    it('should return all currencies when includeInactive is true', async () => {
      const mockCurrencies = [
        { ...mockCurrency, id: '1', code: 'USD', isActive: true },
        { ...mockCurrency, id: '2', code: 'OLD', isActive: false },
      ];

      mockPrisma.currency.findMany.mockResolvedValue(mockCurrencies);

      const result = await service.findAll(true);

      expect(result).toHaveLength(2);
      expect(mockPrisma.currency.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: { code: 'asc' },
      });
    });

    it('should return empty array when no currencies found', async () => {
      mockPrisma.currency.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return currency by ID', async () => {
      mockPrisma.currency.findUnique.mockResolvedValue(mockCurrency);

      const result = await service.findOne('uuid-123');

      expect(result).toEqual({
        id: 'uuid-123',
        code: 'USD',
        name: 'US Dollar',
        symbol: '$',
        isActive: true,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
      expect(mockPrisma.currency.findUnique).toHaveBeenCalledWith({
        where: { id: 'uuid-123' },
      });
    });

    it('should throw NotFoundException when currency not found', async () => {
      mockPrisma.currency.findUnique.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        'Currency with ID non-existent-id not found',
      );
    });
  });

  describe('findByCode', () => {
    it('should return currency by code', async () => {
      mockPrisma.currency.findUnique.mockResolvedValue(mockCurrency);

      const result = await service.findByCode('USD');

      expect(result.code).toBe('USD');
      expect(mockPrisma.currency.findUnique).toHaveBeenCalledWith({
        where: { code: 'USD' },
      });
    });

    it('should normalize code to uppercase when searching', async () => {
      mockPrisma.currency.findUnique.mockResolvedValue(mockCurrency);

      await service.findByCode('usd');

      expect(mockPrisma.currency.findUnique).toHaveBeenCalledWith({
        where: { code: 'USD' },
      });
    });

    it('should throw NotFoundException when currency code not found', async () => {
      mockPrisma.currency.findUnique.mockResolvedValue(null);

      await expect(service.findByCode('UNKNOWN')).rejects.toThrow(
        NotFoundException,
      );

      await expect(service.findByCode('UNKNOWN')).rejects.toThrow(
        'Currency with code UNKNOWN not found',
      );
    });
  });
});
