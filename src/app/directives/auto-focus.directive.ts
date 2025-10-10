import { Directive, ElementRef, Input, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appAutoFocus]',
  standalone: true
})
export class AutoFocusDirective implements AfterViewInit, OnChanges {

  @Input('appAutoFocus') shouldFocus: boolean = false;

  @Input() autoSelect: boolean = false;

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    if (this.shouldFocus) {
      this.focusElement();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['shouldFocus']?.currentValue) {
      setTimeout(() => this.focusElement(), 50);
    }
  }

  focusElement(): void {
    if (this.el?.nativeElement) {
      this.el.nativeElement.focus();
      if (this.autoSelect) {
        this.el.nativeElement.select();
      }
    }
  }
}
