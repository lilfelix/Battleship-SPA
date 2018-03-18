import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes, RouteReuseStrategy } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { WebsocketService } from './websocket.service';
import { AuthService } from './login/auth.service';
import { LobbyComponent } from './lobby/lobby.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RegisterComponent } from './register/register.component';
import { LobbyService } from './lobby/lobby.service';
import { ChatComponent } from './chat/chat.component';
import { ChatService } from './chat/chat.service';
import { AppRoutingModule } from './routing.module';
import { GameComponent } from './game/game.component';
import { BoardComponent } from './game/board/board.component';
import { HttpService } from './http.service';
import { GameService } from './game/game.service';
import { CustomReuseStrategy } from './custom-reuse-strategy';
import { CookieService } from 'ngx-cookie-service';
import { HighscoreComponent } from './highscore/highscore.component';
import { ProfileComponent } from './profile/profile.component';
import { ActiveGameResolver } from './active-game-resolver';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LobbyComponent,
    PageNotFoundComponent,
    RegisterComponent,
    ChatComponent,
    GameComponent,
    BoardComponent,
    HighscoreComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
  ],
  providers: [
    WebsocketService,
    HttpService,
    AuthService,
    LobbyService,
    ChatService,
    GameService,
    ActiveGameResolver,
    {provide: RouteReuseStrategy, useClass: CustomReuseStrategy},
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
