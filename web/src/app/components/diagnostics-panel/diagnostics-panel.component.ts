import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { DiagnosticsResultDto } from '../../models';

@Component({
  selector: 'app-diagnostics-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="diagnostics-panel">
      <h2>System Diagnostics</h2>
      <button (click)="runDiagnostics()" class="btn btn-primary">Run Diagnostics</button>

      <div *ngIf="loading" class="loading">Running diagnostics...</div>

      <div *ngIf="!loading && diagnostics" class="results">
        <h3>Diagnostics Results</h3>
        <div class="diagnostics-content">
          <pre>{{ formatDiagnostics() }}</pre>
        </div>
      </div>

      <div *ngIf="error" class="error-message">{{ error }}</div>
    </div>
  `,
  styles: [
    `
      .diagnostics-panel {
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

      .diagnostics-content {
        background-color: #f5f5f5;
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 15px;
        margin-top: 15px;
      }

      pre {
        margin: 0;
        font-family: 'Courier New', monospace;
        font-size: 12px;
        color: #333;
        overflow-x: auto;
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
    `,
  ],
})
export class DiagnosticsPanelComponent {
  diagnostics: DiagnosticsResultDto | null = null;
  loading = false;
  error = '';

  constructor(private apiService: ApiService) {}

  runDiagnostics(): void {
    this.loading = true;
    this.error = '';
    this.apiService.runDiagnostics().subscribe({
      next: (data) => {
        this.diagnostics = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to run diagnostics: ' + err.message;
        this.loading = false;
      },
    });
  }

  formatDiagnostics(): string {
    return JSON.stringify(this.diagnostics, null, 2);
  }
}
