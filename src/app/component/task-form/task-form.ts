import {
  Component,
  EventEmitter,
  Output
} from '@angular/core';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-form',

  standalone: true,

  imports: [FormsModule],

  templateUrl: './task-form.html',

  styleUrl: './task-form.css'
})

export class TaskFormComponent {

  @Output()
  saveTask = new EventEmitter<any>();

  task = {

    title: '',
    description: ''

  };

  submitForm() {

    this.saveTask.emit(this.task);

    this.task = {

      title: '',
      description: ''

    };

  }

}