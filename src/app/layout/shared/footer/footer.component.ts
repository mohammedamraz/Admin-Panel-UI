import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  today: Date = new Date();

  constructor () { }

  ngOnInit(): void {
  }

  playstore(){let redirectWindow = window.open('https://www.fedo.ai');
    // else {let redirectWindow = window.open("https://www.google.com");}   
  }

}
