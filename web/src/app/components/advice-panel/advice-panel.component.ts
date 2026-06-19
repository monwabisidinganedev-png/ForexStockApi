import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AdviceResultDto } from '../../models';

@Component({
  selector: 'app-advice-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="advice-panel">
      <h2>Trading Advice</h2>

      <div class="form-section">
        <h3>Get Advice</h3>
        <div class="form-group">
          <label>Symbol:</label>
          <input [(ngModel)]="searchSymbol" placeholder="e.g., EURUSD" />
          <button (click)="getAdvice()" class="btn btn-primary">Get Advice</button>
        </div>
      </div>

      <div *ngIf="loading" class="loading">Loading advice...</div>

      <div *ngIf="!loading && advice.length > 0" class="results">
        <h3>Advice Results</h3>
        <div class="advice-cards">
          <div *ngFor="let adv of advice" class="advice-card" [ngClass]="'decision-' + adv.decision.toLowerCase()">
            <div class="advice-header">
              <span class="decision-badge">{{ adv.decision.toUpperCase() }}</span>
              <span class="symbol">{{ adv.symbol }}</span>
            </div>
            <div class="advice-content">
              <p><strong>Reason:</strong> {{ adv.reason }}</p>
              <p><strong>Label:</strong> {{ adv.label }}</p>
              <p><strong>Score:</strong> {{ adv.score | number: '1.2-4' }}</p>
              <p><strong>Provider:</strong> {{ adv.provider }}</p>
              <p><strong>Timestamp:</strong> {{ adv.timestamp | date: 'medium' }}</p>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="!loading && advice.length === 0 && !error" class="empty-state">
        No advice available. Search for a symbol to get advice.
      </div>

      <div *ngIf="error" class="error-message">{{ error }}</div>
    </div>
  `,
  styles: [
    `
      .advice-panel {
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

      .advice-cards {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 15px;
        margin-top: 20px;
      }

      .advice-card {
        border-radius: 8px;
        padding: 15px;
        border-left: 4px solid;
        background-color: white;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .advice-card.decision-buy {
        border-left-color: #4caf50;
        background-color: #f1f8f6;
      }

      .advice-card.decision-sell {
        border-left-color: #f44336;
        background-color: #fdf1f0;
      }

      .advice-card.decision-hold {
        border-left-color: #ff9800;
        background-color: #fef8f4;
      }

      .advice-card.decision-ignore {
        border-left-color: #9e9e9e;
        background-color: #fafafa;
      }

      .advice-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        padding-bottom: 10px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      }

      .decision-badge {
        font-weight: bold;
        font-size: 14px;
        padding: 4px 8px;
        border-radius: 4px;
        color: white;
      }

      .advice-card.decision-buy .decision-badge {
        background-color: #4caf50;
      }

      .advice-card.decision-sell .decision-badge {
        background-color: #f44336;
      }

      .advice-card.decision-hold .decision-badge {
        background-color: #ff9800;
      }

      .advice-card.decision-ignore .decision-badge {
        background-color: #9e9e9e;
      }

      .symbol {
        font-weight: bold;
        font-size: 16px;
        color: #333;
      }

      .advice-content p {
        margin: 8px 0;
        font-size: 14px;
        color: #555;
      }

      .advice-content strong {
        color: #333;
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

      .loading,
      .error-message {
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

      .empty-state {
        text-align: center;
        padding: 30px;
        color: #999;
        background-color: #f5f5f5;
        border-radius: 4px;
      }
    `,
  ],
})
export class AdvicePanelComponent {
  searchSymbol = '';
  advice: AdviceResultDto[] = [];
  loading = false;
  error = '';

  constructor(private apiService: ApiService) {}

  getAdvice(): void {
    if (!this.searchSymbol.trim()) {
      this.error = 'Please enter a symbol';
      return;
    }
    this.loading = true;
    this.error = '';
    this.apiService.getAdvice(this.searchSymbol).subscribe({
      next: (data) => {
        this.advice = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load advice: ' + err.message;
        this.loading = false;
      },
    });
  }
}
