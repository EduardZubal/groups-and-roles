import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import * as uuid from 'uuid';
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { ApiRolesService } from '../../../../../permissions/services/api-roles.service';
import { RoleItemI, RolesI, ROLE_NAME } from '../../../../../permissions/models/roles.model';
import { Observable } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { AppToastService } from '../../../../../common/app-toast/app-toast.service';

type FormValues = Pick<RoleItemI, 'name' | 'active' | 'roleName'>;


@UntilDestroy()
@Component({
  selector: 'app-form-modal',
  templateUrl: './form-modal.component.html',
  styleUrls: ['./form-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormRolesModalComponent implements OnInit {
  public roles$: Observable<RolesI[]> = this._apiRolesService.getRoles();

  public form = this._fb.group({
    name: ['', Validators.required],
    active: [false],
    roleName: [ROLE_NAME.Admin, Validators.required],
  });

  constructor(
    public ref: DynamicDialogRef,
    private _config: DynamicDialogConfig,
    private _fb: FormBuilder,
    private _apiRolesService: ApiRolesService,
    private _appToastService: AppToastService,
  ) { }

  public ngOnInit(): void {
    if (this._config.data?.role) {
      this.form.patchValue({
        name: this._config.data.role.name,
        active: this._config.data.role.active,
        roleName: this._config.data.role.roleName
      });
    }
  }

  public saveChanges(): void {
    if (this._config.data.role) {
      this._editRole();

    } else {
      this._createRole();
    }
  }

  private _createRole(): void {
    const { name, active, roleName } = this.form.getRawValue() as FormValues;
    const newRole: RoleItemI = {
      id: uuid.v4(),
      name: name,
      groupId: this._config.data.groupId,
      active: active,
      roleName: roleName,
    };

    this._apiRolesService
      .bulkAdd([newRole])
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => this.ref.close(),
        error: (error) => this._appToastService.error(error)
      });
  }

  private _editRole(): void {
    const { name, active, roleName } = this.form.getRawValue() as FormValues;
    const editRole: RoleItemI = {
      id: this._config.data.role.id,
      name: name,
      groupId: this._config.data.groupId,
      active: active,
      roleName: roleName,
    };

    this._apiRolesService
      .update(editRole)
      .subscribe({
        next: () => this.ref.close(),
        error: (error) => this._appToastService.error(error)
      });
  }

}
