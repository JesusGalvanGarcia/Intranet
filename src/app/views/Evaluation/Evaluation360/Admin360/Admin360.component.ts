import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { MensajeService } from '@http/mensaje.service';
import { LoadingComponent } from '../../../app/loading/loading.component';
import Swal from 'sweetalert2';

import { GridModule } from '@sharedComponents/grid/grid.module';
import { GridActions } from '@utils/grid-action';
import { ColDef } from 'ag-grid-community';
import { Evaluation360Service } from '@services/Evaluations/Evaluation360/evaluation360.service';
@Component({
  selector: 'app-Admin360',
  templateUrl: './Admin360.component.html',
  styleUrls: ['./Admin360.component.css'],
  standalone:true,
  imports: [LoadingComponent,MatMenuModule,CommonModule,MatIconModule,MatCardModule,GridModule,MatBadgeModule,MatDialogModule]

})
export class Admin360Component implements OnInit {
  
  evaluationData: any;
  UsersData: any;
  UsersPersonalData: any;
  all_data:any;
  isLoading: boolean = true;
  start:boolean=false;
  detail:boolean=false;
  evaluationNumber:number;
  ​
  public seeDetailButton:ColDef = Object.assign(
    {
      cellRendererSelector: (params: any) => {
        const component = { component: 'gridActionButton',
        params: { 
          action:  GridActions.Report,
          icon: 'fa-solid fa-file-invoice',
          title:'Ir a reporte'
       
        }
      };
      return component;
      }
    },
    GridActions.DEFAULT_COLUMN
  )
  public seeDetailSeenButton:ColDef = Object.assign(
    {
      cellRendererSelector: (params: any) => {
        const component = { component: 'gridActionButton',
        params: { 
          action:  GridActions.Acept,
          icon: 'fa-solid fa-envelope-circle-check',
          title:'Enviar reporte'
        }
      };
      return component;
      }
    },
    GridActions.DEFAULT_COLUMN
  )
  public seeDetailUser:ColDef = Object.assign(
    {
      cellRendererSelector: (params: any) => {
        const component = { component: 'gridActionButton',
        params: { 
          action:  GridActions.Seen,
          icon: 'fa-solid fa-eye',
          title:'Ver detalles'
        }
      };
      return component;
      }
    },
    GridActions.DEFAULT_COLUMN
  )
  public enableEvaluation: ColDef = Object.assign(
    {
      cellRendererSelector: (params: any) => {
        if (params.data && params.data.status === 'Terminado') {
          return {
            component: 'gridActionButton',
            params: {
              action: GridActions.Seen,
              icon: 'fa-solid fa-user-check',
              title: 'Habilitar evaluación'
            }
          };
        }
        // Retornar `undefined` si no se cumple la condición para no renderizar nada
        return undefined;
      }
    },
    GridActions.DEFAULT_COLUMN
  );
  public deleteEvaluation: ColDef = Object.assign(
    {
      cellRendererSelector: (params: any) => {
        const component = { component: 'gridActionButton',
        params: { 
          action:  GridActions.DELETE,
          icon: 'fa-solid fa-trash',
          title:'Eliminar evaluación'
        }
      };
      return component;
      }
    },
    GridActions.DEFAULT_COLUMN
  );
  
