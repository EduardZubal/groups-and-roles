import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { DialogService } from 'primeng/dynamicdialog';
import { InputSwitchOnChangeEvent } from 'primeng/inputswitch';
import { Table } from 'primeng/table';
import { take } from 'rxjs';
import { AppToastService } from '../../../common/app-toast/app-toast.service';
import { RoleItemI } from '../../models/roles.model';
import { ApiRolesService } from '../../services/api-roles.service';
import { PermissionsService } from '../../services/permissions.service';
import { FormRolesModalComponent } from './components/form-modal/form-modal.component';

@UntilDestroy()
@Component({
  selector: 'app-roles-table',
  templateUrl: './roles-table.component.html',
  styleUrls: ['./roles-table.component.scss'],
  providers: [DialogService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RolesTableComponent implements OnInit {
  @ViewChild('TableRef') tableRef!: Table;
  @ViewChild('InputFilter') inputFilter!: ElementRef;

  public tableData: RoleItemI[] = []
  public selectedRoles: RoleItemI[] = []

  private _groupId: string = '';

  constructor(
    private _permissionsService: PermissionsService,
    private _cdr: ChangeDetectorRef,
    private _dialogService: DialogService,
    private _apiRolesService: ApiRolesService,
    private _appToastService: AppToastService,
  ) {}

  set groupId(id: string) {
    this._groupId = id;
  }
  get groupId(): string {
    return this._groupId;
  }

  public ngOnInit(): void {
    this._permissionsService.groupId$
      .pipe(untilDestroyed(this))
      .subscribe((id) => {
        this.groupId = id;
        if (id) { this._getRoles(); }
        this._cdr.detectChanges();
      });

    this._permissionsService.updateView$
      .pipe(untilDestroyed(this))
      .subscribe(() => this._getRoles());
  }

  public deleteRoles(id: string = ''): void {
    let deletedGroups = [];
    let keys: string[] = [];
    let msg = 'Roles are success deleted!';

    if (!id) {
      deletedGroups = this.tableData.filter((el) => this.selectedRoles.some((selected) => selected.id === el.id));
      keys = deletedGroups.map((el) => el.id);

    } else {
      keys.push(id);
      msg = 'Role is deleted';
    }

    this._apiRolesService
      .bulkDelete(keys)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this._getRoles();
          this._appToastService.success(msg);
        },
        error: (error) => this._appToastService.error(error),
        complete: () => this.selectedRoles = []
      });
  }

  public openForm(role: RoleItemI | null = null): void {
    const ref = this._dialogService.open(FormRolesModalComponent, {
      header: `${role ? 'Edit' : 'Create' } role`,
      width: '400px',
      data: {
        role: role,
        groupId: this.groupId
      }
    });

    ref.onClose.subscribe({
      next: () => this._getRoles()
    });
  }

  public filterGlobalChangeValue(event: Event): void {
    this.tableRef.filterGlobal((event.target as HTMLInputElement)?.value, 'contains');
  }

  public clearFilter(): void {
    this.tableRef.clear();
    this.inputFilter.nativeElement.value = '';
  }

  public onChangeStatus(event: InputSwitchOnChangeEvent, roleItem: RoleItemI): void {
    const editRole: RoleItemI = {
      ...roleItem,
      active: event.checked
    };

    this._apiRolesService
      .update(editRole)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => { },
        error: (error) => this._appToastService.error(error)
      });
  }

  private _getRoles(): void {
    this._apiRolesService
      .getAllByGroup(this.groupId)
      .pipe(take(1))
      .subscribe({
        next: (groups: RoleItemI[]) => {
          this.tableData = groups;
          this._cdr.detectChanges();
        },
        error: (error) => this._appToastService.error(error)
      });
  }
}
