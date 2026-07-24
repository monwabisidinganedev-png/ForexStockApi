export interface ProviderDto {
  id: number;
  name: string;
}

export interface PriceSeriesDto {
  id: number;
  symbol: string;
  type: string;
  timestamp: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface PredictionResultDto {
  id: number;
  symbol: string;
  label: string;
  score: number;
  timestamp: Date;
  provider: string;
}

export interface AdviceResultDto {
  id: number;
  symbol: string;
  decision: string;
  reason: string;
  score: number;
  label: string;
  provider: string;
  timestamp: Date;
}

export interface ProviderStateDto {
  id: number;
  provider: string;
  lastChecked: Date;
  success: boolean;
  message: string;
  statusCode: number | null;
  rateLimitRemaining: number | null;
  rateLimitReset: Date | null;
  fallbackToMock: boolean;
}

export interface HealthStatusDto {
  apiHealthy: boolean;
  databaseHealthy: boolean;
}

export interface MockStatusDto {
  mockEnabled: boolean;
}

export interface DiagnosticsResultDto {
  [key: string]: string | boolean | ProviderStateDto;
}
