import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-jukebox',
    template: `
    <div class="container py-4">
      <h1 class="mb-4">🎶 Jukebox</h1>

      <div *ngIf="!isAdmin" class="input-group mb-3">
        <input [(ngModel)]="searchQuery" class="form-control" placeholder="Rechercher une chanson..." (keyup.enter)="search()">
        <button class="btn btn-primary" (click)="search()">Rechercher</button>
      </div>

    <div *ngIf="searchResults.length" class="mb-4">
        <h5>Résultats :</h5>
        <ul class="list-group">
          <li *ngFor="let track of searchResults" class="list-group-item d-flex align-items-center">
            <img [src]="track.image" class="me-3 rounded" width="64" height="64">
            <div class="flex-grow-1">
              <div>{{ track.name }}</div>
              <small class="text-muted">{{ track.artist }}</small>
            </div>
            <button class="btn btn-success" (click)="addToQueue(track.uri)">Ajouter</button>
          </li>
        </ul>
      </div>

      <div class="mb-4">
        <h5>Morceau en cours :</h5>
        <div *ngIf="currentTrack; else noTrack">

            <img [src]="currentTrack.image" class="me-3 rounded" width="64" height="64">
            <div class="flex-grow-1">
              <div>{{ currentTrack.title }}</div>
              <small class="text-muted">{{ currentTrack.artist }}</small>
            </div>
             
          <span class="ms-2 badge bg-info" style="margin-top:1em;">{{ isPlaying ? 'Lecture en cours' : 'En pause' }}</span>
        </div>
        <ng-template #noTrack>
          <p>Aucune lecture en cours</p>
        </ng-template>
       <button *ngIf="isAdmin"
            class="btn btn-outline-secondary rounded-circle"
            style="margin-top:1em; width: 100px; height: 100px; font-size: 2rem;"
            (click)="next()"
            >
                                         ⏭
        </button>
      </div>

      <div>
        <h5>File d'attente :</h5>
        <ul class="list-group">
          <li *ngFor="let track of queue" class="list-group-item">
           <img [src]="track.image" class="me-3 rounded" width="64" height="64">
            <div class="flex-grow-1">
              <div>{{ track.name }}</div>
              <small class="text-muted">{{ track.artist }}</small>
            </div>
          </li>
        </ul>
      </div>
    </div>
  `,
    styleUrls: ['./jukebox.component.scss']
})
export class JukeboxComponent implements OnInit {
    searchQuery = '';
    searchResults: any[] = [];
    isPlaying = false;
    isAdmin = false;
    currentTrack: { artist: string, title: string, image: string } | null = null;
    queue: string[] = [];

    constructor(
        private http: HttpClient,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {

        this.route.queryParams.subscribe((params: { [x: string]: string; }) => {
            this.isAdmin = params['admin'] === '7uMwo9RmnMziTpJRBQkN27';
            console.log('Admin ?', this.isAdmin);
        });


        this.loadQueue();
        this.getNowPlaying();

        setInterval(() => {
            this.loadQueue();
            this.getNowPlaying();
        }, 10000); // 10000 ms = 10 secondes
    }

    search(): void {
        this.http.get<any[]>(`${environment.apiUrl}/api/search?q=${encodeURIComponent(this.searchQuery)}`)
            .subscribe((results: any[]) => this.searchResults = results);
    }

    addToQueue(uri: string): void {
        this.http.post(`${environment.apiUrl}/api/queue`, { uri }).subscribe(() => {

            this.loadQueue();

            this.searchResults = [];
            this.searchQuery = '';
        });
    }

    play(): void {
        this.http.post(`${environment.apiUrl}/api/play`, {}).subscribe();
    }

    next(): void {
        this.http.post(`${environment.apiUrl}/api/next`, {}).subscribe(() => {
            this.getNowPlaying();
            this.loadQueue();
        });
    }

    getNowPlaying(): void {
        this.http.get<any>(`${environment.apiUrl}/api/now-playing`)
            .subscribe((data: { artist: string, title: string, image: string, isPlaying: boolean; }) => {
                this.currentTrack = {
                    artist: data?.artist || '',
                    title: data?.title || '',
                    image: data?.image || '',

                };
                this.isPlaying = data?.isPlaying || false;
            });
    }

    loadQueue(): void {
        this.http.get<string[]>(`${environment.apiUrl}/api/queue`)
            .subscribe((data: string[]) => this.queue = data);
    }
}
