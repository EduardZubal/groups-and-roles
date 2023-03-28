import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import * as uuid from 'uuid';
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { ApiGroupService } from '../../../../services/api-group.service';
import { UntypedFormControl, Validators } from '@angular/forms';
import { AppToastService } from '../../../../../common/app-toast/app-toast.service';

@UntilDestroy()
@Component({
  selector: 'app-new-group-modal',
  templateUrl: './new-group-modal.component.html',
  styleUrls: ['./new-group-modal.component.scss'],
  providers: [DialogService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewGroupModalComponent {

  public groupName = new UntypedFormControl('', { validators: [Validators.required] });

  constructor(
    public ref: DynamicDialogRef,
    private _apiGroupService: ApiGroupService,
    private _appToastService: AppToastService,
  ) {}

  public saveChanges(): void {
    if (!this.groupName.value.trim()) {
      this.groupName.markAsTouched();
      return;
    }

    const newGroup = {
      id: uuid.v4(),
      label: this.groupName.value,
    };

    this._apiGroupService
      .bulkAdd([newGroup])
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => this.ref.close(newGroup),
        error: (error) => this._appToastService.error(error),
      });
  }

}
