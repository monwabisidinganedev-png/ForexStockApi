import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { PriceSeriesDto } from '../../models';

@Component({
  selector: 'app-price-series-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './price-series-panel.component.html',
  styleUrls: ['./price-series-panel.component.css'],
})
export class PriceSeriesPanelComponent {
  searchSymbol = '';
  priceSeries: PriceSeriesDto[] = [];
  loading = false;
  error = '';
  successMessage = '';
  newPriceSeries: Partial<PriceSeriesDto> = {
    symbol: '',
    type: '',
    open: 0,
    high: 0,
    low: 0,
    close: 0,
    volume: 0,
    timestamp: new Date(),
  };

  constructor(private apiService: ApiService) {}

  getPriceSeries(): void {
    if (!this.searchSymbol.trim()) {
      this.error = 'Please enter a symbol';
      return;
    }
    this.loading = true;
    this.error = '';
    this.successMessage = '';
    this.apiService.getPriceSeries(this.searchSymbol).subscribe({
      next: (data) => {
        this.priceSeries = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load price series: ' + err.message;
        this.loading = false;
      },
    });
  }

  addPriceSeries(): void {
    if (!this.newPriceSeries.symbol?.trim()) {
      this.error = 'Please enter a symbol';
      return;
    }
    this.loading = true;
    this.error = '';
    this.successMessage = '';
    this.apiService.addPriceSeries(this.newPriceSeries as PriceSeriesDto).subscribe({
      next: () => {
        this.successMessage = 'Price series added successfully!';
        this.newPriceSeries = {
          symbol: '',
          type: '',
          open: 0,
          high: 0,
          low: 0,
          close: 0,
          volume: 0,
          timestamp: new Date(),
        };
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to add price series: ' + err.message;
        this.loading = false;
      },
    });
  }
}
