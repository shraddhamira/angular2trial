import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { HEROES } from './mock-heros';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable()
export class HeroService {
	private heroesUrl = 'api/heroes';  // URL to web api

	constructor(private messageService: MessageService, private http: HttpClient) { }

	//getHeroes(): Hero[] {
	//return HEROES;
	//}

	/** GET heroes from the server */
	getHeroes(): Observable<Hero[]> {
		return this.http.get<Hero[]>(this.heroesUrl)
			.pipe(
				tap(heroes => this.log(`fetched heroes`)),
				catchError(this.handleError('getHeroes', []))
			);
	}

	getHero(id: number): Observable<Hero> {
		// TODO: send the message _after_ fetching the hero
		//this.messageService.add(`HeroService: fetched hero id=${id}`);
		return this.http.get<Hero>(this.heroesUrl + '/' + id + '.json').pipe(
			tap(_ => this.log(`fetched hero id=${id}`)),
			catchError(this.handleError<Hero>(`getHero id=${id}`))
		);
		//return of(HEROES.find(hero => hero.id === id));
	}

	private log(message: string) {
		this.messageService.add('Hero Service: ' + message);
	}

	/**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
	private handleError<T>(operation = 'operation', result?: T) {
		return (error: any): Observable<T> => {

			// TODO: send the error to remote logging infrastructure
			console.error(error); // log to console instead

			// TODO: better job of transforming error for user consumption
			this.log(`${operation} failed: ${error.message}`);

			// Let the app keep running by returning an empty result.
			return of(result as T);
		};
	}

	/** PUT: update the hero on the server */
	updateHero(hero: Hero): Observable<any> {
		return this.http.put(this.heroesUrl, hero, httpOptions).pipe(
			tap(_ => this.log(`updated hero id=${hero.id}`)),
			catchError(this.handleError<any>('updateHero'))
		);
	}

	/** POST: add a new hero to the server */
	addHero(hero: Hero): Observable<Hero> {
		console.log(hero);
		return this.http.post<Hero>(this.heroesUrl, hero, httpOptions).pipe(
			tap((hero: Hero) => this.log(`added hero w/ id=${hero.id}`)),
			catchError(this.handleError<Hero>('addHero'))
		);
	}

	/** DELETE: delete the hero from the server */
	deleteHero(hero: Hero | number): Observable<Hero> {
		const id = typeof hero === 'number' ? hero : hero.id;
		const url = `${this.heroesUrl}/${id}`;

		return this.http.delete<Hero>(url, httpOptions).pipe(
			tap(_ => this.log(`deleted hero id=${id}`)),
			catchError(this.handleError<Hero>('deleteHero'))
		);
	}

	/* GET heroes whose name contains search term */
	searchHeroes(term: string): Observable<Hero[]> {
		console.log("here as well");
		if (!term.trim()) {
			// if not search term, return empty hero array.
			return of([]);
		}
		return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
			tap(_ => this.log(`found heroes matching "${term}"`)),
			catchError(this.handleError<Hero[]>('searchHeroes', []))
		);
	}
}
