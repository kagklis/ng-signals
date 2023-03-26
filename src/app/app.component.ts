import { NgIf, NgFor } from '@angular/common';
import { Component, computed, effect, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor]
})
export class AppComponent implements OnInit {
  price = signal<number>(0);
  vat = computed<number>(() => this.price() * 0.15);
  total = computed<number>(() => this.price() + this.vat());
  history = signal<HistoryEntry[]>([]);
  logger = effect(() => {
    localStorage.setItem('currentPrice', this.price().toString());
    localStorage.setItem('currentHistory', JSON.stringify(this.history()));
  });

  ngOnInit(): void {
    const priceValue = localStorage.getItem('currentPrice');
    if (priceValue) {
      this.price.set(+priceValue);
    }

    const history = localStorage.getItem('currentHistory');
    if (history) {
      this.history.set(JSON.parse(history));
    }
  }

  onInputUpdate(event: Event): void {
    const newValue = +(event.target as HTMLInputElement).value;
    this.price.set(newValue);
  }

  save(): void {
    if (this.price() <= 0) {
      return;
    }
    this.history.mutate((history: HistoryEntry[]) =>
      history.push({ price: this.price(), vat: this.vat(), total: this.total() })
    );
  }
}

interface HistoryEntry {
  price: number;
  vat: number;
  total: number;
}
