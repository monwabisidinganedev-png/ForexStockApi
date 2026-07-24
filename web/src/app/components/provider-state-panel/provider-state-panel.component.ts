import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ProviderStateDto } from '../../models';

@Component({
  selector: 'app-provider-state-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './provider-state-panel.component.html',
  styleUrls: ['./provider-state-panel.component.css'],
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
