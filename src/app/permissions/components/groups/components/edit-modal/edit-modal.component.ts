import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { ApiGroupService } from '../../../../services/api-group.service';
import { GroupI } from '../../../../models/group.model';
import { NewGroupModalComponent } from '../new-group-modal/new-group-modal.component';
import { ConfirmationService } from 'primeng/api';
import { catchError, forkJoin, from, map, switchMap, take, throwError } from 'rxjs';
import { PermissionsService } from '../../../../../permissions/services/permissions.service';
import { ApiRolesService } from '../../../../../permissions/services/api-roles.service';
import { AppToastService } from '../../../../../common/app-toast/app-toast.service';
import { Router } from '@angular/router';

@UntilDestroy()
@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.scss'],
  providers: [DialogService, ConfirmationService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditGroupModalComponent implements OnInit {
  @ViewChild('TableRef') TableRef!: Table;

  public tableData: GroupI[] = [];
  public selectedGroups: GroupI[] = [];

  constructor(
    public ref: DynamicDialogRef,
    private _dialogService: DialogService,
    private _cdr: ChangeDetectorRef,
    private _router: Router,
    private _confirmationService: ConfirmationService,
    private _config: DynamicDialogConfig,
    private _apiGroupService: ApiGroupService,
    private _permissionsService: PermissionsService,
    private _apiRolesService: ApiRolesService,
    private _appToastService: AppToastService,
  ) {}

  public ngOnInit(): void {
    this.tableData = this._config.data;
  }

  public deleteGroup(event: Event, id: string = ''): void {
    this._confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure that you want to delete?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this._deleteGroups(id),
    });
  }

  public newGroup(): void {
    const ref = this._dialogService.open(NewGroupModalComponent, {
      header: 'Create new group',
      width: '500px',
    });

    ref.onClose.subscribe({
      next: (res) => {
        if (res) {
          this.tableData.unshift(res);
          this._cdr.detectChanges();
         }
      }
    });
  }

  public updateGroup(item: GroupI): void {
    this._apiGroupService
      .update({
        id: item.id,
        label: item.label,
      })
      .subscribe({
        next: () => this._appToastService.success('Group is updated'),
        error: (error) => this._appToastService.error(error),
      });
  }

  private _deleteGroups(id: string): void {
    let deletedGroups = [];
    let keys: string[] = [];
    let msg = 'Groups are success deleted!';

    if (!id) {
      deletedGroups = this.tableData.filter((el) => this.selectedGroups.some((selected) => selected.id === el.id));
      keys = deletedGroups.map((el) => el.id);

    } else {
      keys.push(id);
      msg = 'Group is deleted';
    }

    this._apiGroupService
      .bulkDelete(keys)
      .pipe(
        untilDestroyed(this),
        switchMap(() => {
          return forkJoin([
            from(keys).pipe(
              map((id) => {
                this._bulkDeleteRolesByGroupId(id);
                return id;
              })
            )
          ])
        }),
        catchError((error) => throwError(() => new Error(error))),
      )
      .subscribe({
        next: () => {
          this.ref.close();
          this._appToastService.success(msg);
        },
        error: (error) => this._appToastService.error(error),
      });
  }

  /*
  * The method simulates server behavior for deleting roles with the group.
  */
  private _bulkDeleteRolesByGroupId(groupId: string): void {
    this._apiRolesService.getAllByGroup(groupId)
      .pipe(
        take(1),
        map((arr) => arr.map((item) => item.id)),
        switchMap((rolesIds) => this._apiRolesService.bulkDelete(rolesIds)),
        catchError((error) => throwError(() => new Error(error))),
      )
      .subscribe({
        next: () => {
          this._permissionsService.updateView$.next();
          this._clearQueryParam();
        },
        error: (error) => this._appToastService.error(error),
      });
  }

  private _clearQueryParam(): void {
    this._router.navigate(
      ['/'],
      { queryParams: { groupId: null } }
    );
  }

}
