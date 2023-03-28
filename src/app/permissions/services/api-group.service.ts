import { Inject, Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import {Observable} from "rxjs";
import { GroupI } from '../models/group.model';
import { DB_STORE_GROUP_TOKEN } from '../permissions.module';

@Injectable({
  providedIn: 'root'
})
export class ApiGroupService {
  constructor(
    private dbService: NgxIndexedDBService,
    @Inject(DB_STORE_GROUP_TOKEN) private readonly _dbStoreName: string
  ) { }

  public getAll<T>(): Observable<T[]> {
    return this.dbService.getAll<T>(this._dbStoreName);
  }
  public bulkAdd(data: GroupI[]): Observable<number[]> {
    return this.dbService.bulkAdd(this._dbStoreName, data);
  }

  public update(data: GroupI): Observable<GroupI> {
    return this.dbService.update(this._dbStoreName, data);
  }

  public bulkDelete(keys: string[]): Observable<number[]> {
    return this.dbService.bulkDelete(this._dbStoreName, keys)
  }
}
