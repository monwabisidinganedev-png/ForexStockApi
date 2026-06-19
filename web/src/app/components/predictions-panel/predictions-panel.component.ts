import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { PredictionResultDto, ProviderDto } from '../../models';

@Component({
  selector: 'app-predictions-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="predictions-panel">
      <h2>Predictions</h2>

      <div class="form-section">
        <h3>Query Predictions</h3>
        <div class="form-group">
          <label>Symbol:</label>
          <input [(ngModel)]="searchSymbol" placeholder="e.g., EURUSD" />
          <button (click)="getPredictions()" class="btn btn-primary">Search</button>
        </div>
      </div>

      <div class="form-section">
        <h3>Run New Prediction</h3>
        <div class="form-group">
          <label>Symbol:</label>
          <input [(ngModel)]="predictionSymbol" placeholder="e.g., EURUSD" />
        </div>
        <div class="form-group">
          <label>Provider:</label>
          <select [(ngModel)]="selectedProvider">
            <option value="">-- Select Provider --</option>
            <option *ngFor="let p of providers" [value]="p.name">{{ p.name }}</option>
          </select>
        </div>
        <button (click)="runPrediction()" class="btn btn-success">Run Prediction</button>
      </div>

      <div *ngIf="loading" class="loading">Processing...</div>

      <div *ngIf="!loading && predictions.length > 0" class="results">
        <h3>Predictions</h3>
        <table class="data-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Label</th>
              <th>Score</th>
              <th>Provider</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let pred of predictions" [ngClass]="'label-' + pred.label.toLowerCase()">
              <td>{{ pred.symbol }}</td>
              <td><span class="label-badge">{{ pred.label }}</span></td>
              <td>{{ pred.score | number: '1.2-4' }}</td>
              <td>{{ pred.provider }}</td>
              <td>{{ pred.timestamp | date: 'short' }}</td>
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
      .predictions-panel {
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

      .form-group input,
      .form-group select {
        padding: 6px 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 14px;
        flex: 1;
      }

      .form-group input:focus,
      .form-group select:focus {
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

      .label-badge {
        padding: 4px 8px;
        border-radius: 3px;
        font-weight: bold;
        font-size: 12px;
      }

      tbody tr.label-buy {
        background-color: #e8f5e9;
      }

      tbody tr.label-buy .label-badge {
        background-color: #4caf50;
        color: white;
      }

      tbody tr.label-sell {
        background-color: #ffebee;
      }

      tbody tr.label-sell .label-badge {
        background-color: #f44336;
        color: white;
      }

      tbody tr.label-hold {
        background-color: #fff3e0;
      }

      tbody tr.label-hold .label-badge {
        background-color: #ff9800;
        color: white;
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
export class PredictionsPanelComponent implements OnInit {
  searchSymbol = '';
  predictionSymbol = '';
  selectedProvider = '';
  predictions: PredictionResultDto[] = [];
  providers: ProviderDto[] = [];
  loading = false;
  error = '';
  successMessage = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadProviders();
  }

  loadProviders(): void {
    this.apiService.getProviders().subscribe({
      next: (data) => {
        this.providers = data;
      },
      error: (err) => {
        console.error('Failed to load providers:', err);
      },
    });
  }

  getPredictions(): void {
    if (!this.searchSymbol.trim()) {
      this.error = 'Please enter a symbol';
      return;
    }
    this.loading = true;
    this.error = '';
    this.successMessage = '';
    this.apiService.getPredictions(this.searchSymbol).subscribe({
      next: (data) => {
        this.predictions = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load predictions: ' + err.message;
        this.loading = false;
      },
    });
  }

  runPrediction(): void {
    if (!this.predictionSymbol.trim() || !this.selectedProvider.trim()) {
      this.error = 'Please select both symbol and provider';
      return;
    }
    this.loading = true;
    this.error = '';
    this.successMessage = '';
    this.apiService.runPrediction(this.predictionSymbol, this.selectedProvider).subscribe({
      next: (data) => {
        this.successMessage = `Prediction completed: ${data.label} (Score: ${data.score})`;
        this.predictions.unshift(data);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to run prediction: ' + err.message;
        this.loading = false;
      },
    });
  }
}
