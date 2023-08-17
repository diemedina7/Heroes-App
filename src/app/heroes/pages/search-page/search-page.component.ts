import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteActivatedEvent } from '@angular/material/autocomplete';

import { Hero } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.servce';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styles: []
})
export class SearchPageComponent {

  public heroes: Hero[] = [];
  public selectedHero?: Hero;
  public searchInput = new FormControl('');

  constructor( private heroesService: HeroesService) {}

  public searchHero() {
    const value: string = this.searchInput.value || '';

    this.heroesService.getSuggestions(value)
      .subscribe(
        heroes => this.heroes = heroes
      )
  }

  public onSelectedOption(event: MatAutocompleteActivatedEvent): void {
    if (!event.option?.value) {
      this.selectedHero = undefined;
      return;
    }

    const hero: Hero = event.option.value;
    this.searchInput.setValue(hero.superhero);
    this.selectedHero = hero;
  }
}
