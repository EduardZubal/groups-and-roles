import { Injectable } from '@angular/core';
import {MessageService} from "primeng/api";

@Injectable()
export class AppToastService {
  constructor(private messageService: MessageService) {}

  public success(msg?: string, details?: string): void {
    this.messageService.add({ severity: 'success', summary: msg, detail: details });
  }

  public info(msg?: string, details?: string): void {
    this.messageService.add({ severity: 'info', summary: msg, detail: details });
  }

  public warn(msg?: string, details?: string): void {
    this.messageService.add({ severity: 'warn', summary: msg, detail: details });
  }

  public error(msg?: string, details?: string): void {
    this.messageService.add({ severity: 'error', summary: msg, detail: details });
  }

  public clear(): void {
    this.messageService.clear();
  }
}
