import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { skip, take } from 'rxjs';
import { AppToastService } from '../../../common/app-toast/app-toast.service';
import { GroupI } from '../../models/group.model';
import { ApiGroupService } from '../../services/api-group.service';
import { PermissionsService } from '../../services/permissions.service';
import { EditGroupModalComponent } from './components/edit-modal/edit-modal.component';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
  providers: [DialogService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupsComponent implements OnInit {
  public menuItems: MenuItem[] = [];

  constructor(
    private _dialogService: DialogService,
    private cdr: ChangeDetectorRef,
    private _apiGroupService: ApiGroupService,
    private _permissionsService: PermissionsService,
    private _route: ActivatedRoute,
    private _appToastService: AppToastService,
  ) { }

  public ngOnInit(): void {
    this._getQueryParams();
    this._updateMenu();
  }

  public openSettings(): void {
    const ref = this._dialogService.open(EditGroupModalComponent, {
      header: 'Groups settings',
      width: '75%',
      data: this.menuItems
    });

    ref.onClose.subscribe({
      next: () => this._updateMenu()
    });
  }

  private _updateMenu(): void {
    this._apiGroupService
      .getAll<GroupI>()
      .pipe(take(1))
      .subscribe({
        next: (groups: GroupI[]) => {
          this.menuItems = this._generateMenuItems(groups);
          this.cdr.detectChanges();
        },
        error: (error) => this._appToastService.error(error),
      });
  }

  private _generateMenuItems(data: GroupI[]): MenuItem[] {
   return data.map((item) => ({
      ...item,
     routerLink: '/',
     queryParams: { groupId: item.id },
     command: () => this._permissionsService.groupId$.next(item.id)
    }))
  }

  // skip(1) - because first params is always empty
  private _getQueryParams(): void {
    this._route.queryParams
      .pipe(
        skip(1),
        take(2)
      )
      .subscribe((param) => this._permissionsService.groupId$.next(param['groupId']));
  }
}
