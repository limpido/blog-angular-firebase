import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {User} from "../models/user";
import {Router} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {SignUpModalComponent} from "../modals/sign-up-modal/sign-up-modal.component";
import {MatDialog} from "@angular/material/dialog";
import {LogInModalComponent} from "../modals/log-in-modal/log-in-modal.component";

interface Tab {
  name: string;
  route: string;
}

interface MenuItem {
  name: string;
  route?: string;
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
  @Input() author: User;
  @Input() activeTabIndex: number;
  @Input() isBase: boolean;
  @Output() activeTabChange: EventEmitter<number> = new EventEmitter<number>();

  activeTab: Tab;
  tabs: Array<Tab> = [];
  menuItems: Array<MenuItem> = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    public dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    this.tabs = [
      {
        name: 'Home',
        route: `${this.author?.uid ?? this.user?.uid}`
      },
      {
        name: 'Categories',
        route: `${this.author?.uid ?? this.user?.uid}/categories`
      }
    ];
    this.activeTab = this.tabs[this.activeTabIndex];

    this.menuItems = [
      {
        name: 'My Blog',
        route: `/`
      },
      {
        name: 'Edit Profile',
        route: `/edit-profile`
      },
      {
        name: 'Write Blog',
        route: `/write`
      },
      {
        name: 'Log out'
      }
    ];
  }

  async selectTab(tab: Tab): Promise<void> {
    this.activeTab = tab;
    if (this.isBase) {
      this.activeTabChange.emit(this.tabs.indexOf(tab));
    } else {
      await this.router.navigate([`${tab.route}`]);
    }
  }

  async selectMenuItem(menuItem: MenuItem): Promise<void> {
    if (menuItem.route) {
      await this.router.navigate([`${this.user.uid}${menuItem.route}`]);
    } else {
      await this.authService.signOut();
    }
    window.location.reload();
  }

  signUp(): void {
    const signupModal = this.dialog.open(SignUpModalComponent, {
      width: '400px',
    });

    signupModal.afterClosed().subscribe(async (res) => {
      if (res?.submitted) {
        await this.router.navigate([`/sign-up-verification-email-sent`]);
      }
    });
  }

  logIn(): void {
    const loginModal = this.dialog.open(LogInModalComponent, {
      width: '400px',
    });

    loginModal.afterClosed().subscribe(async user => {
      if (user) {
        window.location.reload();
      }
    })
  }
}
