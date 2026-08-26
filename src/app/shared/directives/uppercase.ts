import { Directive, ElementRef, HostListener, inject } from '@angular/core';

@Directive({
  selector: '[uppercase]',
})
export class UppercaseDirective {
  private readonly _el = inject(ElementRef<HTMLInputElement>);

  @HostListener('input')
  onInput() {
    const input = this._el.nativeElement;
    const uppercaseValue = input.value.toUpperCase();

    if (input.value === uppercaseValue) {
      return;
    }
    input.value = uppercaseValue;
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }
}
