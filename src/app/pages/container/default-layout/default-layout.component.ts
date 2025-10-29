import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DefaultHeaderComponent } from '../default-header/default-header.component';
import { DefaultAsideComponent } from '../default-aside/default-aside.component';
import { DefaultFooterComponent } from '../default-footer/default-footer.component';
@Component({
  selector: 'app-default-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DefaultHeaderComponent,
    DefaultFooterComponent
  ],
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.css']
})
export class DefaultLayoutComponent {



}
