/**
 * Created by ehsangharaei on 13/10/2016.
 */
import { Component } from '@angular/core';



@Component({
    selector: 'my-simulator2',
    templateUrl: './simulator2.component.html',
    styleUrls: ['./simulator2.component.css']
})
export class Simulator2Component {

    ngOnInit(){
        console.log("this executes first");
        if(!window.location.hash) {
            window.location = window.location + '#loaded';
            window.location.reload();
        }
    }

    ngAfterViewInit() {

    }

}

