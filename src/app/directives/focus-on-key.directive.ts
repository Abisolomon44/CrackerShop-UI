import { Directive, HostListener, Input, ElementRef, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[appFocusOnKey]',
  standalone: true
})
export class FocusOnKeyDirective implements AfterViewInit {
  @Input('appFocusOnKey') targetId!: string;
  @Input() autoSelectNext: boolean = false;
  @Input() autoFocus: boolean = false; 
  @Input() delay: number = 0;         

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    if (this.autoFocus) {
      setTimeout(() => {
        this.focusElement(this.el.nativeElement);
      }, this.delay);
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      const targetElement = document.getElementById(this.targetId) as HTMLElement | null;
      if (targetElement) {
        this.focusElement(targetElement);
      }
    }
  }

  private focusElement(element: HTMLElement) {
    element.focus();
    if (this.autoSelectNext &&
        (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA')) {
      (element as HTMLInputElement | HTMLTextAreaElement).select();
    }
  }
}
