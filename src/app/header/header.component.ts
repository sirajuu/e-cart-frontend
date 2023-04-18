import { Component, OnInit } from '@angular/core';
import { ApiService } from '../products/services/api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  totalItems:number=0
  constructor(private api:ApiService){}


  ngOnInit(): void {
    this.api.cartItemsCount.subscribe((count:any)=>{
      this.totalItems=count
    })
  }

  search(event:any){
    // assign value to behavior subject
    this.api.searchTerm.next(event.target.value)
  }

}
