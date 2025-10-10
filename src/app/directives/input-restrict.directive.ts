import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appInputRestrict]'
})
export class InputRestrictDirective {

    @Input('appInputRestrict') type: 'number' | 'letter' | 'text' | 'email' = 'text';

  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'Enter'];
    if (allowedKeys.includes(event.key)) return;

    const key = event.key;

    switch (this.type) {
      case 'number':
        if (!/^\d$/.test(key)) event.preventDefault();
        break;
      case 'letter':
        if (!/^[a-zA-Z]$/.test(key)) event.preventDefault();
        break;
      case 'text':
        if (!/^[a-zA-Z0-9 ]$/.test(key)) event.preventDefault();
        break;
      case 'email':
        // allow letters, numbers, @, ., -, _, + 
        if (!/^[a-zA-Z0-9@._+-]$/.test(key)) event.preventDefault();
        break;
    }
  }

}
