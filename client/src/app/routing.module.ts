import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { LobbyComponent } from './lobby/lobby.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RegisterComponent } from './register/register.component';
import { ChatComponent } from './chat/chat.component';
import { GameComponent } from './game/game.component';
import { BoardComponent } from './game/board/board.component';
import { HighscoreComponent } from './highscore/highscore.component';
import { ProfileComponent } from './profile/profile.component';
import { ActiveGameResolver } from './active-game-resolver';
import { GameService } from './game/game.service';

export const appRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'logout',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'profile',
    component: ProfileComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'lobby',
    component: LobbyComponent,
    data: { title: 'Lobby' }
  },
  {
    path: 'game',
    component: GameComponent,
    resolve: {
      activeGame: ActiveGameResolver
    },
    canActivate: [ActiveGameResolver]
  },
  {
    path: 'highscore',
    component: HighscoreComponent,
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];
@NgModule({

  imports: [
    RouterModule.forRoot(
      appRoutes,
      // { enableTracing: true}
    )
  ],
  exports: [
    RouterModule,
  ]
})
export class AppRoutingModule {
}

