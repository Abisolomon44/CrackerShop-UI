import { Component } from '@angular/core';
import { Colors } from '../../color';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-default-header',
  imports: [FormsModule],
  templateUrl: './default-header.component.html',
  styleUrl: './default-header.component.css'
})
export class DefaultHeaderComponent {
 colors = Colors;
}
