import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { ProviderDto } from '../../models';

@Component({
  selector: 'app-providers-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './providers-panel.component.html',
  styleUrls: ['./providers-panel.component.css'],
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
