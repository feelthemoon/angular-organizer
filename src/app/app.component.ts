import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private spinner: NgxSpinnerService) {
    spinner.show();
  }
  ngOnInit(): void {
    this.spinner.hide();
  }
}
