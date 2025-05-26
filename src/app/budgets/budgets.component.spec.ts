import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetsComponent } from './budgets.component';

describe('BudgetsComponent', () => {
  let component: BudgetsComponent;
  let fixture: ComponentFixture<BudgetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BudgetsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  //share code
//   <!-- <div class="flex flow-root p-4">
//   <div class="">
//     <span class="float-left">
//       <nz-avatar-group>
//         <span
//           class="-mr-1"
//           *ngFor="let user of budget.data.users; let i = index"
//         >
//           <nz-avatar
//             *ngIf="i < 2"
//             nz-tooltip [nzTooltipTitle]="user"
//             style="background-color: #9197f8"
//             nzIcon="user"
//           ></nz-avatar>
//         </span>
//       </nz-avatar-group>
//       <nz-avatar
//         *ngIf="budget.data.users.length > 2"
//         style="background-color: #9197f8; color: #c2c2c2"
//         [nzText]="'+' + (budget.data.users.length - 2)"
//       ></nz-avatar>
//       <span
//         class="text-white cursor-pointer ml-1"
//         (click)="onShare(budget)"
//         nz-tooltip nzTooltipTitle="Add user to budget"
//         nz-icon
//         style="
//           font-size: 20px;
//           border-radius: 50%;
//           padding: 6px;
//           background: #9197f8;
//         "
//         nzType="usergroup-add"
//         nzTheme="outline"
//       ></span>
//     </span>
//     <span class="text-gray-500 float-right">
//       <span
//         class="text-xs cursor-pointer text-gray-600 bg-gray-100 border border-gray-300 rounded-full px-2 py-1 hover:bg-gray-200"
//         nz-icon
//         nzType="right"
//         nzTheme="outline"
//         (click)="openOverview(budget.id)"
//       >
//         Overview
//       </span>
//     </span>
//   </div>
// </div> -->
});
