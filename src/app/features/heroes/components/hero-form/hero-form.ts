import { Component, effect, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { CreateHero, Hero, HeroUniverse } from '../../../../core/models/hero.model';

@Component({
  selector: 'app-hero-form',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './hero-form.html',
  styleUrl: './hero-form.scss',
})
export class HeroForm {
  readonly hero = input<Hero | null>(null);
  readonly save = output<CreateHero>();
  readonly cancel = output<void>();

  protected readonly universes: HeroUniverse[] = ['Marvel', 'DC', 'Independent'];

  protected readonly form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2), Validators.maxLength(50)],
    }),

    realName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(50)],
    }),

    universe: new FormControl<HeroUniverse>('Marvel', {
      nonNullable: true,
      validators: [Validators.required],
    }),

    description: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(10), Validators.maxLength(500)],
    }),

    powers: new FormControl('', {
      nonNullable: true,
    }),
  });

  private readonly populateFormEffect = effect(() => {
    const hero = this.hero();

    if (!hero) {
      this.form.reset({
        name: '',
        realName: '',
        universe: 'Marvel',
        description: '',
        powers: '',
      });

      return;
    }

    this.form.reset({
      name: hero.name,
      realName: hero.realName,
      universe: hero.universe,
      description: hero.description,
      powers: hero.powers.join(', '),
    });
  });

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    this.save.emit({
      ...value,
      powers: value.powers
        .split(',')
        .map((power) => power.trim())
        .filter(Boolean),
    });
  }
}
