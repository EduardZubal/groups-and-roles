import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastModule } from "primeng/toast";
import { MessageService } from "primeng/api";

import { AppToastComponent } from './app-toast.component';
import {AppToastService} from "./app-toast.service";

@NgModule({
  declarations: [AppToastComponent],
  imports: [CommonModule, ToastModule],
  providers: [MessageService, AppToastService],
  exports: [AppToastComponent]
})
export class AppToastModule { }
