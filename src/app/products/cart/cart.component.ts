import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { FormBuilder } from '@angular/forms';
import {
  IPayPalConfig,
  ICreateOrderRequest
} from 'ngx-paypal';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  public payPalConfig ? : IPayPalConfig;

  cartItems: any = []

  cartTotalPrice: number = 0

  offerStatus: Boolean = false

  finalAmount: number = 0

  offerTagStatus: Boolean = true

  paymentBtn: Boolean = false

  user: any = {}

  makePaymentStatus:boolean=false

  showSuccess:boolean=false

  showCancel:boolean=false

  showError:boolean=false



  addressForm = this.fb.group({
    username: [''],
    Addr1: [''],
    Addr2: [''],
    state: ['']

  })

  constructor(private api: ApiService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.getCart()
    this.initConfig();
  }
  getCart() {
    this.api.getCart()
      .subscribe((result: any) => {
        console.log(result);
        this.cartItems = result

        // call cart Price
        this.getCartTotalPrice()

      },
        (result: any) => {
          console.log(result.error);

        }
      )
  }

  // getCartTotalPrice
  getCartTotalPrice() {
    let total = 0
    this.cartItems.forEach((item: any) => {
      total += item.grantTotal
      this.cartTotalPrice = Math.ceil(total)
      this.finalAmount = this.cartTotalPrice
    })
  }


  // remove cart item
  removeCartitem(id: any) {
    this.api.removeCartItem(id)
      .subscribe((result: any) => {
        this.cartItems = result
        //  call cart price
        this.getCartTotalPrice()
        // to change cart count
        this.api.cartCount()
      },
        (result: any) => {
          alert(result.error)
        })
  }


  // increment cart item
  incrCartItem(id: any) {
    this.api.incrCarditem(id)
      .subscribe((result: any) => {
        this.cartItems = result
        //  call cart price
        this.getCartTotalPrice()
        // to change cart count
        this.api.cartCount()
      },
        (result: any) => {
          alert(result.error)
        })
  }

  decrCartItem(id: any) {
    this.api.decrCarditem(id)

      .subscribe((result: any) => {
        this.cartItems = result
        //  call cart price
        this.getCartTotalPrice()
        // to change cart count
        this.api.cartCount()
      },
        (result: any) => {
          alert(result.error)
        })
  }

  emptyCart() {
    this.api.emptyCart()
      .subscribe((result: any) => {
        this.cartItems = []
        //  call cart price
        //  this.getCartTotalPrice()
        // to change cart count
        this.api.cartCount()
      })
  }


  viewOffers() {
    this.offerStatus = true
  }

  discount10() {
    let discount = this.cartTotalPrice * 10 / 100
    this.finalAmount = this.cartTotalPrice - discount
    this.offerStatus = false
    this.offerTagStatus = false

  }
  discount50() {
    let discount = this.cartTotalPrice * 50 / 100
    this.finalAmount = this.cartTotalPrice - discount
    this.offerStatus = false
    this.offerTagStatus = false
  }

  submit() {
    if (this.addressForm.valid) {
      this.paymentBtn = true
      this.user.username = this.addressForm.value.username
      this.user.Addr1 = this.addressForm.value.Addr1
      this.user.Addr2 = this.addressForm.value.Addr2
      this.user.state = this.addressForm.value.state
    }
    else {
      alert('Invalid Form')
    }
  }


  // make payment

  makepayment(){
    this.makePaymentStatus=true
  }





  private initConfig(): void {
    this.payPalConfig = {
        currency: 'EUR',
        clientId: 'sb',
        createOrderOnClient: (data) => < ICreateOrderRequest > {
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: 'EUR',
                    value: '9.99',
                    breakdown: {
                        item_total: {
                            currency_code: 'EUR',
                            value: '9.99'
                        }
                    }
                },
                items: [{
                    name: 'Enterprise Subscription',
                    quantity: '1',
                    category: 'DIGITAL_GOODS',
                    unit_amount: {
                        currency_code: 'EUR',
                        value: '9.99',
                    },
                }]
            }]
        },
        advanced: {
            commit: 'true'
        },
        style: {
            label: 'paypal',
            layout: 'vertical'
        },
        onApprove: (data, actions) => {
            console.log('onApprove - transaction was approved, but not authorized', data, actions);
            actions.order.get().then((details:any) => {
                console.log('onApprove - you can get full order details inside onApprove: ', details);
            });

        },
        onClientAuthorization: (data) => {
            console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
            this.showSuccess = true;
            // alert('Payment Successfully Recieved')

            // empty cart
            this.emptyCart()
            this.makePaymentStatus=false
        },
        onCancel: (data, actions) => {
            console.log('OnCancel', data, actions);
            this.showCancel = true;
            this.makePaymentStatus=false

        },
        onError: err => {
            console.log('OnError', err);
            this.showError = true;
            this.makePaymentStatus=false
        },
        onClick: (data, actions) => {
            console.log('onClick', data, actions);
            // this.resetStatus();
        }
    };
}


modalClose(){
  this.addressForm.reset()
  this.paymentBtn=false
  this.makePaymentStatus=false
  this.showCancel=false
  this.showSuccess=false
  this.showError=false
}


}
