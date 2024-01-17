import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { bootstrapApplication } from '@angular/platform-browser';
import 'zone.js';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h1>Shopping Cart</h1>
    <div class="items">
      <div *ngFor="let v of vehicles()" class="item">
        <div class="name">
        {{ v.name }}
        </div>
        
          <select
            [ngModel]="quantity()"
            (change)="onQuantitySelected($any($event.target).value, v.id)">
            <option disabled value="">--Select a quantity--</option>
            <option *ngFor="let q of qtyAvailable()">{{ q }}</option>
          </select>
      </div>
    </div> 
    <div style="font-weight: bold" [style.color]="color()" class="total">Total: {{ exPrice()  | number: '1.2-2' }}</div>
  `,
  styles: `
    .items {
      display: flex;
      flex-direction: column;
      gap: 30px;
      border: 1px solid grey;
      padding: 10px;
    }

    .item {
      display: flex;
      gap: 10px;
    }

    .item .name {
      width: 200px;
    }

    .total {
      margin-top: 20px;
    }
  `,
})
export class App {
  quantity = signal<number>(1);
  qtyAvailable = signal([1, 2, 3, 4, 5, 6]);

  vehicles: WritableSignal<Vehicle[]> = signal<Vehicle[]>([
    {
      id: 1,
      name: 'AT-AT',
      price: 10000,
      quantity: 1,
    },
    {
      id: 2,
      name: 'AT-AT 2',
      price: 15000,
      quantity: 1,
    },
  ]);

  exPrice = computed(() =>
    this.vehicles().reduce((accumulator: number, vehicle: Vehicle) => {
      accumulator = accumulator + vehicle.quantity * vehicle.price;
      return accumulator;
    }, 0)
  );
  color = computed(() => (this.exPrice() > 50000 ? 'green' : 'blue'));

  constructor() {
    console.log(this.quantity());

    // Example of an effect
    effect(() => console.log(JSON.stringify(this.vehicles())));
  }

  // Example of a declarative effect
  qtyEff = effect(() => console.log('Latest quantity:', this.quantity()));

  onQuantitySelected(qty: number, vehicleId: number) {
    let selectedVehicle = this.vehicles().find((i) => i.id === vehicleId);

    this.vehicles.update((v: Vehicle[]) => {
      selectedVehicle!.quantity = qty;
      return [...v];
    });
  }
}
export interface Vehicle {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

bootstrapApplication(App);
