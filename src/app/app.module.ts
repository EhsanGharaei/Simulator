/**
 * Created by ehsangharaei on 13/10/2016.
 */
import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { AppComponent } from './app.component';
import {HeaderComponent} from './header/header.component';
import {HomeComponent} from './home/home.component';
import {AboutComponent} from './about/about.component';
import { RouterModule }   from '@angular/router';
import {PageNotFoundComponent} from './pageNotFound/pageNotFound.component';
import {SimulatorComponent} from './simulator/simulator.component';
import {DragulaModule} from 'ng2-dragula/ng2-dragula';
import 'dragula/dist/dragula.css';



@NgModule({
    imports: [
        BrowserModule,
        DragulaModule,
        RouterModule.forRoot([
            { path: '', component: HomeComponent },
            { path: 'home', component: HomeComponent },
            { path: 'about', component: AboutComponent },
            { path: 'simulator', component: SimulatorComponent },
            { path: '**', component: PageNotFoundComponent },

        ])
    ],
    declarations: [
        AppComponent,
        HeaderComponent,
        HomeComponent,
        AboutComponent,
        PageNotFoundComponent,
        SimulatorComponent
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule { }

