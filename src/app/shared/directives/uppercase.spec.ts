import { Component, input } from '@angular/core';
import { UppercaseDirective } from './uppercase';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

@Component({
  imports: [ReactiveFormsModule, UppercaseDirective],
  template: ` <input id="input-text" [formControl]="control" uppercase />`,
})
class TestComponent {
  control = new FormControl('');
}

describe('UppercaseDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let input: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;

    input = fixture.debugElement.query(By.css('#input-text')).nativeElement;
    fixture.detectChanges();
  });

  it('should transform value to uppercase text', () => {
    input.value = 'super hero';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    expect(input.value).toBe('SUPER HERO');
  });
});
