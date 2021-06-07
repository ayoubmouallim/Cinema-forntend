import { Component, OnInit } from '@angular/core';
import { CinemaService } from '../services/cinema.service';

@Component({
  selector: 'app-cinema',
  templateUrl: './cinema.component.html',
  styleUrls: ['./cinema.component.css']
})
export class CinemaComponent implements OnInit {
  public villes: any;
  public cinemas: any;
  public salles: any;

  public currentVille: any;
  public currentCinema: any;
  public currentProjection: any;
  public selectedTickets: any;

  constructor(public cinemaService: CinemaService) {}

  ngOnInit(): void {
    this.cinemaService.getVilles().subscribe(
      data => {
        this.villes = data;
      },
      err => {
        console.log(err);
      }
    );
  }
  onGetCinemas(v: any) {
    this.currentVille = v;
    this.salles = undefined;
    this.cinemaService.getCinemas(v).subscribe(
      data => {
        this.cinemas = data;
      },
      err => {
        console.log(err);
      }
    );
  }
  onGetSalles(c: any) {
    this.currentCinema = c;
    this.cinemaService.getSalles(c).subscribe(
      data => {
        this.salles = data;
        this.salles._embedded.salles.forEach((salle: any) => {
          this.cinemaService.getProjections(salle).subscribe(
            data => {
              salle.projections = data;
            },
            err => {
              console.log(err);
            }
          );
        });
      },
      err => {
        console.log(err);
      }
    );
  }
  onGetTicketsPlaces(proj: any) {
    this.currentProjection = proj;
    console.log(this.currentProjection.tickets);
    this.cinemaService.getTicketsPlaces(proj).subscribe(
      (data: any) => {
        this.currentProjection.tickets = data;
        this.selectedTickets = [];
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  OnSelectTicket(ticket: any) {
    if (!ticket.selected) {
      ticket.selected = true;
      this.selectedTickets.push(ticket);
    } else {
      ticket.selected = false;
      this.selectedTickets.splice(this.selectedTickets.indexOf(ticket), 1);
    }

    console.log(this.selectedTickets);
  }
  getTicketClass(ticket: any) {
    let str = 'btn ticket ';
    if (ticket.reserve == true) {
      str += 'btn-danger';
    } else if (ticket.selected) {
      str += 'btn-warning';
    } else {
      str += 'btn-success';
    }
    return str;
  }

  onPayTickets(dataForm: any) {
    //    console.log(f);
    let tickets: any[] = [];
    this.selectedTickets.forEach((t: any) => {
      tickets.push(t.id);
    });
    dataForm.tickets = tickets;
    // console.log(dataForm);
    this.cinemaService.payerTickets(dataForm).subscribe(
      () => {
        alert('Tickets Reserves avec Succes');
        this.onGetTicketsPlaces(this.currentProjection);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }
}
