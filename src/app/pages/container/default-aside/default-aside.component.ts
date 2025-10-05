import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Colors } from '../../color'; // adjust path as needed
import { NAV_ITEMS, NavItem } from '../nav';
import { CommonserviceService } from '../../../services/commonservice.service';
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
  
}
