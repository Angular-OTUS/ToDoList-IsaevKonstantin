import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'home',
  imports: [RouterModule, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {}
