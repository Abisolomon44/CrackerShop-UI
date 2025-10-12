import { Directive, HostListener, Input, ElementRef, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[appFocusOnKey]',
  standalone: true
})
export class FocusOnKeyDirective implements AfterViewInit {
  @Input('appFocusOnKey') targetId?: string;
  @Input() autoSelectNext: boolean = false;
  @Input() autoFocus: boolean = false; 
  @Input() delay: number = 0;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngAfterViewInit() {
    if (this.autoFocus) {
      setTimeout(() => this.focusElement(this.el.nativeElement), this.delay);
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();

      let targetElement: HTMLElement | null = null;

      // Use targetId if provided
      if (this.targetId) {
        targetElement = document.getElementById(this.targetId);
      } else {
        // fallback: next focusable element
        targetElement = this.getNextFocusable(this.el.nativeElement);
      }

      if (targetElement) this.focusElement(targetElement);
    }
  }

  private focusElement(element: HTMLElement) {
    element.focus();
    if (this.autoSelectNext && (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA')) {
      const inputEl = element as HTMLInputElement | HTMLTextAreaElement;
      if (!inputEl.readOnly) inputEl.select();
    }
  }

  private getNextFocusable(current: HTMLElement): HTMLElement | null {
    const focusable = Array.from(document.querySelectorAll<HTMLElement>(
      'input:not([type=hidden]):not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled])'
    ));
    const index = focusable.indexOf(current);
    if (index >= 0 && index < focusable.length - 1) return focusable[index + 1];
    return null;
  }
}
