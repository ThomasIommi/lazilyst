import { Component, Input, OnInit } from '@angular/core';

import { Activity } from '../../../../shared/models/activity';


@Component({
  selector: 'app-single-activity',
  templateUrl: './single-activity.component.html',
  styleUrls: ['./single-activity.component.scss']
})
export class SingleActivityComponent implements OnInit {

  /** Activity that this component represent */
  @Input() activity: Activity;

  constructor() { }

  ngOnInit(): void {
  }

}
