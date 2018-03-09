import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { WebsocketService } from './websocket.service';
import { LoginService } from './login/login.service';
import { LobbyComponent } from './lobby/lobby.component';

const appRoutes: Routes = [
  { path: 'lobby',
    component: LobbyComponent,
    data: { title: 'Lobby'}
  },
  { path: '',
    redirectTo: '/',
    pathMatch: 'full'
  },
  // { path: '**', component: PageNotFoundComponent }
];


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LobbyComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [WebsocketService, LoginService],
  bootstrap: [AppComponent]
})
export class AppModule { }
