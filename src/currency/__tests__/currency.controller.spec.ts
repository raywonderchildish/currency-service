import { Test, TestingModule } from '@nestjs/testing';
import { CurrencyController } from '../currency.controller';
import { CurrencyService } from '../currency.service';
import { CreateCurrencyDto } from '../dto/create-currency.dto';

describe('CurrencyController', () => {
  let controller: CurrencyController;

  const mockCurrencyService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByCode: jest.fn(),
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
      controllers: [CurrencyController],
      providers: [{ provide: CurrencyService, useValue: mockCurrencyService }],
    }).compile();

    controller = module.get<CurrencyController>(CurrencyController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a currency', async () => {
      const createDto: CreateCurrencyDto = {
        code: 'USD',
        name: 'US Dollar',
        symbol: '$',
      };

      mockCurrencyService.create.mockResolvedValue(mockCurrency);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockCurrency);
      expect(mockCurrencyService.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return currencies without includeInactive param', async () => {
      const currencies = [mockCurrency];
      mockCurrencyService.findAll.mockResolvedValue(currencies);

      const result = await controller.findAll();

      expect(result).toEqual(currencies);
      expect(mockCurrencyService.findAll).toHaveBeenCalledWith(false);
    });

    it('should return currencies when includeInactive is undefined', async () => {
      const currencies = [mockCurrency];
      mockCurrencyService.findAll.mockResolvedValue(currencies);

      const result = await controller.findAll(undefined);

      expect(result).toEqual(currencies);
      expect(mockCurrencyService.findAll).toHaveBeenCalledWith(false);
    });

    it('should return currencies when includeInactive is false', async () => {
      const currencies = [mockCurrency];
      mockCurrencyService.findAll.mockResolvedValue(currencies);

      const result = await controller.findAll(false);

      expect(result).toEqual(currencies);
      expect(mockCurrencyService.findAll).toHaveBeenCalledWith(false);
    });

    it('should return currencies with includeInactive true', async () => {
      const currencies = [mockCurrency];
      mockCurrencyService.findAll.mockResolvedValue(currencies);

      const result = await controller.findAll(true);

      expect(result).toEqual(currencies);
      expect(mockCurrencyService.findAll).toHaveBeenCalledWith(true);
    });
  });

  describe('findOne', () => {
    it('should return currency by ID', async () => {
      mockCurrencyService.findOne.mockResolvedValue(mockCurrency);

      const result = await controller.findOne('uuid-123');

      expect(result).toEqual(mockCurrency);
      expect(mockCurrencyService.findOne).toHaveBeenCalledWith('uuid-123');
    });
  });

  describe('findByCode', () => {
    it('should return currency by code', async () => {
      mockCurrencyService.findByCode.mockResolvedValue(mockCurrency);

      const result = await controller.findByCode('USD');

      expect(result).toEqual(mockCurrency);
      expect(mockCurrencyService.findByCode).toHaveBeenCalledWith('USD');
    });
  });
});
