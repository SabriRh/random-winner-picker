import { CommonModule } from '@angular/common';
import { Component, inject, Signal } from '@angular/core';
import { ParticipantsService } from '../../core/participants.service';
import { ParticipantsListComponent } from '../../shared/participants-list/participants-list.component';
import { WheelComponent } from '../../shared/wheel/wheel.component';
import { ShareLinkComponent } from "../../shared/share-link/share-link.component";
import { WinnerOverlayComponent } from "../../shared/winner-overlay/winner-overlay.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, WheelComponent, ParticipantsListComponent, ShareLinkComponent, WinnerOverlayComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  #participantsService = inject(ParticipantsService);

  public participants: Signal<string[]> = this.#participantsService.all;

  winner: string | null = null;

  constructor() { }

  onWinner(winner: string) {
    console.log('🎉 Gagnant :', winner);
    this.winner = winner;
  }

  participantsChange($event: string[]) {
    this.#participantsService.updateParticipants($event);
  }

  addParticipant(name: string) {
    this.#participantsService.add(name);
  }

  removeParticipant(name: string) {
    this.#participantsService.remove(name);
  }
}
