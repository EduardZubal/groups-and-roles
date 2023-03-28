import { Inject, Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { map, Observable, of } from "rxjs";
import { GroupI } from '../models/group.model';
import { RoleItemI, RolesI, ROLE_NAME } from '../models/roles.model';
import { DB_STORE_ROLES_TOKEN } from '../permissions.module';


const filterByGroupId = (arr: any, groupId: string) => arr.filter((el: any) => el.groupId === groupId);

const ROLES = [
  {
    id: 1,
    value: ROLE_NAME.Admin
  },
  {
    id: 2,
    value: ROLE_NAME.Owner
  },
  {
    id: 3,
    value: ROLE_NAME.Moderator
  },
  {
    id: 4,
    value: ROLE_NAME.Guest
  }
];

@Injectable({
  providedIn: 'root'
})
export class ApiRolesService {
  constructor(
    private dbService: NgxIndexedDBService,
    @Inject(DB_STORE_ROLES_TOKEN) private readonly _dbStoreName: string
  ) { }

  /*
  *  Mock server data.
  */
  public getRoles(): Observable<RolesI[]> {
    return of(ROLES);
  }

  public getAllByGroup(groupId: string): Observable<RoleItemI[]> {
    return this.dbService
      .getAll<RoleItemI>(this._dbStoreName)
      .pipe(map((arr) => filterByGroupId(arr, groupId)));
  }

  public update(data: RoleItemI): Observable<RoleItemI> {
    return this.dbService.update(this._dbStoreName, data);
  }

  public bulkAdd(data: RoleItemI[]): Observable<number[]> {
    return this.dbService.bulkAdd(this._dbStoreName, data);
  }

  public bulkDelete(keys: string[]): Observable<number[]> {
    return this.dbService.bulkDelete(this._dbStoreName, keys);
  }

}
