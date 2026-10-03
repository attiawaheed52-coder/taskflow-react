import {
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { Taskservice } from '../../services/task';

import { Task } from '../../model/task.model';

@Component({
  selector: 'app-task-list',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './task-list.html',

  styleUrl: './task-list.css'
})

export class TaskListComponent
implements OnInit {

  taskService = inject(Taskservice);

  tasks = this.taskService.tasks;

  editingtask = signal<any>(null);

  ngOnInit() {

    this.taskService.loadTask();

  }

  // EDIT BUTTON
  editTask(task: Task) {

    this.editingtask.set({
      ...task
    });

  }

  // SAVE BUTTON
  saveTask() {

    this.taskService.editTask(
      this.editingtask()
    );

    this.editingtask.set(null);

  }

  // DELETE
  removeTask(id:number){

    this.taskService.deleteTask(id);

  }

}