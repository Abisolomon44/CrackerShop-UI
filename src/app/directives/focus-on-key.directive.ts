import { Directive, HostListener, Input, ElementRef } from '@angular/core';

@Directive({
  selector: '[appFocusOnKey]',
  standalone: true
})
export class FocusOnKeyDirective {
  @Input('appFocusOnKey') targetId!: string;

  @Input() autoSelectNext: boolean = false;

  constructor(private el: ElementRef) {}

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault(); 

      const targetElement = document.getElementById(this.targetId) as HTMLElement | null;
      if (targetElement) {
        targetElement.focus();

        if (this.autoSelectNext &&
            (targetElement.tagName === 'INPUT' || targetElement.tagName === 'TEXTAREA')) {
          (targetElement as HTMLInputElement | HTMLTextAreaElement).select();
        }
      }
    }
  }
}
