import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.css']
})
export class ViewProductComponent implements OnInit {


  // to hold product id
  productId:any=''

  // to hold product detail
  products:any={}
    // get path parameter in url
  constructor(private viewActivetedRoute:ActivatedRoute,private api:ApiService){}

  ngOnInit(): void {
    // get path parameter from component route
    this.viewActivetedRoute.params.subscribe((data:any)=>{
      console.log(data);
      this.productId=data.id
      
    })



      // api call to get particular product detail
       this.api.viewProduct(this.productId).subscribe((result:any)=>{
        console.log(result);
        this.products=result
        
       },
       (result:any)=>{
        console.log(result.error);
        
       })
  }


// add to wishlist
  addTowishlist(product:any){
    this.api.addtowishlist(product)
    .subscribe((result:any)=>{
      alert(result)
    },
    (result:any)=>{
      alert(result.error)
    }
    )
  }

  
  addtocart(product:any){
    //  add quantity key to product object with value as 1
     Object.assign(product,{quantity:1})
     console.log(product);
  
    //  call api
    this.api.addToCart(product)
    .subscribe((result:any)=>{
  
      // call method to get cart count
      this.api.cartCount()
      alert(result)
    },
    (result:any)=>{
      alert(result.error)
    }
    )
     
    }




}
