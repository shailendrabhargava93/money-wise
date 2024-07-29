import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-warning-modal',
  templateUrl: './warning-modal.component.html',
  styleUrls: ['./warning-modal.component.css'],
})
export class WarningModalComponent {
  @Input() visible: boolean = false;
  @Output() closeModal: EventEmitter<any> = new EventEmitter<any>();

  close(): void {
    this.visible = false;
    this.closeModal.emit(this.visible);
  }
}
