/**
 * Created by ehsangharaei on 13/10/2016.
 */
import { Component } from '@angular/core';
import { DragulaService } from 'ng2-dragula/ng2-dragula';


@Component({
    selector: 'my-simulator',
    templateUrl: './simulator.component.html',
    styleUrls: ['./simulator.component.css']
})
export class SimulatorComponent {

    public many: Array<string> = ['item 1', 'item 2', 'item 3', 'item 4'];
    public many2: Array<string> = ['item A', 'item B','item C','item D'];

    constructor(private dragulaService: DragulaService) {
        dragulaService.dropModel.subscribe((value) => {
            this.onDropModel(value.slice(1));
        });
        dragulaService.removeModel.subscribe((value) => {
            this.onRemoveModel(value.slice(1));
        });

    }

    private onDropModel(args) {
        let [el, target, source] = args;
        // do something else
    }

    private onRemoveModel(args) {
        let [el, source] = args;
        // do something else
    }

    ngAfterViewInit() {
        $('#canvasInAPerfectWorld').click(function () {
            alert("The paragraph was clicked.");
        });
    }

}

