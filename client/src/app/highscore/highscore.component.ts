import { Component, OnInit } from '@angular/core';
import { Highscore } from '../models/Highscore';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-highscore',
  templateUrl: './highscore.component.html',
  styleUrls: ['./highscore.component.css']
})
export class HighscoreComponent implements OnInit {

  private highscoreURL = 'highscore';
  private entries: Highscore[];
  constructor(private http: HttpService) { }

  ngOnInit() {
    this.http.get(this.highscoreURL, 'getHighscore')
    .subscribe((entries: Highscore[]) => { this.entries = entries; });
  }

}
