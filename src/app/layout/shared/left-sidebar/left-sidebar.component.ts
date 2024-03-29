import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';

// service
import { AuthenticationService } from 'src/app/core/service/auth.service';
import { EventService } from 'src/app/core/service/event.service';

// utility
import { changeBodyAttribute, findAllParent, findMenuItem } from '../helper/utils';

// types
import { User } from 'src/app/core/models/auth.models';
import { MenuItem } from '../models/menu.model';

// data
import { MENU_ITEMS } from '../config/menu-meta';
import { AdminConsoleService } from 'src/app/services/admin-console.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.scss']
})
export class LeftSidebarComponent implements OnInit {

  @Input() includeUserProfile: boolean = false;

  leftSidebarClass = 'sidebar-enable';
  activeMenuItems: string[] = [];
  loggedInUser: any={}
  menuItems: MenuItem[] = [];
  orglogin=false;
  products:any[]=[];

  constructor (
    router: Router,
    private authService: AuthenticationService,
    private readonly adminService: AdminConsoleService,
    private cdr: ChangeDetectorRef,
    private eventService: EventService) {
    router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        this._activateMenu(); //actiavtes menu
        this.hideMenu(); //hides leftbar on change of route
      }
    });


  }

  ngOnInit(): void {
    this.loggedInUser = <any>this.authService.currentUser();
    if(this.loggedInUser.hasOwnProperty('user_data') ){
      // this.orglogin=true;    
      this.adminService.fetchUserProdById(this.loggedInUser.user_data[0].id).subscribe({
        next:(res:any) =>{ 
          this.products = res;
            const prod = this.products.map(product => ({
              
              key: 'apps-tasks',
              label: product.product_id === 1 ? 'HSA' : (product.product_id === 2 ? 'Vitals':'RUW'),
              isTitle: false,
              icon: `mdi ${product.product_id === '1' ? 'mdi-account-box-multiple':(product.product_id === '2' ? 'mdi-clipboard-pulse-outline': 'mdi-briefcase-variant' ) }`,
              collapsed: true,
              children: [
                  {
                      key: 'task-kanban',
                      label: 'Dashboard',
                      url: `/${this.loggedInUser.user_data[0].org_id}/userdashboard/${product.product_id}`,
                      parentKey: 'apps-tasks',
                  },
              ],
            }))
            this.menuItems =  [
              { key: 'navigation', label: 'Navigation', isTitle: true },
            //   {
            //     key: 'dashboard',
            //     label: 'Home',
            //     isTitle: false,
            //     icon: 'mdi mdi-home',
            //     // badge: { variant: 'success', text: '9+' },
            //     url: `/${this.loggedInUser.user_data[0].org_id}/home/${this.loggedInUser.user_data[0].id}`,
            // },
              ...prod
           
            ];
        }})

    }
    else if( this.loggedInUser.hasOwnProperty('org_data')){
      if(this.loggedInUser.org_data[0].type === 'admin'){
      this.orglogin = false;
      this.menuItems = MENU_ITEMS;
      this.adminService.fetchProducts().subscribe(
        (doc:any) =>{
          let tempProd = [];
          tempProd.push(MENU_ITEMS[0]);
          tempProd.push(MENU_ITEMS[1]);
            doc = doc.filter((doc: { id: number; }) => doc.id !=  1);          
          const prod = doc.map((product:any) => ({ 
              key: 'apps-tasks',
              label: `${product.id === 1 ? 'HSA' : (product.id === 2 ? 'Vitals':'RUW')}`,
              isTitle: false,
              icon: `mdi ${product.id == 1 ?'mdi-account-box-multiple':(product.id == 2?'mdi-clipboard-pulse-outline':'mdi-briefcase-variant')}`,
              collapsed: true,
              children: [
                  {
                      key: 'task-kanban',
                      label: 'Dashboard',
                      url: `/vitals-dashboard/${product.id}`,
                      parentKey: 'apps-tasks',
                  },
                  {
                      key: 'task-details',
                      label: 'Pilots List',
                      url: `vitalsList/${product.id}`,
                      parentKey: 'apps-tasks',
                  },
                  {
                      key: 'task-details',
                      label: 'Guest Scans List',
                      url: `guestlist/${product.id}`,
                      parentKey: 'apps-tasks',
                  },
              ], 
           
          }
          ))
      
          // tempProd.push(MENU_ITEMS[2]);
          this.menuItems = [...tempProd,...prod,
          {
            
              key: 'Vitals-dashboard',
              label: 'Vitals Dashboard',
              isTitle: false,
              icon: 'mdi mdi-application',
              url: '/admin-dashboard',
          
          }]



        }
      )
    }
    else {
        this.orglogin = false;
        this.adminService.fetchOrgById(this.loggedInUser.org_data[0].id).subscribe({
          next:(res:any) =>{
            this.products = res[0].product;
            const prod = this.products.map(product => ({
              
              key: 'apps-tasks',
              label: product.product_id === '1' ? 'HSA' : (product.product_id === '2' ? 'Vitals':'RUW'),
              isTitle: false,
              icon: `mdi ${product.product_id === '1' ? 'mdi-account-box-multiple':(product.product_id === '2' ? 'mdi-clipboard-pulse-outline': 'mdi-briefcase-variant' ) }`,
              collapsed: true,
              children: [
                  {
                      key: 'task-kanban',
                      label: 'Dashboard',
                      url: `/${this.loggedInUser.org_data[0].id}/pilotdashboard/${product.product_id}`,
                      parentKey: 'apps-tasks',
                  },
                  {
                      key: 'task-kanban',
                      label: 'User List',
                      url: `/${this.loggedInUser.org_data[0].id}/userlist/${product.product_id}`,
                      parentKey: 'apps-tasks',
                  },
              ],
            }))
            this.menuItems =  [
              { key: 'navigation', label: 'Navigation', isTitle: true },
              {
                  key: 'dashboard',
                  label: 'Home',
                  isTitle: false,
                  icon: 'mdi mdi-home',
                  // badge: { variant: 'success', text: '9+' },
                  url: `/${this.loggedInUser.org_data[0].id}/dashboard`,
              },

              ...prod,
           
            ];
            this.menuItems.push({
              key: 'task-kanban',
              label: 'Settings',
              icon: 'dripicons-gear',
              url: `/${this.loggedInUser.org_data[0].id}/settings`,
              // parentKey: 'apps-tasks',
            },
            {
              key: 'task-kanban',
              label: 'Vitals Dasboard',
              icon: 'mdi mdi-application',
              url: `/${this.loggedInUser.org_data[0].id}/admin-dashboard`,
            }
            )       
          }});

        
      }
    }
    // this.initMenu();


    }

    // this.adminService.httpLoading$.subscribe(
		//  (httpInProgress:boolean) => {
    //     this.orglogin=httpInProgress;
    //     let data:any =  JSON.parse(sessionStorage.getItem('currentUser')!);
    //     if(data[0].hasOwnProperty('orglogin')){
    //       this.orglogin=true;
    //     }
		// 		this.cdr.detectChanges();
		// 	}
		// );

  

  ngOnChanges(): void {


    if (this.includeUserProfile) {
      changeBodyAttribute('data-sidebar-user', 'true');
    }
    else {
      changeBodyAttribute('data-sidebar-user', 'false');
    }
  }

  /**
   * On view init - activating menuitems
   */
  ngAfterViewInit() {

    setTimeout(() => {
      this._activateMenu();
    });
  }
  /**
   * initialize menuitems
   */
  initMenu(): void {
    this.menuItems = MENU_ITEMS;
  }

  /**
   * Returns true or false if given menu item has child or not
   * @param item menuItem
   */
  hasSubmenu(menu: MenuItem): boolean {
    return menu.children ? true : false;
  }

  /**
   * activates menu
   */
  _activateMenu(): void {
    const div = document.getElementById('side-menu');
    let matchingMenuItem = null;

    if (div) {
      let items: any = div.getElementsByClassName('side-nav-link-ref');
      for (let i = 0; i < items.length; ++i) {
        if (window.location.pathname === items[i].pathname) {
          matchingMenuItem = items[i];
          break;
        }
      }

      if (matchingMenuItem) {
        const mid = matchingMenuItem.getAttribute('data-menu-key');
        const activeMt = findMenuItem(this.menuItems, mid);
        if (activeMt) {

          const matchingObjs = [activeMt['key'], ...findAllParent(this.menuItems, activeMt)];

          this.activeMenuItems = matchingObjs;

          this.menuItems.forEach((menu: MenuItem) => {
            menu.collapsed = !matchingObjs.includes(menu.key!);
          });
        }
      }
    }
  }

  /**
   * toggles open menu
   * @param menuItem clicked menuitem
   * @param collapse collpase instance
   */
  toggleMenuItem(menuItem: MenuItem, collapse: NgbCollapse): void {
    collapse.toggle();
    let openMenuItems: string[];
    if (!menuItem.collapsed) {
      openMenuItems = ([menuItem['key'], ...findAllParent(this.menuItems, menuItem)]);
      this.menuItems.forEach((menu: MenuItem) => {
        if (!openMenuItems.includes(menu.key!)) {
          menu.collapsed = true;
        }
      })
    }

  }

  /**
   * Hides the menubar
   */
  hideMenu() {
    document.body.classList.remove('sidebar-enable');
  }
}
