import { Injectable, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class ParticipantsService {
  private participants = signal<string[]>([]);

  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.queryParamMap.subscribe((params) => {
      const raw = params.get('participants');
      this.participants.set(raw ? raw.split(',') : []);
    });
  }

  get all() {
    return this.participants.asReadonly();
  }

  add(name: string) {
    const updated = [...this.participants(), name];
    this.updateUrl(updated);
  }

  remove(name: string) {
    const updated = this.participants().filter(p => p !== name);
    this.updateUrl(updated);
  }

  public updateParticipants(participants: string[]) {
    this.participants.set(participants);
    this.updateUrl(participants);
  }

  private updateUrl(participants: string[]) {
    this.router.navigate([], {
      queryParams: { participants: participants.join(',') },
      queryParamsHandling: 'merge'
    });
  }
}
