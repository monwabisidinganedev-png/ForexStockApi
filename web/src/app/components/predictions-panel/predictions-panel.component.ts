import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { PredictionResultDto, ProviderDto } from '../../models';

@Component({
  selector: 'app-predictions-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './predictions-panel.component.html',
  styleUrls: ['./predictions-panel.component.css'],
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
