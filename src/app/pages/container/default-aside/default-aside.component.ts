import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Colors } from '../../color'; // adjust path as needed
import { NAV_ITEMS, NavItem } from '../nav';
import { CommonserviceService } from '../../../services/commonservice.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-default-aside',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './default-aside.component.html',
  styleUrls: ['./default-aside.component.css'],
})
export class DefaultAsideComponent {
  colors = Colors;
  navItems: NavItem[] = NAV_ITEMS;

  constructor(private commonService: CommonserviceService) {}

  ngOnInit() {
    const userId = Number(localStorage.getItem('userId'));
    const role = localStorage.getItem('role');  
    console.log('Logged in UserID:', userId, 'Role:', role);

    if (!userId) return;

    forkJoin({
      permissions: this.commonService.getPermissionsByUser(userId),
      modules: this.commonService.getAllModules()
    }).subscribe(({ permissions, modules }) => {
      console.log('Permissions from API:', permissions);
      console.log('All Modules from API:', modules);

      const mapToNavItem = (m: any): NavItem => ({
        label: m.label ?? 'Untitled',           // ensure label is always string
        route: m.route ?? undefined,            // convert null to undefined
        icon: m.icon ?? '',
        expanded: false,
        children: []
      });

      if (role === 'admin') {
        this.navItems = modules.map(mapToNavItem);
        console.log('Admin navItems:', this.navItems);
      } else if (permissions.length > 0) {
        const allowedIds = permissions[0].moduleID
          .split(',')
          .map(x => Number(x.trim()));
        console.log('Allowed Module IDs:', allowedIds);

        const allowedModules = modules.filter(m => allowedIds.includes(m.moduleID));
        console.log('Allowed Modules:', allowedModules);

        this.navItems = allowedModules.map(mapToNavItem);
        console.log('🎯 Client navItems:', this.navItems);
      }
    });
  }
}
