import { Component, OnInit } from '@angular/core';
import { Week } from '../shared/models/week.model';
import { DateService } from '../shared/date.service';
import * as moment from 'moment';
import { TaskService } from '../shared/task.service';
import { switchMap } from 'rxjs/operators';
import { Task } from '../shared/models/task.model';
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  private calendar: Week[];
  private tasks: Task[];
  constructor(
    private dateService: DateService,
    private taskService: TaskService
  ) {}
  get getCalendar(): Week[] {
    return this.calendar;
  }
  ngOnInit(): void {
    this.dateService.date.subscribe(this.generate.bind(this));
  }
   generate(now: moment.Moment): void{
    const startDay = now.clone().startOf('month').startOf('week');
    const endDay = now.clone().endOf('month').endOf('week');
    const date = startDay.clone().subtract(1, 'day');
    const calendar = [];

    while (date.isBefore(endDay, 'day')) {
      calendar.push({
        days: Array(7)
          .fill(0)
          .map((day) => {
            const value = date.add(1, 'day').clone();
            const active = moment().isSame(value, 'date');
            const disabled = !now.isSame(value, 'month');
            const selected = now.isSame(value, 'date');
            const hasTask = day.hasTask ?? false;
            return {
              value,
              active,
              disabled,
              selected,
              hasTask,
            };
          }),
      });
    }

    this.calendar = calendar;
  }
  select(day: moment.Moment): void {
    this.dateService.changeDate(day);
  }
}
