import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { Http } from "@angular/http";
import { Redirect301Service } from 'app/services/redirect301.service';
import { Globals } from 'app/models/globals';

@Component({
    selector: 'redirect',
    template: '<h1>Redirecionando</h1>'
})
export class RedirectComponent implements OnInit {
    path: string;
    regexUrl: RegExp = /^https?:\/{2}(www\.)?.+(.com|.net|.org)(.br)?/;

    constructor(
        private router: Router, 
        private route: ActivatedRoute, 
        private globals: Globals,
        private service: Redirect301Service
    ) { }

    ngOnInit() { 
        this.route.params
        .map(params => params)
        .subscribe((params) => {
            let path: string = '';

            if(params['redir']){
                path = decodeURI(this.router.url).slice(1).replace('redirect/', '');
            }
            else
                path = decodeURI(this.router.url).slice(1);

            this.redirectTo(path);
        });
    }
    
    redirectTo(path: string){
        path = path.replace(/^redirect/, '');
        this.service.getAll()
        .then(routes => {

            routes.forEach(route => {
                route.redirectFrom = route.redirectFrom.replace(this.regexUrl, '');
                route.redirectTo = route.redirectTo.replace(this.regexUrl, '');
            });

            let redirect = routes.find(r => r.redirectFrom == path.replace(/%2F/g, '/'));
            if(redirect)
                this.router.navigateByUrl(redirect.redirectTo);
            else
                this.router.navigateByUrl('/');
        })
        .catch(error => {
            console.log(error);
            this.router.navigateByUrl('/');
        });
    }
}