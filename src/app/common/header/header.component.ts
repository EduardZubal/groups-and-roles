import { CommonModule } from '@angular/common';
import {ChangeDetectionStrategy, Component, NgModule} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ColorTheme, ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {

  public theme = false;

  constructor(private themeService: ThemeService) {
    this.theme = this.themeService.theme === ColorTheme.Dark;
  }

  public onChangeTheme(): void {
    this.theme = !this.theme;
    this.themeService.switchTheme(this.theme
      ? ColorTheme.Dark
      : ColorTheme.Light
    );
  }
}

@NgModule({
  declarations: [
    HeaderComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    InputSwitchModule
  ],
  exports: [HeaderComponent],
})
export class HeaderModule { }
