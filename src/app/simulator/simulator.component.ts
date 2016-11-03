/**
 * Created by ehsangharaei on 13/10/2016.
 */
import { Component } from '@angular/core';


@Component({
    selector: 'my-simulator2',
    templateUrl: 'simulator.component.html',
    styleUrls: ['simulator.component.css']
})
export class SimulatorComponent {


    ngOnInit(){
        if(!window.location.hash) {
            window.location = window.location + '#loaded';
            window.location.reload();
        }

    }

    ngAfterViewInit() {

    }

}

