import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AdviceResultDto } from '../../models';

@Component({
  selector: 'app-advice-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './advice-panel.component.html',
  styleUrls: ['./advice-panel.component.css'],
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
