import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ProviderDto, HealthStatusDto, MockStatusDto } from '../../models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dashboard-container">
      <header class="dashboard-header">
        <h1>Forex Stock API Dashboard</h1>
        <div class="header-actions">
          <button (click)="loadHealth()" class="btn btn-primary">Check Health</button>
          <button (click)="toggleMockMode()" class="btn" [ngClass]="mockEnabled ? 'btn-danger' : 'btn-success'">
            Mock Mode: {{ mockEnabled ? 'ON' : 'OFF' }}
          </button>
        </div>
      </header>

      <div class="status-bar" *ngIf="health">
        <div class="status-item" [ngClass]="health.apiHealthy ? 'healthy' : 'unhealthy'">
          <span class="status-label">API:</span>
          <span class="status-value">{{ health.apiHealthy ? '✓ Healthy' : '✗ Unhealthy' }}</span>
        </div>
        <div class="status-item" [ngClass]="health.databaseHealthy ? 'healthy' : 'unhealthy'">
          <span class="status-label">Database:</span>
          <span class="status-value">{{ health.databaseHealthy ? '✓ Healthy' : '✗ Unhealthy' }}</span>
        </div>
      </div>

      <div class="tabs-container">
        <div class="tab-buttons">
          <button *ngFor="let tab of tabs" (click)="currentTab = tab" 
                  class="tab-btn" [class.active]="currentTab === tab">
            {{ tab }}
          </button>
        </div>

        <div class="tab-content">
          <!-- Providers Tab -->
          <div *ngIf="currentTab === 'Providers'" class="tab-pane">
            <app-providers-panel></app-providers-panel>
          </div>

          <!-- Price Series Tab -->
          <div *ngIf="currentTab === 'Price Series'" class="tab-pane">
            <app-price-series-panel></app-price-series-panel>
          </div>

          <!-- Predictions Tab -->
          <div *ngIf="currentTab === 'Predictions'" class="tab-pane">
            <app-predictions-panel></app-predictions-panel>
          </div>

          <!-- Advice Tab -->
          <div *ngIf="currentTab === 'Advice'" class="tab-pane">
            <app-advice-panel></app-advice-panel>
          </div>

          <!-- Provider State Tab -->
          <div *ngIf="currentTab === 'Provider State'" class="tab-pane">
            <app-provider-state-panel></app-provider-state-panel>
          </div>

          <!-- Diagnostics Tab -->
          <div *ngIf="currentTab === 'Diagnostics'" class="tab-pane">
            <app-diagnostics-panel></app-diagnostics-panel>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .dashboard-container {
        padding: 20px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      }

      .dashboard-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
        border-bottom: 2px solid #e0e0e0;
        padding-bottom: 15px;
      }

      .dashboard-header h1 {
        margin: 0;
        color: #333;
        font-size: 28px;
      }

      .header-actions {
        display: flex;
        gap: 10px;
      }

      .status-bar {
        display: flex;
        gap: 20px;
        margin-bottom: 20px;
      }

      .status-item {
        padding: 10px 15px;
        border-radius: 4px;
        display: flex;
        gap: 8px;
        align-items: center;
      }

      .status-item.healthy {
        background-color: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
      }

      .status-item.unhealthy {
        background-color: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
      }

      .tabs-container {
        border: 1px solid #ddd;
        border-radius: 4px;
        overflow: hidden;
      }

      .tab-buttons {
        display: flex;
        background-color: #f5f5f5;
        border-bottom: 2px solid #ddd;
        flex-wrap: wrap;
      }

      .tab-btn {
        flex: 1;
        padding: 12px 16px;
        border: none;
        background: none;
        cursor: pointer;
        color: #666;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.3s ease;
        min-width: 120px;
      }

      .tab-btn:hover {
        background-color: #e8e8e8;
      }

      .tab-btn.active {
        background-color: white;
        color: #0066cc;
        border-bottom: 3px solid #0066cc;
        margin-bottom: -2px;
      }

      .tab-content {
        padding: 20px;
        background-color: white;
        min-height: 400px;
      }

      .btn {
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.3s ease;
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

      .btn-danger {
        background-color: #dc3545;
        color: white;
      }

      .btn-danger:hover {
        background-color: #c82333;
      }
    `,
  ],
})
export class DashboardComponent implements OnInit {
  tabs = ['Providers', 'Price Series', 'Predictions', 'Advice', 'Provider State', 'Diagnostics'];
  currentTab = 'Providers';
  health: HealthStatusDto | null = null;
  mockEnabled = false;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadHealth();
  }

  loadHealth(): void {
    this.apiService.getHealth().subscribe({
      next: (data) => {
        this.health = data;
      },
      error: (err) => {
        console.error('Error loading health:', err);
      },
    });
  }

  toggleMockMode(): void {
    this.mockEnabled = !this.mockEnabled;
    this.apiService.toggleMock(this.mockEnabled).subscribe({
      next: (data) => {
        console.log('Mock mode toggled:', data);
      },
      error: (err) => {
        console.error('Error toggling mock mode:', err);
      },
    });
  }
}
