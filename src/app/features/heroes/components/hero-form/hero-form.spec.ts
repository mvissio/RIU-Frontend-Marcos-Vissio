import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Hero } from '../../../../core/models/hero.model';
import { HeroForm } from './hero-form';

describe('HeroForm', () => {
  let component: HeroForm;
  let fixture: ComponentFixture<HeroForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroForm],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroForm);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not submit an invalid form', () => {
    let emitted = false;

    component.save.subscribe(() => {
      emitted = true;
    });

    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;

    form.dispatchEvent(new Event('submit'));

    expect(emitted).toBe(false);
  });

  it('should emit hero data when form is valid', () => {
    let emittedValue: unknown;

    component.save.subscribe((value) => {
      emittedValue = value;
    });

    const controls = component['form'].controls;

    controls.name.setValue('Daredevil');
    controls.realName.setValue('Matt Murdock');
    controls.universe.setValue('Marvel');
    controls.description.setValue('Héroe de Hell Kitchen.');
    controls.powers.setValue('Sentidos, Combate');

    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;

    form.dispatchEvent(new Event('submit'));

    expect(emittedValue).toEqual({
      name: 'Daredevil',
      realName: 'Matt Murdock',
      universe: 'Marvel',
      description: 'Héroe de Hell Kitchen.',
      powers: ['Sentidos', 'Combate'],
    });
  });

  it('should populate the form when editing a hero', () => {
    const hero: Hero = {
      id: '100',
      name: 'Batman',
      realName: 'Bruce Wayne',
      universe: 'DC',
      description: 'Héroe de Gotham.',
      powers: ['Combate', 'Tecnología'],
      createdAt: new Date('2026-01-01'),
    };

    fixture.componentRef.setInput('hero', hero);
    fixture.detectChanges();

    expect(component['form'].getRawValue()).toEqual({
      name: 'Batman',
      realName: 'Bruce Wayne',
      universe: 'DC',
      description: 'Héroe de Gotham.',
      powers: 'Combate, Tecnología',
    });
  });

  it('should emit cancel', () => {
    let emitted = false;

    component.cancel.subscribe(() => {
      emitted = true;
    });

    component.cancel.emit();

    expect(emitted).toBe(true);
  });
});
