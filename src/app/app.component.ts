import { Component } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError} from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'fedo-admin-ui';
  currentRoute: string;


  constructor(private router: Router) {
    this.currentRoute = "";
    this.router.events.subscribe((event: Event) => {

        if (event instanceof NavigationStart) {
            // Show loading indicator
            console.log('Route change detected');
        }

        if (event instanceof NavigationEnd) {
            // Hide loading indicator
            this.currentRoute = event.url;          
              console.log(event);
        }

        if (event instanceof NavigationError) {
            // Hide loading indicator

            // Present error to user
            console.log(event.error);
        }
    });

}
}
