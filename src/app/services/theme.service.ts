import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

export enum ColorTheme {
  Light = 'merchant-light',
  Dark = 'merchant-dark'
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  public _theme: BehaviorSubject<ColorTheme> = new BehaviorSubject<ColorTheme>(ColorTheme.Light);

  get theme(): ColorTheme {
    return this._theme.getValue();
  }

  set theme(theme: ColorTheme) {
    this._theme.next(theme);
  }

  get themeChanges$(): Observable<ColorTheme> {
    return this._theme.asObservable();
  }

  private renderer: Renderer2;

  constructor(
    @Inject(DOCUMENT) private document: Document,
   private rendererFactory: RendererFactory2,
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
    const theme = localStorage.getItem("permissions-app-theme") as ColorTheme;
    if (theme) {
      this.switchTheme(theme);
    }
  }

  public switchTheme(theme: ColorTheme): void {
    const themeLink = this.document.getElementById('app-theme') as HTMLLinkElement;

    if (themeLink) {
      this.theme = theme;
      themeLink.href = `assets/scss/theme/${theme}.css`;
      localStorage.setItem("permissions-app-theme", theme);
    }

    if (theme === ColorTheme.Dark) {
        this._addThemeClass();
    } else {
        this._deleteThemeClass();
    }
  }

    private _addThemeClass(): void {
        const el = this.document.querySelector('body');
        this.renderer?.addClass(el, 'theme-dark')
    }

    private _deleteThemeClass(): void {
        const el = this.document.querySelector('body');
        this.renderer?.removeClass(el, 'theme-dark');
    }

}