  public goClients:ColDef = Object.assign(
    {
      cellRendererSelector: (params: any) => {
        const component = { component: 'gridActionButton',
        params: { 
          action:  GridActions.Continue,
          icon: 'fa-solid fa-user-plus',
          title:'Asignar clientes internos'
        }
      };
      return component;
      }
    },
    GridActions.DEFAULT_COLUMN
  )
  public goUsers:ColDef = Object.assign(
    {
      cellRendererSelector: (params: any) => {
        const component = { component: 'gridActionButton',
        params: { 
          action:  GridActions.AddClient,
          icon: 'fa-solid fa-users',
          title:'Asignar usuarios a la evaluación'
        }
      };
      return component;
      }
    },
    GridActions.DEFAULT_COLUMN
  )
  public sendEmails:ColDef = Object.assign(
    {
      cellRendererSelector: (params: any) => {
        const component = { component: 'gridActionButton',
        params: { 
          action:  GridActions.SendEmails,
          icon: 'fa-solid fa-envelope-circle-check',
          title:'Enviar correos de notificación'
        }
      };
      return component;
      }
    },
    GridActions.DEFAULT_COLUMN
  )
  protected columnDefs: ColDef[] = [
    { headerName: 'Nombre', field: 'name',  },
    { headerName: 'Inicio', field: 'start_date',  },
    { headerName: 'Fin', field: 'end_date',},
    this.seeDetailButton,
    this.goClients,
    this.goUsers,
    this.sendEmails
  
  ]
  protected columnDefsUsers: ColDef[] = [
    { headerName: 'Nombre', field: 'collaborator_name',  },
    { headerName: 'Evaluación', field: 'evaluation_name',  },
    { headerName: 'Estatus', field: 'status_label',  },

    this.seeDetailSeenButton,
    this.seeDetailButton,
    this.seeDetailUser
  
  ]
​  protected columnDefsPersonalUser: ColDef[] = [
  { headerName: 'Nombre', field: 'responsable_name',  },
  { headerName: 'Evaluación', field: 'evaluation_name',  },
  { headerName: 'Estatus', field: 'status',  },
  { headerName: 'Evaluador', field: 'evaluator_type',  },
  this.enableEvaluation,
  this.deleteEvaluation
]
  constructor(
    private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog,
    public router:Router,
    private evaluations:  Evaluation360Service,
    public message: MensajeService) { }
  startModal = true; // o false, dependiendo de tu lógica
  modalOpen = false;

  ngOnInit() {
    var user=localStorage.getItem("email");
    if(user=="")
    {
      this.router.navigate(['/login']);
      this.message.error("Tienes que iniciar sesion");

    }
    let data = {
      user_id: Number(localStorage.getItem("user_id")),

    };
    if(localStorage.getItem("page_evaluation")!="")
    {
      this.start=true;
      this.evaluationNumber=Number(localStorage.getItem("page_evaluation"));
      this.getUsers(data,this.evaluationNumber);
    }else
    this.getExamns(data);
  
  }
  getExamns(data: any) {
    this.isLoading=true;
   
    this.evaluations.Get360(data)  //Cargar examen
      .then((response: any) => {
      
        this.evaluationData = response.evaluations.filter((evaluation:any) =>Number(evaluation.process_id)== 7||Number(evaluation.process_id)== 10||Number(evaluation.process_id)== 11);;
       

        this.isLoading=false;
     

      })
      .catch((error: any) => {
        this.isLoading=false;

        console.error('Error in the request:', error);
        this.message.error(error.message+" "+error.code);
        // Handle errors here
      });
  }
  getUsers(data: any,id:any) {
 
  
    this.isLoading=true;
    this.evaluations.GetUsers360(data,id)  //Cargar examen
      .then((response: any) => {
       
        this.UsersData = response.users;

        this.isLoading=false;
     

      })
      .catch((error: any) => {
        this.isLoading=false;

        console.error('Error in the request:', error);
        this.message.error(error.message+" "+error.code);
        // Handle errors here
      });
  }
  getUserPersonal(data: any) {
    this.isLoading=true;
    
    this.evaluations.getPersonal360(data)  //Cargar examen
      .then((response: any) => {
       
        this.UsersPersonalData = response.users;

        this.isLoading=false;
     

      })
      .catch((error: any) => {
        this.isLoading=false;

        console.error('Error in the request:', error);
        this.message.error(error.message+" "+error.code);
        // Handle errors here
      });
  }
  enableEvaluations(data: any) {
    this.isLoading=true;
    
    this.evaluations.enableEvaluation(data)  //Cargar examen
      .then((response: any) => {    
       this.message.success(response.message);
       this.isLoading=false;
       this.getUserPersonal(this.all_data);
      })
      .catch((error: any) => {
        this.isLoading=false;

        console.error('Error in the request:', error);
        this.message.error(error.message+" "+error.code);
        // Handle errors here
      });
  }
  deleteEvaluations(data: any) {
    this.isLoading=true;
    
    this.evaluations.deleteEvaluation(data)  //Cargar examen
      .then((response: any) => {    
       this.message.success(response.message);
       this.isLoading=false;
       this.getUserPersonal(this.all_data);
      })
      .catch((error: any) => {
        this.isLoading=false;

        console.error('Error in the request:', error);
        this.message.error(error.message+" "+error.code);
        // Handle errors here
      });
  }
  back()
  {
    this.start=false;
    this.isLoading=true;
    let data = {
      user_id: Number(localStorage.getItem("user_id")),

    };
    this.getExamns(data);
    localStorage.setItem("page_evaluation","");
    this.isLoading=false;
  }
  backPersonal()
  {
    this.start=false;
    this.detail=false;
    this.start=true;
    let data = {
      user_id: Number(localStorage.getItem("user_id")),
    };
    this.getUsers(data,this.evaluationNumber);
  }
  protected onActionEvent(actionEvent: { action: string, data: any }) {
    if (actionEvent.action == GridActions.Report )  //verificar si no han finalizado los intentos
      {
        this.start=true;
        this.evaluationNumber=actionEvent.data.id;
        let data = {
          user_id: Number(localStorage.getItem("user_id")),
    
        };
        this.getUsers(data,this.evaluationNumber);
      }
      if (actionEvent.action == GridActions.Continue )  //verificar si no han finalizado los intentos
      {
        this.router.navigate(['users360/' + actionEvent.data.id]);

      }
      if (actionEvent.action == GridActions.AddClient )  //verificar si no han finalizado los intentos
      {
        this.router.navigate(['360Users/' + actionEvent.data.id]);

      }
      if (actionEvent.action == GridActions.SendEmails )  //verificar si no han finalizado los intentos
      {
        this.evaluationNumber=actionEvent.data.id;
        this.sendEmail();

      }
  }
  postApproved(id:any)
  {
    this.isLoading=true;
    let data = {
      user_evaluation: id,
      user_id:Number(localStorage.getItem("user_id")),
      evaluation_id:this.evaluationNumber
    };
  
    this.evaluations.changeStatus(data)
    .then((response: any) => {
     this.message.success("El  reporte se ha aprobado con exito");
     this.getUsers(data,this.evaluationNumber);
     this.isLoading=false;
    })
    .catch((error: any) => {
      console.error('Error in the request:', error);
      this.message.error(error.message+" "+error.code);
      this.isLoading=false;
      // Handle errors here
    });
  }
  sendEmail() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas enviar los correos a los usuarios seleccionados?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, enviar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        const data = {
          user_id: Number(localStorage.getItem("user_id")),
          evaluation_id: this.evaluationNumber
        };
  
