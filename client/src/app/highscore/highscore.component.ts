import { Component, OnInit } from '@angular/core';
import { Highscore } from '../models/Highscore';
import { HttpService } from '../http.service';
import { GameService } from '../game/game.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-highscore',
  templateUrl: './highscore.component.html',
  styleUrls: ['./highscore.component.css']
})
export class HighscoreComponent implements OnInit {

  private highscoreURL = 'highscore';
  private entries: Highscore[];
  private highscoreSubscription: Subscription; // Subscribe to updates in highscore
  constructor(private http: HttpService, private gameService: GameService) { }

  ngOnInit() {
    this.highscoreSubscription = this.gameService.highscoreEventSource
      .subscribe((entries: Highscore[]) => { this.entries = entries; });
    this.gameService.getHighscores();
  }
}
