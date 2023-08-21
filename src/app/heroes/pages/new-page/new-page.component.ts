import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { filter, switchMap, tap } from 'rxjs';

import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: [
  ]
})
export class NewPageComponent implements OnInit {

  //creacion del formulario reactivo
  public heroForm = new FormGroup({
    id:                 new FormControl<string>(''),
    superhero:          new FormControl<string>('', { nonNullable: true }),
    publisher:          new FormControl<Publisher>( Publisher.DCComics ),
    alter_ego:          new FormControl(''),
    first_appearance:   new FormControl(''),
    characters:         new FormControl(''),
    alt_img:            new FormControl('')
  });

  public publishers = [
    { id: 'DC Comics',     desc: 'DC - Comics'},
    { id: 'Marvel Comics', desc: 'Marvel - Comics'},
  ];

  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog ) {}

  get currentHero(): Hero {
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  ngOnInit(): void {
    if (!this.router.url.includes('edit'))
      return;

    this.activatedRoute.params
      .pipe(
        switchMap( ({ id }) => this.heroesService.getHeroById(id) )
      ).subscribe( hero => {
        if (!hero)
          return this.router.navigateByUrl('/');

        return this.heroForm.reset(hero);
      });
  }

  onSubmit(): void {
    //console.log({ formIsValid: this.heroForm.valid, value: this.heroForm.value });
    if (this.heroForm.invalid)
      return;

    if (this.currentHero.id) {
      this.heroesService.updateHero( this.currentHero ).subscribe(
        hero => {
          this.showSnakbar(`${ hero.superhero } actualizado!`)
        }
      );

      return;
    }

    this.heroesService.addHero( this.currentHero ).subscribe(
      hero => {
        this.showSnakbar(`${ hero.superhero } creado!`);
        this.router.navigate(['/heroes/edit/', hero.id]);
      }
    );
  }

  onDeleteHero(): void {
    if (!this.currentHero.id)
      throw Error('Hero id is required!');

      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: this.heroForm.value
      });

      dialogRef.afterClosed()
        .pipe(
          filter( (result: boolean) => result ),
          switchMap( () => this.heroesService.deleteHeroById(this.currentHero.id) ),
          filter( (wasDeleted: boolean) => wasDeleted )
        )
        .subscribe( () => {
          this.router.navigateByUrl('/');
        });

      // CODIGO DE DIALOG ANTERIOR CON DOBLE SUBSCRIBE ANIDADO (MALA PRACTICA DE PROGRAMACION)
      /*dialogRef.afterClosed().subscribe(result => {
        if (!result)
          return;

        this.heroesService.deleteHeroById(this.currentHero.id).subscribe(
          wasDeleted => {
            if (wasDeleted)
              this.router.navigateByUrl('/');
          }
        );
      });*/
  }

  private showSnakbar(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 2500
    })
  }
}
