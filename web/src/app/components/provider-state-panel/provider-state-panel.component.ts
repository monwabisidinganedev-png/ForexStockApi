import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ProviderStateDto } from '../../models';

@Component({
  selector: 'app-provider-state-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="provider-state-panel">
      <h2>Provider State Management</h2>

      <button (click)="loadAllProviderStates()" class="btn btn-primary">Refresh All States</button>

      <div *ngIf="loading" class="loading">Loading provider states...</div>

      <div *ngIf="!loading && providerStates.length > 0" class="results">
        <h3>Provider States</h3>
        <div class="state-cards">
          <div *ngFor="let state of providerStates" class="state-card" [ngClass]="state.success ? 'success' : 'failed'">
            <div class="state-header">
              <h4>{{ state.provider }}</h4>
              <span class="status-badge" [ngClass]="state.success ? 'success' : 'failed'">
                {{ state.success ? '✓ Healthy' : '✗ Failed' }}
              </span>
            </div>
            <div class="state-content">
              <p><strong>Last Checked:</strong> {{ state.lastChecked | date: 'medium' }}</p>
              <p><strong>Message:</strong> {{ state.message }}</p>
              <p *ngIf="state.statusCode"><strong>Status Code:</strong> {{ state.statusCode }}</p>
              <p *ngIf="state.rateLimitRemaining !== null"><strong>Rate Limit Remaining:</strong> {{ state.rateLimitRemaining }}</p>
              <p *ngIf="state.rateLimitReset"><strong>Rate Limit Reset:</strong> {{ state.rateLimitReset | date: 'medium' }}</p>
              <p><strong>Fallback to Mock:</strong> {{ state.fallbackToMock ? 'Yes' : 'No' }}</p>
              <button (click)="editState(state)" class="btn btn-secondary">Edit</button>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="!loading && selectedState" class="edit-section">
        <h3>Edit Provider State</h3>
        <div class="form-group">
          <label>Provider:</label>
          <input [(ngModel)]="selectedState.provider" />
        </div>
        <div class="form-group">
          <label>Success:</label>
          <input [(ngModel)]="selectedState.success" type="checkbox" />
        </div>
        <div class="form-group">
          <label>Message:</label>
          <textarea [(ngModel)]="selectedState.message"></textarea>
        </div>
        <div class="form-group">
          <label>Fallback to Mock:</label>
          <input [(ngModel)]="selectedState.fallbackToMock" type="checkbox" />
        </div>
        <button (click)="updateState()" class="btn btn-success">Update State</button>
        <button (click)="selectedState = null" class="btn btn-cancel">Cancel</button>
      </div>

      <div *ngIf="error" class="error-message">{{ error }}</div>
      <div *ngIf="successMessage" class="success-message">{{ successMessage }}</div>
    </div>
  `,
  styles: [
    `
      .provider-state-panel {
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

      .state-cards {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 15px;
        margin-top: 20px;
      }

      .state-card {
        border-radius: 8px;
        padding: 15px;
        border: 1px solid #ddd;
        background-color: white;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .state-card.success {
        border-left: 4px solid #4caf50;
      }

      .state-card.failed {
        border-left: 4px solid #f44336;
      }

      .state-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        padding-bottom: 10px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      }

      .state-header h4 {
        margin: 0;
        color: #333;
      }

      .status-badge {
        font-weight: bold;
        font-size: 12px;
        padding: 4px 8px;
        border-radius: 4px;
        color: white;
      }

      .status-badge.success {
        background-color: #4caf50;
      }

      .status-badge.failed {
        background-color: #f44336;
      }

      .state-content p {
        margin: 8px 0;
        font-size: 14px;
        color: #555;
      }

      .edit-section {
        background-color: #f9f9f9;
        padding: 15px;
        border-radius: 4px;
        margin-top: 20px;
        border: 1px solid #e0e0e0;
      }

      .form-group {
        display: flex;
        gap: 10px;
        margin-bottom: 10px;
        align-items: flex-start;
      }

      .form-group label {
        min-width: 120px;
        font-weight: 500;
        color: #666;
        padding-top: 6px;
      }

      .form-group input:not([type="checkbox"]),
      .form-group textarea {
        padding: 6px 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 14px;
        flex: 1;
      }

      .form-group input[type="checkbox"] {
        width: 18px;
        height: 18px;
      }

      .btn {
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        margin-top: 10px;
        margin-right: 10px;
      }

      .btn-primary {
        background-color: #0066cc;
        color: white;
      }

      .btn-primary:hover {
        background-color: #0052a3;
      }

      .btn-secondary {
        background-color: #6c757d;
        color: white;
        font-size: 12px;
        padding: 4px 10px;
      }

      .btn-secondary:hover {
        background-color: #5a6268;
      }

      .btn-success {
        background-color: #28a745;
        color: white;
      }

      .btn-success:hover {
        background-color: #218838;
      }

      .btn-cancel {
        background-color: #ddd;
        color: #333;
      }

      .btn-cancel:hover {
        background-color: #ccc;
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
export class ProviderStatePanelComponent implements OnInit {
  providerStates: ProviderStateDto[] = [];
  selectedState: ProviderStateDto | null = null;
  loading = false;
  error = '';
  successMessage = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadAllProviderStates();
  }

  loadAllProviderStates(): void {
    this.loading = true;
    this.error = '';
    this.successMessage = '';
    this.apiService.getAllProviderStates().subscribe({
      next: (data) => {
        this.providerStates = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load provider states: ' + err.message;
        this.loading = false;
      },
    });
  }

  editState(state: ProviderStateDto): void {
    this.selectedState = { ...state };
  }

  updateState(): void {
    if (!this.selectedState) return;
    this.loading = true;
    this.error = '';
    this.successMessage = '';
    this.apiService.updateProviderState(this.selectedState).subscribe({
      next: () => {
        this.successMessage = 'Provider state updated successfully!';
        this.selectedState = null;
        this.loadAllProviderStates();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to update provider state: ' + err.message;
        this.loading = false;
      },
    });
  }
}
