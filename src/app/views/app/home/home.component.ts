import { Component, OnInit } from '@angular/core';
// Importa MatIconModule y MatButtonModule en tu módulo
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { SidenavComponent } from '../sidenav/sidenav.component';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { trigger, state, style, animate, transition } from '@angular/animations';

import { LoadingComponent } from '../../app/loading/loading.component';
import { MensajeService } from '@http/mensaje.service';
import { ToolService } from '@services/tools.service';
@Component({
  selector: 'app-home',
  standalone:true,

  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    LoadingComponent,
    CarouselModule
  ],
  animations: [
    trigger('fadeAnimation', [
      state('visible', style({ opacity: 1 })),
      state('hidden', style({ opacity: 0 })),
      transition('visible <=> hidden', animate('300ms ease-in-out')),
    ]),
  ]
})
export class HomeComponent implements OnInit {
  protected isCollapsed: boolean = false;
  currentUserIndex = 0;
  animationState = 'visible';
  id:any=localStorage.getItem("user_id");
  links:any;
  isLoading:boolean=false;
   users = [
    {
      name: "Itzayana A",
      introduction: "Soy una persona empática y cordial, que siempre busca aportar y apoyar a quien lo necesite . Me gusta trabajar en equipo y me gusta escuchar las opiniones de las personas que me rodean. Disfruto mucho interrelacionarme con las personas. Soy una persona extrovertida y aventurera. No descanso hasta lograr los objetivos que me propongo.",
      imageUrl: "https://s3.amazonaws.com/inteam-assets/system/206839/user_photos/275154/profile/Foto-Itzayana-Anota.png"
    },
    {
      name: "Mayrel H.",
      introduction: "Soy una persona viajera, que es originaria de Xalapa, Ver, he estado en muchos lugares a lo largo de mi vida y por ahora me encuentro aquí en Monterrey, me gusta disfrutar de cada momento de la vida como si fuera el ultimo.",
      imageUrl: "https://s3.amazonaws.com/inteam-assets/system/206839/user_photos/256480/thumb/Mayrel-Higuera%20%282%29.png?1654107562"
    },
    {
      name: "Fernando G.",
      introduction: "Fernando es una persona alegre, colaborativa y servicial. Es originario de Monterrey, Nuevo León, creció en una familia numerosa, rodeado de tíos y muchos primos, fue hijo único hasta los 10 años, estudió psicología y se enfocó a la parte laboral.",
      imageUrl: "https://s3.amazonaws.com/inteam-assets/system/206839/user_photos/256466/thumb/Fernando-Garcia-FC-2023.jpg?1675211131"
    },
    {
      name: "Aracely R.",
      introduction: "Coahuilense de nacimiento, Regia de corazón. Me encanta la música, disfrutar de los paisajes, la naturaleza, una buena plática. Amo los momentos con mi familia, conocer gente, aprender todos los días. Dog lover. De mis frases favoritas el que sigue, persigue, consigue",
      imageUrl: "https://s3.amazonaws.com/inteam-assets/system/206839/user_photos/256486/thumb/Aracely-Rivas.png?1650228879"
    }
  ];
    constructor( public message: MensajeService, private router: Router,private tools : ToolService) { }
  showSubMenu: string | null = null;
  getUser() {
    var user=localStorage.getItem("user_id");
    if(user==""||user==null)
    {
      this.router.navigate(['login']);
      this.message.error("No hay una sesión iniciada.")
    }

    return localStorage.getItem("names");
  }
  toggleSubMenu(menu: string) {
    this.showSubMenu = this.showSubMenu === menu ? null : menu;
  }
  go(page:string,pageOrigin:string)
  {
    this.isLoading=true;
    this.router.navigate([page]);
    this.isLoading=false;
  }
  ngOnInit() {
    this.isLoading=true;
  
    this.getTool();
   this.getUser();
  }
  getTool()
  {
       this.tools.getTools(this.id)
       .then((response: any) => {
        this.links=response;
       this.isLoading=false;
      })
      .catch((error) => {
        console.error('Error al comunicarse con la sesión:', error);
        this.isLoading = false;
        this.getUser();
      });
    
  }
  toggleMenu() {
    this.isCollapsed = !this.isCollapsed; // Cambia el estado del menú colapsable
  }
  activeSlide: number = 0; // Índice del slide activo

  prevUser() {
    this.changeUser(-1);
  }

  nextUser() {
    this.changeUser(1);
  }

  changeUser(direction: number) {
    this.animationState = 'hidden'; // Oculta el contenido antes de cambiar
    setTimeout(() => {
      this.currentUserIndex = (this.currentUserIndex + direction + this.users.length) % this.users.length;
      this.animationState = 'visible'; // Muestra el nuevo contenido con animación
    }, 300); // El tiempo debe coincidir con el tiempo de la animación
  }
}
