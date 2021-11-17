import { Component, Input } from '@angular/core';
import { OnDynamicMount } from 'ngx-dynamic-hooks';
import { CtrService } from './ctr.service';

@Component({
    selector: 'ctr',
    template:  `
        <pre (click)="ctr()">{{code}}</pre>
        <i><clr-icon shape="angle"></clr-icon> Click to run on <b>{{target}}</b><span> {{countContent}}</span></i>
    `,
    styleUrls: ['ctr.component.scss']
})
export class CtrComponent implements OnDynamicMount {
    @Input('ctrid') public id: string = "";

    public code: string = "";
    public target: string = "";
    public count: number = Number.POSITIVE_INFINITY;
    public countContent: string = "";

    constructor(
        public ctrService: CtrService
    ) {
    }

    public onDynamicMount() {
        this.code = this.ctrService.getCode(this.id);
        this.target = this.ctrService.getTarget(this.id);
        this.count = this.ctrService.getCount(this.id);
        if(this.count != Number.POSITIVE_INFINITY){
            this.updateCount();
        }
    }

    public ctr() {
        if(this.count > 0){
            this.ctrService.sendCode({target: this.target, code: this.code});
            if(this.count != Number.POSITIVE_INFINITY){
                this.count -= 1;
                this.updateCount()
            }
        }
    }

    private updateCount(){
        let clicks = this.count == 1 ? "click" : "clicks";
        let content = `(${this.count} ${clicks} left)`
        this.countContent = content;
    }
}