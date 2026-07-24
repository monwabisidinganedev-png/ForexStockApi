import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { HealthStatusDto } from '../../models';
import { ProvidersComponent } from '../providers-panel/providers-panel.component';
import { PriceSeriesPanelComponent } from '../price-series-panel/price-series-panel.component';
import { PredictionsPanelComponent } from '../predictions-panel/predictions-panel.component';
import { AdvicePanelComponent } from '../advice-panel/advice-panel.component';
import { ProviderStatePanelComponent } from '../provider-state-panel/provider-state-panel.component';
import { DiagnosticsPanelComponent } from '../diagnostics-panel/diagnostics-panel.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ProvidersComponent, PriceSeriesPanelComponent, PredictionsPanelComponent, AdvicePanelComponent, ProviderStatePanelComponent, DiagnosticsPanelComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
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
      next: () => {
        console.log('Mock mode toggled');
      },
      error: (err) => {
        console.error('Error toggling mock mode:', err);
      },
    });
  }
}
