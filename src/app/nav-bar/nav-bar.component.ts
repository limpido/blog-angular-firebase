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

export enum Tabs {
  home,
  category
}

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})

export class NavBarComponent implements OnInit {

  @Input() user: User;
  @Input() activeTabIndex: number;

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
        route: `${this.user?.uid}`
      },
      {
        name: 'Categories',
        route: `${this.user?.uid}/categories`
      }
    ];
    this.activeTab = this.activeTabIndex ? this.tabs[this.activeTabIndex] : this.tabs[Tabs.home];

    this.menuItems = [
      {
        name: 'Edit Profile',
        route: `${this.user?.uid}/edit-profile`
      },
      {
        name: 'Write Blog',
        route: `${this.user?.uid}/write`
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
