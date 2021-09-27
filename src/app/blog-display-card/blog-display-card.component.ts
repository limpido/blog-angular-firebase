import {Component, Input, OnInit} from '@angular/core';
import {Blog} from "../models/blog";

@Component({
  selector: 'app-blog-display-card',
  templateUrl: './blog-display-card.component.html',
  styleUrls: ['./blog-display-card.component.scss']
})
export class BlogDisplayCardComponent implements OnInit {

  @Input() blog: Blog;
  lastEditDate: string;

  constructor() { }

  ngOnInit(): void {
    const timeStamp = new Date(this.blog.last_edited_timestamp);
    const year = timeStamp.getFullYear();
    const month = timeStamp.getMonth()+1;
    const day = timeStamp.getDate();
    this.lastEditDate = `${year}-${month}-${day}`;
  }

}
