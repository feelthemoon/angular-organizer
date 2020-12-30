import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task } from './models/task.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as moment from 'moment';
interface CreateResponse {
  name: string;
}
@Injectable({
  providedIn: 'root',
})
export class TaskService {
  static URL =
    'https://organizer-f858c-default-rtdb.europe-west1.firebasedatabase.app/tasks';
  constructor(private http: HttpClient) {}
  load(date: moment.Moment): Observable<Task[]>{
    return this.http
      .get<Task[]>(`${TaskService.URL}/${date.format('DD-MM-YYYY')}.json`)
      .pipe(
        map((tasks) => {
          return !tasks
            ? []
            : Object.keys(tasks).map((key) => ({ ...tasks[key], id: key }));
        })
      );
  }
  create(task: Task): Observable<Task> {
    return this.http
      .post<CreateResponse>(`${TaskService.URL}/${task.date}.json`, task)
      .pipe(
        map((r) => {
          return { ...task, id: r.name };
        })
      );
  }
  remove(task: Task): Observable<void>{
    return this.http.delete<void>(`${TaskService.URL}/${task.date}/${task.id}.json`);
  }
}
