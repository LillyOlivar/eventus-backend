// src/app/features/admin/admin-panel/admin-panel.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EventsService } from '../../../core/services/events.service';
import { Stats, Event } from '../../../shared/models';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css'],
})
export class AdminPanelComponent implements OnInit {
  stats: Stats | null = null;
  events: Event[] = [];
  loading = true;

  constructor(private eventsService: EventsService) {}

  ngOnInit() {
    this.eventsService.getStats().subscribe({
      next: (s) => { this.stats = s; },
    });
    this.eventsService.getAll().subscribe({
      next: (e) => { this.events = e; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }

  deleteEvent(id: number) {
    if (!confirm('¿Eliminar este evento? Esta acción no se puede deshacer.')) return;
    this.eventsService.delete(id).subscribe({
      next: () => { this.events = this.events.filter((e) => e.id !== id); },
    });
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      UPCOMING: 'Próximo', ONGOING: 'En curso', FINISHED: 'Finalizado', CANCELLED: 'Cancelado',
    };
    return map[status] || status;
  }
}
