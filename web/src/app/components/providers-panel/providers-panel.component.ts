import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { ProviderDto } from '../../models';

@Component({
  selector: 'app-providers-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="providers-panel">
      <h2>Available Providers</h2>
      <button (click)="loadProviders()" class="btn btn-primary">Refresh Providers</button>

      <div *ngIf="loading" class="loading">Loading providers...</div>

      <div *ngIf="!loading && providers.length > 0" class="providers-grid">
        <div *ngFor="let provider of providers" class="provider-card">
          <div class="provider-name">{{ provider.name }}</div>
          <div class="provider-id">ID: {{ provider.id }}</div>
        </div>
      </div>

      <div *ngIf="!loading && providers.length === 0" class="empty-state">
        No providers available. Click Refresh to load.
      </div>

      <div *ngIf="error" class="error-message">{{ error }}</div>
    </div>
  `,
  styles: [
    `
      .providers-panel {
        padding: 10px;
      }

      h2 {
        margin: 0 0 15px 0;
        color: #333;
      }

      .providers-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 15px;
        margin-top: 20px;
      }

      .provider-card {
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 15px;
        background-color: #f9f9f9;
        transition: all 0.3s ease;
      }

      .provider-card:hover {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        transform: translateY(-2px);
      }

      .provider-name {
        font-weight: bold;
        font-size: 16px;
        color: #0066cc;
        margin-bottom: 8px;
      }

      .provider-id {
        font-size: 12px;
        color: #666;
      }

      .loading {
        text-align: center;
        padding: 30px;
        color: #666;
      }

      .empty-state {
        text-align: center;
        padding: 30px;
        color: #999;
        background-color: #f5f5f5;
        border-radius: 4px;
      }

      .error-message {
        color: #d32f2f;
        background-color: #ffebee;
        padding: 12px;
        border-radius: 4px;
        margin-top: 15px;
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
    `,
  ],
})
export class ProvidersComponent implements OnInit {
  providers: ProviderDto[] = [];
  loading = false;
  error = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadProviders();
  }

  loadProviders(): void {
    this.loading = true;
    this.error = '';
    this.apiService.getProviders().subscribe({
      next: (data) => {
        this.providers = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load providers: ' + err.message;
        this.loading = false;
      },
    });
  }
}
