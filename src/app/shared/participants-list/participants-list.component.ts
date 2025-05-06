import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-participants-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './participants-list.component.html',
  styleUrls: ['./participants-list.component.scss']
})
export class ParticipantsListComponent {
  @Input() participants: string[] = [];
  @Output() participantsChange = new EventEmitter<string[]>();

  newParticipant = '';

  addParticipant() {
    const name = this.newParticipant.trim();
    if (name && !this.participants.includes(name)) {
      this.participants = [...this.participants, name];
      this.participantsChange.emit(this.participants);
      this.newParticipant = '';
    }
  }

  removeParticipant(index: number) {
    this.participants = this.participants.filter((_, i) => i !== index);
    this.participantsChange.emit(this.participants);
  }
}
