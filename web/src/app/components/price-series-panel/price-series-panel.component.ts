import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { PriceSeriesDto } from '../../models';

@Component({
  selector: 'app-price-series-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="price-series-panel">
      <h2>Price Series Management</h2>
      
      <div class="form-section">
        <h3>Query Price Series</h3>
        <div class="form-group">
          <label>Symbol:</label>
          <input [(ngModel)]="searchSymbol" placeholder="e.g., EURUSD" />
          <button (click)="getPriceSeries()" class="btn btn-primary">Search</button>
        </div>
      </div>

      <div class="form-section">
        <h3>Add New Price Series</h3>
        <div class="form-group">
          <label>Symbol:</label>
          <input [(ngModel)]="newPriceSeries.symbol" placeholder="e.g., EURUSD" />
        </div>
        <div class="form-group">
          <label>Type:</label>
          <input [(ngModel)]="newPriceSeries.type" placeholder="e.g., daily" />
        </div>
        <div class="form-group">
          <label>Open:</label>
          <input [(ngModel)]="newPriceSeries.open" type="number" step="0.01" />
        </div>
        <div class="form-group">
          <label>High:</label>
          <input [(ngModel)]="newPriceSeries.high" type="number" step="0.01" />
        </div>
        <div class="form-group">
          <label>Low:</label>
          <input [(ngModel)]="newPriceSeries.low" type="number" step="0.01" />
        </div>
        <div class="form-group">
          <label>Close:</label>
          <input [(ngModel)]="newPriceSeries.close" type="number" step="0.01" />
        </div>
        <div class="form-group">
          <label>Volume:</label>
          <input [(ngModel)]="newPriceSeries.volume" type="number" />
        </div>
        <button (click)="addPriceSeries()" class="btn btn-success">Add Price Series</button>
      </div>

      <div *ngIf="loading" class="loading">Loading...</div>

      <div *ngIf="!loading && priceSeries.length > 0" class="results">
        <h3>Results</h3>
        <table class="data-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Type</th>
              <th>Timestamp</th>
              <th>Open</th>
              <th>High</th>
              <th>Low</th>
              <th>Close</th>
              <th>Volume</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let ps of priceSeries">
              <td>{{ ps.symbol }}</td>
              <td>{{ ps.type }}</td>
              <td>{{ ps.timestamp | date: 'short' }}</td>
              <td>{{ ps.open | number: '1.2-5' }}</td>
              <td>{{ ps.high | number: '1.2-5' }}</td>
              <td>{{ ps.low | number: '1.2-5' }}</td>
              <td>{{ ps.close | number: '1.2-5' }}</td>
              <td>{{ ps.volume | number: '1.0-0' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div *ngIf="error" class="error-message">{{ error }}</div>
      <div *ngIf="successMessage" class="success-message">{{ successMessage }}</div>
    </div>
  `,
  styles: [
    `
      .price-series-panel {
        padding: 10px;
      }

      h2 {
        margin: 0 0 20px 0;
        color: #333;
      }

      h3 {
        margin: 15px 0 10px 0;
        color: #555;
        font-size: 16px;
      }

      .form-section {
        background-color: #f9f9f9;
        padding: 15px;
        border-radius: 4px;
        margin-bottom: 20px;
        border: 1px solid #e0e0e0;
      }

      .form-group {
        display: flex;
        gap: 10px;
        margin-bottom: 10px;
        align-items: center;
      }

      .form-group label {
        min-width: 80px;
        font-weight: 500;
        color: #666;
      }

      .form-group input {
        padding: 6px 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 14px;
        flex: 1;
      }

      .form-group input:focus {
        outline: none;
        border-color: #0066cc;
        box-shadow: 0 0 4px rgba(0, 102, 204, 0.3);
      }

      .data-table {
        width: 100%;
        border-collapse: collapse;
        background-color: white;
        border: 1px solid #ddd;
      }

      .data-table thead {
        background-color: #f5f5f5;
      }

      .data-table th {
        padding: 12px;
        text-align: left;
        border-bottom: 2px solid #ddd;
        font-weight: 600;
        color: #333;
      }

      .data-table td {
        padding: 10px 12px;
        border-bottom: 1px solid #e0e0e0;
      }

      .data-table tbody tr:hover {
        background-color: #f9f9f9;
      }

      .btn {
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
      }

      .btn-primary {
        background-color: #0066cc;
        color: white;
      }

      .btn-primary:hover {
        background-color: #0052a3;
      }

      .btn-success {
        background-color: #28a745;
        color: white;
      }

      .btn-success:hover {
        background-color: #218838;
      }

      .loading,
      .error-message,
      .success-message {
        padding: 12px;
        border-radius: 4px;
        margin-top: 15px;
      }

      .loading {
        background-color: #e3f2fd;
        color: #1976d2;
      }

      .error-message {
        background-color: #ffebee;
        color: #d32f2f;
      }

      .success-message {
        background-color: #e8f5e9;
        color: #388e3c;
      }
    `,
  ],
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
