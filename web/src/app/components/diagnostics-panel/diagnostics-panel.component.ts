import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { DiagnosticsResultDto } from '../../models';

@Component({
  selector: 'app-diagnostics-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './diagnostics-panel.component.html',
  styleUrls: ['./diagnostics-panel.component.css'],
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
