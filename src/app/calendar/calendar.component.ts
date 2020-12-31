import { Component, OnInit } from '@angular/core';
import { Week } from '../shared/models/week.model';
import { DateService } from '../shared/date.service';
import * as moment from 'moment';
import { TaskService } from '../shared/task.service';
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  private calendar: Week[];
  private created = false;
  constructor(
    private dateService: DateService,
    private taskService: TaskService
  ) {

  }
  get getCalendar(): Week[] {
    return this.calendar;
  }
  ngOnInit(): void {
    this.dateService.date.subscribe(this.generate.bind(this));
    this.taskService.created$.subscribe(created => {
      this.created = created;
      this.createdTask.bind(this)();
    });
  }
  createdTask(): void{
    const current = moment(this.dateService.date.value).format('DD-MM-YYYY');
    for (const week of this.calendar){
      const day = week.days.find((d) => current === d.value.format('DD-MM-YYYY'));
      if (day) {
        day.hasTask = this.created;
        this.created = false;
        break;
      }
    }
  }
    async hasTasks(calendar): Promise<void>{
      const data = await this.taskService.loadAll();
      for (const week of calendar){
        week.days.forEach(day => {
          const hasTask = data !== null &&  (data[day.value.format('DD-MM-YYYY')] !== undefined);
          if (!day.hasTask) { day.hasTask = hasTask; }
        });
      }
    }
    async generate(now: moment.Moment): Promise<void>{
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
            return {
              value,
              active,
              disabled,
              selected,
            };
          }),
      });
    }
    await this.hasTasks(calendar);
    this.calendar = calendar;
  }
  select(day: moment.Moment): void {
    this.dateService.changeDate(day);
  }
}
