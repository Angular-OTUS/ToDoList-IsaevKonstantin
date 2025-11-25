import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TuiGroup } from '@taiga-ui/core';
import { TuiBlock } from '@taiga-ui/kit';

@Component({
  selector: 'home',
  imports: [RouterModule, ReactiveFormsModule, CommonModule, TuiBlock, TuiGroup, TranslateModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  private translate = inject(TranslateService);
  private savedLang = localStorage.getItem('lang') || 'ru';

  protected languageForm = new FormGroup({
    languageValue: new FormControl(this.savedLang),
  })
  protected language = toSignal(this.languageForm.valueChanges, {
    initialValue: this.languageForm.value
  });

  constructor() {
    effect(() => {
      const current = this.language().languageValue;
      if (!current) return;

      this.translate.use(current);
      localStorage.setItem('lang', current);
    });
  }
}
