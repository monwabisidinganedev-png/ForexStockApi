import { Component } from '@angular/core';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProvidersComponent } from './components/providers-panel/providers-panel.component';
import { PriceSeriesPanelComponent } from './components/price-series-panel/price-series-panel.component';
import { PredictionsPanelComponent } from './components/predictions-panel/predictions-panel.component';
import { AdvicePanelComponent } from './components/advice-panel/advice-panel.component';
import { ProviderStatePanelComponent } from './components/provider-state-panel/provider-state-panel.component';
import { DiagnosticsPanelComponent } from './components/diagnostics-panel/diagnostics-panel.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    DashboardComponent,
    ProvidersComponent,
    PriceSeriesPanelComponent,
    PredictionsPanelComponent,
    AdvicePanelComponent,
    ProviderStatePanelComponent,
    DiagnosticsPanelComponent,
  ],
  template: '<app-dashboard></app-dashboard>',
})
export class AppComponent {}
