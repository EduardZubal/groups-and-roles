import { InjectionToken, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupsComponent } from './components/groups/groups.component';
import { RolesTableComponent } from './components/roles-table/roles-table.component';
import { EditGroupModalComponent } from './components/groups/components/edit-modal/edit-modal.component';
import { NewGroupModalComponent } from './components/groups/components/new-group-modal/new-group-modal.component';
import { FormRolesModalComponent } from './components/roles-table/components/form-modal/form-modal.component';

import { DBConfig, NgxIndexedDBModule } from 'ngx-indexed-db';
import { PermissionsComponent } from './permissions.component';
import { PermissionsRoutingModule } from "./permissions-routing.module";
import { PanelMenuModule } from "primeng/panelmenu";
import { TableModule } from 'primeng/table';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';

const DB_STORE_GROUP = 'Groups';
const DB_STORE_ROLES = 'Roles';
export const DB_STORE_GROUP_TOKEN = new InjectionToken<string>('');
export const DB_STORE_ROLES_TOKEN = new InjectionToken<string>('');

// https://www.npmjs.com/package/ngx-indexed-db
const dbConfig: DBConfig = {
  name: 'PermissionsTest',
  version: 1,
  objectStoresMeta: [{
    store: DB_STORE_GROUP,
    storeConfig: { keyPath: 'id', autoIncrement: true },
    storeSchema: [
      {
        name: 'label',
        keypath: 'id',
        options: { unique: false }
      },
    ]
  },
  {
    store: DB_STORE_ROLES,
    storeConfig: { keyPath: 'id', autoIncrement: true },
    storeSchema: [
      {
        name: 'label',
        keypath: 'id',
        options: { unique: false }
      },
    ]
  }]
};

@NgModule({
  declarations: [
    PermissionsComponent,
    GroupsComponent,
    RolesTableComponent,
    EditGroupModalComponent,
    NewGroupModalComponent,
    FormRolesModalComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PermissionsRoutingModule,
    NgxIndexedDBModule.forRoot(dbConfig),
    PanelMenuModule,
    TableModule,
    DynamicDialogModule,
    InputTextModule,
    ButtonModule,
    ToolbarModule,
    ConfirmPopupModule,
    MessagesModule,
    MessageModule,
    DropdownModule,
    InputSwitchModule
  ],
  providers: [
    { provide: DB_STORE_GROUP_TOKEN, useValue: DB_STORE_GROUP, multi: true },
    { provide: DB_STORE_ROLES_TOKEN, useValue: DB_STORE_ROLES, multi: true },
  ],
  exports: [PermissionsComponent]
})
export class PermissionsModule {}
