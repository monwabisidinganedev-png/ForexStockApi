import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ProviderDto,
  PriceSeriesDto,
  PredictionResultDto,
  AdviceResultDto,
  ProviderStateDto,
  HealthStatusDto,
  MockStatusDto,
  DiagnosticsResultDto,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  // Providers
  getProviders(): Observable<ProviderDto[]> {
    return this.http.get<ProviderDto[]>(`${this.apiUrl}/providers`);
  }

  // Price Series
  getPriceSeries(symbol: string): Observable<PriceSeriesDto[]> {
    return this.http.get<PriceSeriesDto[]>(
      `${this.apiUrl}/priceseries/${symbol}`
    );
  }

  addPriceSeries(priceSeries: PriceSeriesDto): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/priceseries`, priceSeries);
  }

  // Predictions
  getPredictions(symbol: string): Observable<PredictionResultDto[]> {
    return this.http.get<PredictionResultDto[]>(
      `${this.apiUrl}/predictionresult/${symbol}`
    );
  }

  runPrediction(
    symbol: string,
    provider: string
  ): Observable<PredictionResultDto> {
    return this.http.post<PredictionResultDto>(
      `${this.apiUrl}/predictionresult?symbol=${symbol}&provider=${provider}`,
      {}
    );
  }

  // Advice
  getAdvice(symbol: string): Observable<AdviceResultDto[]> {
    return this.http.get<AdviceResultDto[]>(`${this.apiUrl}/advice/${symbol}`);
  }

  // Provider State
  getAllProviderStates(): Observable<ProviderStateDto[]> {
    return this.http.get<ProviderStateDto[]>(`${this.apiUrl}/providerstate`);
  }

  getProviderState(provider: string): Observable<ProviderStateDto> {
    return this.http.get<ProviderStateDto>(
      `${this.apiUrl}/providerstate/${provider}`
    );
  }

  updateProviderState(state: ProviderStateDto): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/providerstate`, state);
  }

  // Health
  getHealth(): Observable<HealthStatusDto> {
    return this.http.get<HealthStatusDto>(`${this.apiUrl}/health`);
  }

  // Mock
  toggleMock(enabled: boolean): Observable<MockStatusDto> {
    return this.http.post<MockStatusDto>(
      `${this.apiUrl}/mock/toggle?enabled=${enabled}`,
      {}
    );
  }

  // Diagnostics
  runDiagnostics(): Observable<DiagnosticsResultDto> {
    return this.http.get<DiagnosticsResultDto>(`${this.apiUrl}/diagnostics`);
  }
}
