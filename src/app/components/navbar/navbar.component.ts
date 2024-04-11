import { Component, OnInit } from '@angular/core';
import { AuthData } from 'src/app/models/auth-data.interface';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit{
  user!: AuthData | null;

  constructor(private authSrv: AuthService) {}

  ngOnInit(): void {
    this.authSrv.user$.subscribe((user) => {
      this.user = user;
    });
  }

  logout(){
    this.authSrv.logout();
  }
}
