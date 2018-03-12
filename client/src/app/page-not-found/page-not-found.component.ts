import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  template: '<h2>Page not found</h2>',
  providers: [Location]
})
export class PageNotFoundComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit()	{
    this.router.navigate(['login']);
  }

 }
