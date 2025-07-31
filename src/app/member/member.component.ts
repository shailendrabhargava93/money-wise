import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AppService } from '../app.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  Component,
  Input,
  EventEmitter,
  Output,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import emailjs from '@emailjs/browser';
import { catchError, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-member-modal',
  templateUrl: './member.component.html',
})
export class MemberComponent {
  defaultImages = [
    'https://avatar.iran.liara.run/public/8',
    'https://avatar.iran.liara.run/public/17',
    'https://avatar.iran.liara.run/public/46',
    'https://avatar.iran.liara.run/public/37',
    'https://avatar.iran.liara.run/public/60',
    'https://avatar.iran.liara.run/public/64',
    'https://avatar.iran.liara.run/public/81',
    'https://avatar.iran.liara.run/public/85'
  ]
  private _visible: boolean = false;
  labels: any[] = [];
  private dataLoaded: boolean = false;

  constructor(private app: AppService, private message: NzMessageService) { }

  @Input()
  set visible(value: boolean) {
    this._visible = value;
    // Load data only when modal becomes visible and data hasn't been loaded yet
    if (value && !this.dataLoaded && !this.enableAdd) {
      this.loadMemberData();
    } else {
      this.labels = [{
        name: '',
        editing: true,
      },
      {
        name: '',
        editing: true,
      }
      ];
    }
  }

  @Input() enableAdd: boolean = false;

  get visible(): boolean {
    return this._visible;
  }

  @Output() closeModal: EventEmitter<any> = new EventEmitter<any>();

  close() {
    this._visible = false;
    this.closeModal.emit(this._visible);
  }

  updateMember(item: any) {
    if (item.name.trim() === '' || !item.avatar) {
      this.message.error('Please fill in all required fields');
      return;
    }
    this.app.userEmail.subscribe(email => {
      item['email'] = email;
      const data = {
        members: {
          name: item.name,
          avatar: item.avatar,
        },
        email: item.email
      }
      this.app.showSpinner();
      this.app.createMembers(data).subscribe({
        next: (res) => {
          this.app.hideSpinner();
          this.message.success('Member updated successfully');
          item.editing = false;
          const savedMembers = data.members;
          let existingMembers = JSON.parse(localStorage.getItem('members') || '[]');
          // Check if existingMembers is indeed an array
          if (!Array.isArray(existingMembers)) {
            existingMembers = [];
          }
          // Add savedMembers to the existing array
          existingMembers.push(savedMembers);

          localStorage.setItem('members', JSON.stringify(existingMembers));
          this.app.membersSub.next(existingMembers);
        },
        error: (err) => {
          console.error('Error updating member:', err);
          this.app.hideSpinner();
          this.message.error('Failed to update member');
        }
      });
    });
  }

  loadMemberData() {
    this.app.userEmail
      .pipe(
        switchMap((user) => this.app.getMembers(user as string)),
        catchError((error) => {
          console.error('Error occurred getMembers:', error);
          this.app.hideSpinner();
          return of([]);
        })
      )
      .subscribe((data) => {
        this.app.hideSpinner();
        const members = data as any[];
        if (members.length > 0) {
          this.labels = members;
        } else {
          this.labels = [];
        }
      });
  }
}
