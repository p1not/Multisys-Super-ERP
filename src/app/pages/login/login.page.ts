import { Component, OnInit } from '@angular/core';
import { ReownService } from '../../services/reown.service';
import { createAppKit } from '@reown/appkit';


@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
    //standalone: false
})
export class LoginPage implements OnInit {

  constructor(private reownService: ReownService) { }

  ngOnInit() {
    console.log("Login");
  }

  openLoginModal() {
    this.reownService.openModal();
  }

  openNetworkModal() {
    this.reownService.openNetworkModal();
  }

}
