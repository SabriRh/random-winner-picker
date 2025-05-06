import {
  Component,
  ElementRef,
  Input,
  Output,
  ViewChild,
  AfterViewInit,
  EventEmitter,
  signal,
  OnChanges,
  SimpleChanges
} from '@angular/core';

@Component({
  selector: 'app-wheel',
  standalone: true,
  imports: [],
  templateUrl: './wheel.component.html',
  styleUrls: ['./wheel.component.scss']
})
export class WheelComponent implements AfterViewInit, OnChanges {
  @Input() participants: string[] = [];
  @Output() spun = new EventEmitter<string>();
  @ViewChild('wheelCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private rotation = signal(0);
  public isSpinning = false;
  private animationFrameId: number | null = null;

  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = 500;
    canvas.height = 500;
    this.ctx = canvas.getContext('2d')!;
    this.drawWheel();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['participants'] && this.ctx) {
      this.drawWheel();
    }
  }

  private drawWheel() {
    const canvas = this.canvasRef.nativeElement;
    const ctx = this.ctx;
    const { width, height } = canvas;
    const cx = width / 2;
    const cy = height / 2;
    const radius = width / 2;
    const anglePerSlice = (2 * Math.PI) / this.participants.length;

    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((this.rotation() * Math.PI) / 180);

    for (let i = 0; i < this.participants.length; i++) {
      const startAngle = i * anglePerSlice;
      const endAngle = startAngle + anglePerSlice;

      // Segment
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.fillStyle = this.getColorForIndex(i);
      ctx.fill();
      ctx.stroke();

      // Text
      ctx.save();
      ctx.rotate(startAngle + anglePerSlice / 2);
      ctx.translate(radius * 0.65, 0);
      ctx.rotate(Math.PI / 2);
      ctx.fillStyle = '#fff';
      ctx.font = '22px Titan One';
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#000';
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.shadowBlur = 4;
      ctx.fillText(this.participants[i], -ctx.measureText(this.participants[i]).width / 2, 0);
      ctx.restore();
    }

    ctx.restore();
    this.drawPointer();
  }

  private drawPointer() {
    const ctx = this.ctx;
    const canvas = this.canvasRef.nativeElement;
    const size = canvas.width;
    const center = size / 2;
    const radius = center;

    const pointerHeight = 30;
    const pointerWidth = 40;
    const gap = -20;

    const y = center - radius - pointerHeight - gap;

    ctx.beginPath();
    ctx.moveTo(center, y + pointerHeight);
    ctx.lineTo(center - pointerWidth / 2, y);
    ctx.quadraticCurveTo(center, y - 10, center + pointerWidth / 2, y);
    ctx.closePath();

    ctx.fillStyle = '#c21b17';
    ctx.fill();

    ctx.lineWidth = 2;
    ctx.strokeStyle = '#fff';
    ctx.stroke();
  }

  spin() {
    if (this.isSpinning || this.participants.length === 0) return;

    this.isSpinning = true;

    const winnerIndex = Math.floor(Math.random() * this.participants.length);
    const sliceAngle = 360 / this.participants.length;

    // Ajustement pour que le pointeur pointe exactement sur le gagnant
    // On ajoute 90 degrés pour compenser le fait que le pointeur est en haut
    // et on soustrait la moitié de l'angle de la tranche pour pointer au centre
    const targetAngle = 360 * 5 + (270 - (winnerIndex * sliceAngle + sliceAngle / 2));

    const start = performance.now();
    const duration = 4000;

    const animate = (time: number) => {
      const progress = Math.min((time - start) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3); // cubic easing out
      const currentRotation = targetAngle * easedProgress;
      this.rotation.set(currentRotation);
      this.drawWheel();

      if (progress < 1) {
        this.animationFrameId = requestAnimationFrame(animate);
      } else {
        this.isSpinning = false;
        const winner = this.participants[winnerIndex];
        this.spun.emit(winner);
      }
    };

    this.animationFrameId = requestAnimationFrame(animate);
  }

  private getColorForIndex(i: number): string {
    const colors = [
      '#ff4f7b', // rose
      '#36c9c6', // turquoise
      '#f6d743', // jaune
      '#a267e7', // violet
      '#fd9644', // orange
      '#4a90e2', // bleu
      '#9b59b6', // violet foncé
      '#2ecc71', // vert
    ];
    return colors[i % colors.length];
  }
}