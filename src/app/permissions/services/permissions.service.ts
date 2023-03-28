import { Injectable } from '@angular/core';
import {BehaviorSubject, Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {
  public groupId$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  //  Update view on group and roles deleted.
  public updateView$: Subject<void> = new Subject<void>();

  constructor() { }

}
