import {Component, Input, OnInit} from '@angular/core';
import {User} from "../models/user";
import {Router} from "@angular/router";


interface Tab {
  name: string;
  route: string;
}

interface MenuItem {
  name: string;
  route: string;
}

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})

export class NavBarComponent implements OnInit {

  @Input() user: User;

  activeTab: Tab;
  tabs: Array<Tab> = [];
  menuItems: Array<MenuItem> = [];

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    this.tabs = [
      {
        name: 'Home',
        route: `${this.user?.username}/home`
      },
      {
        name: 'Categories',
        route: `${this.user?.username}/categories`
      }
    ];
    this.activeTab = this.tabs[0];

    this.menuItems = [
      {
        name: 'Edit Profile',
        route: `${this.user?.username}/edit-profile`
      },
      {
        name: 'Write Blog',
        route: `${this.user?.username}/write`
      },
    ]
  }

  async selectTab(tab: Tab): Promise<void> {
    this.activeTab = tab;
    await this.router.navigate([`${tab.route}`]);
  }

  async selectMenuItem(menuItem: MenuItem): Promise<void> {
    await this.router.navigate([`${menuItem.route}`]);
  }

}
