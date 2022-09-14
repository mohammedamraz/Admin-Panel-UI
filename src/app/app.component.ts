import { Component } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError} from '@angular/router';
import { AdminConsoleService } from './services/admin-console.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'fedo-admin-ui';
  currentRoute: string;


  constructor(private router: Router,private adminConsoleService: AdminConsoleService
    ) {
    this.currentRoute = "";
    this.router.events.subscribe((event: Event) => this.adminConsoleService.breadcrumbs(event));

}
}
