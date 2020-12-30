import { Component } from '@angular/core';
import {DateService} from '../shared/date.service';
@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss']
})
export class SelectorComponent {

  constructor(private dateService: DateService) { }
  get date(): DateService{
    return this.dateService;
  }
  go(dir: number): void{
    this.dateService.changeMonth(dir);
  }
}
