import { Directive, ElementRef, HostListener, inject } from '@angular/core';

@Directive({
  selector: '[uppercase]',
})
export class UppercaseDirective {
  private el = inject(ElementRef);

  @HostListener('input')
  onInput() {
    this.el.nativeElement.value = this.el.nativeElement.value.toUpperCase();
  }
}
