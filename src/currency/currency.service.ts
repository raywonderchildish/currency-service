import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { CurrencyResponseDto } from './dto/currency-response.dto';

@Injectable()
export class CurrencyService {
  constructor(private readonly prisma: PrismaService) {}
  async create(
    createCurrencyDto: CreateCurrencyDto,
  ): Promise<CurrencyResponseDto> {
    try {
      const currency = await this.prisma.currency.create({
        data: {
          ...createCurrencyDto,
          code: createCurrencyDto.code.toUpperCase(),
        },
      });

      return this.mapToResponseDto(currency);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            `Currency with code ${createCurrencyDto.code} already exists`,
          );
        }
      }
      throw error;
    }
  }

  async findAll(
    includeInactive: boolean = false,
  ): Promise<CurrencyResponseDto[]> {
    const where = includeInactive ? {} : { isActive: true };

    const currencies = await this.prisma.currency.findMany({
      where,
      orderBy: { code: 'asc' },
    });
    return currencies.map((currency) => this.mapToResponseDto(currency));
  }

  async findOne(id: string): Promise<CurrencyResponseDto> {
    const currency = await this.prisma.currency.findUnique({
      where: { id },
    });

    if (!currency) {
      throw new NotFoundException(`Currency with ID ${id} not found`);
    }

    return this.mapToResponseDto(currency);
  }

  async findByCode(code: string): Promise<CurrencyResponseDto> {
    const currency = await this.prisma.currency.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!currency) {
      throw new NotFoundException(`Currency with code ${code} not found`);
    }

    return this.mapToResponseDto(currency);
  }

  private mapToResponseDto(currency: any): CurrencyResponseDto {
    return {
      id: currency.id,
      code: currency.code,
      name: currency.name,
      symbol: currency.symbol,
      isActive: currency.isActive,
      createdAt: currency.createdAt,
      updatedAt: currency.updatedAt,
    };
  }
}
