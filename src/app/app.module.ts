import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RootComponent } from './root.component';
import { HomeComponent } from './home.component';
import '@clr/icons';
import '@clr/icons/shapes/all-shapes';
import { ScenarioComponent } from './scenario/scenario.component';
import { TerminalComponent } from './scenario/terminal.component';
import { JwtModule } from '@auth0/angular-jwt';
import {HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { AuthGuard } from './auth.guard';
import { ScenarioCard } from './scenario/scenariocard.component';
import { StepComponent } from './scenario/step.component';
import { VMClaimComponent } from './scenario/vmclaim.component';
import { AtobPipe } from './atob.pipe';
import { MarkdownModule } from 'ngx-markdown';
import { environment } from 'src/environments/environment';
import { DynamicHTMLModule } from './dynamic-html';
import { CtrComponent } from './scenario/ctr.component';
import { CtrService } from './scenario/ctr.service';

export function tokenGetter() {
  return localStorage.getItem("hobbyfarm_token");
}

// necessary so that TS knows about the HobbyfarmConfig namespace
// on the window object. This gets injected with values at runtime
declare global {
  interface Window {
    HobbyfarmConfig: any;
  }
}

export class AppConfig {
  static getServer() {
    return window.HobbyfarmConfig.SERVER;
  }
}

@NgModule({
  declarations: [
    AppComponent,
    RootComponent,
    HomeComponent,
    ScenarioComponent,
    TerminalComponent,
    LoginComponent,
    ScenarioCard,
    StepComponent,
    CtrComponent,
    VMClaimComponent,
    AtobPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ClarityModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MarkdownModule.forRoot(),
    DynamicHTMLModule.forRoot({
      components: [
        {component: CtrComponent, selector: 'ctr'}
      ]
    }),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: [
          AppConfig.getServer()
        ],
        blacklistedRoutes: [
          AppConfig.getServer() + '/auth/authenticate'
        ],
        skipWhenExpired: true
      }
    })
  ],
  providers: [
    AuthGuard,
    CtrService
  ],
  bootstrap: [RootComponent]
})
export class AppModule { 

}