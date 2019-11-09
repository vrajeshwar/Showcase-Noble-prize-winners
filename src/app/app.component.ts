import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  nobelprizeSub: Subscription;
  entireResponse: any;
  filteredResponse = [];
  theGreatOnes = [];

  constructor(private http: HttpClient) {

  }

  ngOnInit() {
    this.nobelprizeSub = this.http.get('http://api.nobelprize.org/v1/prize.json').subscribe(
      response => {
        this.entireResponse = response;
        this.fetchMultipleTimeWinners();
      }
    );
  }


  filterBy(Category: string) {

    if (Category === 'none') {
      this.filteredResponse = [];
    } else if (Category === 'all') {
      this.filteredResponse = this.entireResponse.prizes;
    } else {

      const tempArray = [];

      for (const key of this.entireResponse.prizes) {
        if (Category === key.category) {
          tempArray.push(key);
        }
      }
      this.filteredResponse = tempArray;
    }
  }


  fetchByYear(value: string) {
    const tempArray = [];
    for (const key of this.entireResponse.prizes) {
      if (value === key.year) {
        tempArray.push(key);
      }
    }
    this.filteredResponse = tempArray;
  }

  fetchMultipleTimeWinners() {
    const frequencyCounter = {};
    for (const key of this.entireResponse.prizes) {
      for (const subkey in key) {
        if (key.hasOwnProperty(subkey)) {
          if (subkey === 'laureates') {
            for (const iterator of key[subkey]) {
              let name;
              if (iterator.surname !== undefined) {
                name = iterator.firstname + ' ' + iterator.surname;
              } else {
                name = iterator.firstname;
              }
              frequencyCounter[name] = (frequencyCounter[name] || 0) + 1;
              if (frequencyCounter[name] > 1) {
                const details = {
                  Name: name,
                  Category: key.category,
                  Year: key.year,
                  Motivation: iterator.motivation
                };
                this.theGreatOnes.push(details);
              }
            }
          }
        }
      }
    }
    this.theGreatOnes.splice(5, 1);
    console.log(this.theGreatOnes);
  }

  ngOnDestroy() {
    this.nobelprizeSub.unsubscribe();
  }

}
