import { Component, OnInit, Output } from '@angular/core';
import { BoardComponent } from './board/board.component';
import { User } from '../models/User';
import { LobbyService } from '../lobby/lobby.service';
import { GameService } from './game.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  @Output() public size = 3;
  @Output() public players: User[];
  @Output() public clientTurn = false; // Indicates if it's the client's turn to shoot
  @Output() public gameStarted = false;
  @Output() public gameOver = false;
  private gameEventSubscription: Subscription;
  private statusMsg = 'Place your ships on the board. Click continue when finished';

  constructor(private lobbyService: LobbyService, private gameService: GameService) { }

  ngOnInit() {
    // Fetch boolean from lobby service, to know who starts to shoot
    this.gameService.clientStarts = this.lobbyService.clientStarts;
    this.gameService.players = this.lobbyService.getPlayers();
    this.players = this.lobbyService.getPlayers();
    this.gameService.clientStarts = this.lobbyService.clientStarts;
    this.gameService.listenWebSocket();
    this.gameService.getHighscores();

    this.gameEventSubscription = this.gameService.gameEventSource
      .subscribe((status) => {
        switch (status) {
          case 'START':
            this.gameStarted = true;
            break;
          case 'SHOOT':
            this.statusMsg = 'It\'s your turn to shoot!';
            this.clientTurn = true;
            break;
          case 'WAIT':
            this.statusMsg = 'Wait for other player..';
            this.clientTurn = false;
            break;
          case 'WIN':
            this.statusMsg = 'GAME OVER\nYou won!\n';
            this.gameOver = true;
            break;
          case 'DEFEAT':
            this.statusMsg = 'GAME OVER\nYou lost!';
            this.gameOver = true;
            break;
          case 'INTERRUPT':
            this.statusMsg = 'Game interrupted!';
            this.gameOver = true;
            break;
        }
      });
  }
}
