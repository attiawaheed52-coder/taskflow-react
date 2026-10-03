<<<<<<< HEAD
import { Component, inject } from '@angular/core';

import { TaskFormComponent }
from './component/task-form/task-form';

import { TaskListComponent }
from './component/task-list/task-list';

import { Taskservice }
from './services/task';
=======
import { Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';
>>>>>>> 84ae4432729ae9468673bd85d8e5f7a33c3773b5

@Component({
  selector: 'app-root',

  standalone: true,

<<<<<<< HEAD
  imports: [
    TaskFormComponent,
    TaskListComponent
  ],
=======
  imports: [RouterOutlet],
>>>>>>> 84ae4432729ae9468673bd85d8e5f7a33c3773b5

  templateUrl: './app.html',

  styleUrl: './app.css'
})
<<<<<<< HEAD

export class App {

  taskService = inject(Taskservice);

  saveTask(task:any) {

    this.taskService.addTask(task);

  }

=======
export class App {

>>>>>>> 84ae4432729ae9468673bd85d8e5f7a33c3773b5
}