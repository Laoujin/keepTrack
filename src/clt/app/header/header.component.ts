import { Component, OnInit } from "@angular/core";
import { RestService } from '../rest.service';
import { ActivatedRoute, RouterModule, Router, Params, ParamMap } from '@angular/router';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})

export class HeaderComponent {
    
   mode: boolean;
   private key: string;
    
    constructor(public rest:RestService, private route: ActivatedRoute, private router: Router) {}
    
    ngOnInit(){
        this.route.paramMap.subscribe((paramMap: ParamMap) => {
             if (paramMap.has('key')) {
                this.mode = true;
                this.key = paramMap.get('key');
             }else{
                 this.mode = false;
             }
        });
    }
}