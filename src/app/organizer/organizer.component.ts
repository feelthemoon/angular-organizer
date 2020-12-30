import { Component, OnInit } from '@angular/core';
import { DateService } from '../shared/date.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TaskService } from '../shared/task.service';
import { Task } from '../shared/models/task.model';
import { switchMap } from 'rxjs/operators';
import * as moment from 'moment';


@Component({
  selector: 'app-organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.scss'],
})
export class OrganizerComponent implements OnInit {
  form: FormGroup;
  tasks: Task[] = [];
  now: string;
  isAvailable: boolean;
  constructor(
    private dateService: DateService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.dateService.date
      .pipe(switchMap((value) => this.taskService.load(value)))
      .subscribe((tasks) => {
        this.tasks = tasks;
      });
    this.form = new FormGroup({
      title: new FormControl('', Validators.required),
    });
    this.now = moment(this.dateService.date.value).format('YYYY-MM-DD');
  }
  get date(): DateService {
    const current = moment(this.dateService.date.value).format('YYYY-MM-DD');
    this.isAvailable = moment(current).isBefore(this.now);
    return this.dateService;
  }

  submit(): void {
    const { title } = this.form.value;
    const task: Task = {
      title,
      date: this.dateService.date.value.format('DD-MM-YYYY'),
    };
    this.taskService.create(task).subscribe(
      (t: Task) => {
        this.tasks.push(t);
        this.form.reset();
      },
      (error) => console.error(error)
    );
  }
  remove(task: Task): void {
    this.taskService.remove(task).subscribe(
      () => {
        this.tasks = this.tasks.filter((t) => t.id !== task.id);
      },
      (error) => console.error(error)
    );
  }
}
