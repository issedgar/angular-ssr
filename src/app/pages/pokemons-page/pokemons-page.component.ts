import { ApplicationRef, ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PokemonListComponent } from '../../pokemons/components/pokemon-list/pokemon-list.component';
import { PokemonListSkeletonComponent } from './ui/pokemon-list-skeleton/pokemon-list-skeleton.component';
import { PokemonsService } from '../../pokemons/services/pokemons.service';
import { SimplePokemon } from '../../pokemons/interfaces/simple-pokemon.interface';

import { toSignal } from '@angular/core/rxjs-interop';
import { map, tap } from 'rxjs';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-pokemons-pages',
  standalone: true,
  imports: [
    PokemonListComponent,
    PokemonListSkeletonComponent
  ],
  templateUrl: './pokemons-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PokemonsPagesComponent implements OnInit, OnDestroy {  
  // public currentName = signal('Carrillo');

  private pokemonService = inject(PokemonsService);
  public pokemons = signal<SimplePokemon[]>([]);

  private route = inject(ActivatedRoute);
  private router = inject(Router);

  private title = inject(Title);

  public currentPage = toSignal<number>(this.route.queryParamMap.pipe(
    map( params => params.get('page') ?? '1'),
    map( page => ( isNaN(+page) ? 1 : +page)),
    map( page => Math.max(1, page))
  ));

  // public isLoading = signal(true);

  // private appRef = inject(ApplicationRef);

  // private $appState = this.appRef.isStable.subscribe( isStable => {
  //   console.log(isStable);
  // });

  ngOnInit(): void {
    // this.route.queryParamMap.subscribe(console.log);

    this.loadPokemon();
    // setTimeout(() => {
    //   this.isLoading.set(false);
    // }, 5000);
  } 

  ngOnDestroy(): void {
    // this.$appState .unsubscribe();
  }

  public loadPokemon(page: number = 0) {
    const pageToLoad = this.currentPage()! + page;
    this.pokemonService.loadPage(pageToLoad).pipe(
      tap( () => this.router.navigate([], { queryParams: { page: pageToLoad } })),
      tap( () => this.title.setTitle(`Pokemons SSR - Page ${ pageToLoad }`))
    ).subscribe( this.pokemons.set );
  }
  
}

