import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class Taskservice {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000/tasks';

  tasks = signal<any[]>([]);

  // LOAD TASKS
  loadTask() {

    this.http.get<any[]>(this.apiUrl)
      .subscribe(data => {

        this.tasks.set(data);

      });

  }

  // ADD TASK
  addTask(task:any) {

    this.http.post(this.apiUrl, task)
      .subscribe(() => {

        this.loadTask();

      });

  }

  // EDIT TASK
  editTask(task: any) {

    this.http.put(
      `${this.apiUrl}/${task.id}`,
      task
    ).subscribe(() => {

      this.loadTask();

    });

  }

  // DELETE TASK
  deleteTask(id:number) {

    this.http.delete(
      `${this.apiUrl}/${id}`
    ).subscribe(() => {

      this.loadTask();

    });

  }

}