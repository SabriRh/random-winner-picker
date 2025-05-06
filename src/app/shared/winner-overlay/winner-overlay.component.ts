import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from "@angular/core";
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-winner-overlay',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './winner-overlay.component.html',
  styleUrls: ['./winner-overlay.component.scss'],
})
export class WinnerOverlayComponent implements OnChanges {
  @Input() winner: string | null = null;
  @Output() closed = new EventEmitter<void>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['winner'] && this.winner) {
      this.launchConfetti();
    }
  }

  splitNameLines(): string[][] {
    if (!this.winner) return [];
    return this.winner
      .split(' ')
      .map(word => word.split(''));
  }

  close() {
    this.closed.emit();
  }

  private launchConfetti() {
    const duration = 2 * 1000;
    const animationEnd = Date.now() + duration;

    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      confetti({
        ...defaults,
        particleCount: 40,
        origin: {
          x: Math.random(),
          y: Math.random() - 0.2 // pour couvrir la page entière
        }
      });
    }, 250);
  }

}
