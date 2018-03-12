import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

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

const appRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
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
  declarations: [
    AppComponent,
    LoginComponent,
    LobbyComponent,
    PageNotFoundComponent,
    RegisterComponent,
    ChatComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(
      appRoutes,
      // { enableTracing: true } // <-- debugging purposes only
    )
  ],
  providers: [WebsocketService, AuthService, LobbyService, ChatService],
  bootstrap: [AppComponent]
})
export class AppModule { }
