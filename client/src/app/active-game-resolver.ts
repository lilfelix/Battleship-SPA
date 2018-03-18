import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';
import { GameService } from './game/game.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/observable';

@Injectable()
export class ActiveGameResolver implements Resolve<any>, CanActivate {
    constructor(private gameService: GameService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.gameService.activeGame;
    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
      ): Observable<boolean>|Promise<boolean>|boolean {
        return this.gameService.activeGame;
       }
}

