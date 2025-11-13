export class CurrencyResponseDto {
  id: string;
  code: string;
  name: string;
  symbol: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
