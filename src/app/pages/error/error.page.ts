import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-error',
  templateUrl: './error.page.html',
  styleUrls: ['./error.page.scss'],
})
export class ErrorPage {  //implements OnInit
  message: string = "Página não encontrada!";

  constructor() { }

  //ngOnInit() {}

}