        this.evaluations.sendEmails(data)
          .then((response: any) => {
            this.message.success(response.message);
            this.isLoading = false;
          })
          .catch((error: any) => {
            console.error('Error in the request:', error);
            this.message.error(error.message + " " + error.code);
            this.isLoading = false;
          });
      }
    });
  }
  
  protected onActionEnable(actionEvent: { action: string, data: any }) {
    let data = {
      user_evaluation: actionEvent.data.user_evaluation_id,
      user_id:Number(localStorage.getItem("user_id")),
      evaluation_id:this.evaluationNumber
    };
    if(actionEvent.action == GridActions.Seen )
    this.enableEvaluations(data);
    if(actionEvent.action==GridActions.DELETE)
    this.deleteEvaluations(data);

}
  protected onActionEventUser(actionEvent: { action: string, data: any }) {

      if (actionEvent.action == GridActions.Report )  //verificar si no han finalizado los intentos
      {
        localStorage.setItem("collaborator_name", actionEvent.data.collaborator_name);
        localStorage.setItem("admin", "true");

        this.router.navigate(['personal360/' + this.evaluationNumber + "/" + actionEvent.data.collaborator_id]);
        
      }
      if (actionEvent.action == GridActions.Acept )  //verificar si no han finalizado los intentos
      {
        this.postApproved(actionEvent.data.collaborator_id);      
      }
      if (actionEvent.action == GridActions.Seen )  //verificar si no han finalizado los intentos
      {
        let data = {
          user_id: Number(localStorage.getItem("user_id")),
          collaborators_id: [Number(actionEvent.data.collaborator_id)],
          evaluations_id: [Number(actionEvent.data.evaluation_id)]
        };
        this.all_data=data;
        this.start=false;
        this.detail=true; 
        this.getUserPersonal(data);
      
      }
  }
  

}
