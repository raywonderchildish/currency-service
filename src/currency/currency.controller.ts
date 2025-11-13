import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { CurrencyResponseDto } from './dto/currency-response.dto';

@Controller('currencies')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createCurrencyDto: CreateCurrencyDto,
  ): Promise<CurrencyResponseDto> {
    return this.currencyService.create(createCurrencyDto);
  }

  @Get()
  async findAll(
    @Query('includeInactive') includeInactive?: boolean,
  ): Promise<CurrencyResponseDto[]> {
    return this.currencyService.findAll(includeInactive === true);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<CurrencyResponseDto> {
    return this.currencyService.findOne(id);
  }

  @Get('code/:code')
  async findByCode(@Param('code') code: string): Promise<CurrencyResponseDto> {
    return this.currencyService.findByCode(code);
  }
}
