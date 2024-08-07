import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { UserTestService } from '@services/Evaluations/Desempeño/userTest.service';
import { AsesoresService } from '@services/Evaluations/Asesores/asesores.service';

import { GridModule } from '@sharedComponents/grid/grid.module';
import { ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { MensajeService } from '@http/mensaje.service';
import { PLDUserService } from '../../../../shared/services/PLD/pldUser.service';
import { LoadingComponent } from '../../../app/loading/loading.component';
import { UserTest } from '@models/testDetails/saveTest';
import { EvaluationTest } from '@models/testDetails/evaluationTest';
import { Answer } from '@models/testDetails/answer';
import { Question } from '@models/testDetails/question';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgSelectModule } from '@ng-select/ng-select';
import { ChangeDetectorRef } from '@angular/core';

import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-EvaluationAsesor',
  templateUrl: './EvaluationAsesor.component.html',
  styleUrls: ['./EvaluationAsesor.component.scss'],
  standalone:true,

  imports: [
    MatMenuModule,
    NgSelectModule,
    FormsModule,
    CommonModule,

    MatIconModule,
    MatCardModule,
    LoadingComponent,
    GridModule,
    MatBadgeModule,
    MatProgressBarModule,
  ]
})
export class EvaluationAsesorComponent implements OnInit {
  @ViewChild(NgModel) ngModel: NgModel;
  start: boolean = true;
  user_test_id: number = 0;
  isLoading: boolean = true;
  loading: boolean = false;
  selectedOption: any;
  saveIndivisual: any;
  size = 0; //Para saber el tamaño  del arreglo
  score: number = 0;
  Answers: SendQuestions[] = [];
  sendInfo: SendQuestions;
  FinalEvalution: End;
  evaluatedUserName: string = "";
  type: string = "";
  exam_progress: number = 0;
  max_score: number = 0;
  sendButton: boolean = false;
  showQuestion: boolean = true;
  actualAnswer:string;
  index = 0;
  finish = false;
  end = false;
  sendUserTest: UserTest = {
    user_id: Number(localStorage.getItem('user_id')),
    user_test_id: this.user_test_id,
    modules: [],
  };
  PLDTest: EvaluationTest;
  attempt: number = 0;
  constructor(
    private router: Router,
    private userTestService: UserTestService,
    private route: ActivatedRoute,
    private pldService: PLDUserService,
    public message: MensajeService,
    public asesores: AsesoresService,
    public ctr: ChangeDetectorRef
  ) {
    this.route.params.subscribe((params) => {
      this.user_test_id = params['id'];
      this.attempt = params['attempts']; //recibe los parametros del titulo de  la evaluacion
    });
  }

  ngOnInit() {
    let data = {
      user_id: Number(localStorage.getItem('user_id')),
    };
    this.getExam(data);
  }
  onSelectChange(event: any,selectedIndex: number) {

    const answers = this.PLDTest.test_modules[0].questions[this.index].answers;
    const foundAnswerIndex = answers.findIndex(answer => answer.description ===event.description);
    if (foundAnswerIndex !== -1&&this.size!=this.index) {
      this.PLDTest.test_modules[0].questions[this.index].answers[foundAnswerIndex].user_answer_id=event.id;
    } 
    this.PostsaveAnswers(this.PLDTest.test_modules[0].questions[this.index],event,event.id)
    this.actualAnswer = "Selecciona una opción...";
  
   
  }

  getExam(data: any) {
    this.userTestService
      .GetExam(data, this.user_test_id)
      .then((response: any) => {
        this.PLDTest = response.data.test; //Obtener la informacion y desordenar las preguntas
        this.evaluatedUserName = response.data.evaluated_user_name;
        this.type=response.data.tipo;
        this.isLoading = false;
        this.size = this.PLDTest.test_modules[0].questions.length;
        this.exam_progress = 0;
        this.max_score = Number(this.PLDTest.max_score);
        this.getIndexOfAnswerWithNonNullUserAnswer(this.index);
      })
      .catch((error: any) => {
        this.isLoading = false;

        console.error('Error in the request:', error);
        this.message.error(error.message+" "+error.code);
        // Handle errors here
      });
  }
  changeStart() {
    this.start = false;
  }
  backIndex() {
    this.router.navigate(['asesores']);
  }
  PostsaveAnswers(question: Question, answer: Answer, idAnswer: number) {
    this.loading = true;
    this.sendButton = true;
    this.saveIndivisual = {
      user_id: Number(localStorage.getItem('user_id')),
      user_test_id: this.user_test_id,
      answer_id: answer.id,
      question_id: question.id,
      score: Number(answer.score),
      its_over: 'no',
      attempts: Number(this.attempt),
    };

    if (this.index + 1 === this.size) this.saveIndivisual.its_over = 'si'; //revisar si la pregunta es la ultima
   
    this.asesores
      .SendTestEvaluation(this.saveIndivisual)
      .then((response: any) => {
      
        this.loading = false;
        this.score = response.actual_score;
        this.sendButton = false;
        this.nextQuestion(
          question,
          answer,
          idAnswer,
       
        ); //pasar a la siguiente pregunta
      })
      .catch(({ title, message, code }) => {
        console.error(title, message, code);
        this.message.error(message+" "+code);

        this.loading = false;

        // this.index = this.index - 1;
        // Handle errors here
      });
  }
  back() {
    this.index = this.index - 1;
    this.getIndexOfAnswerWithNonNullUserAnswer(this.index);
    this.showQuestion = false; // Inicia la animación de desvanecimiento
    setTimeout(() => {
      this.showQuestion = true;
    }, 300);
  }
  next() {
    if(this.index+1!=this.size)
    this.getIndexOfAnswerWithNonNullUserAnswer(this.index+1);
    this.index = this.index + 1;

    if(this.index!=this.size)
    this.showQuestion = false; // Inicia la animación de desvanecimiento
    setTimeout(() => {
      this.showQuestion = true;
    }, 300);
  }
  getNumber(data: string) {
    return Number(data);
  }
  getIndexOfAnswerWithNonNullUserAnswer(index: number):string {
    const allAnswersNull = this.PLDTest.test_modules[0].questions[index].answers.every(answer => answer.user_answer_id === null);
  
    if (allAnswersNull) {
      this.actualAnswer = "Selecciona una opción...";

    } else {
      const answerWithNonNullUserAnswer = this.PLDTest.test_modules[0].questions[index].answers.find(answer => answer.user_answer_id !== null);
  
      if (answerWithNonNullUserAnswer) {
        this.actualAnswer = answerWithNonNullUserAnswer.description;
        // Forzar actualización manual del modelo
 
      }
    }
    return this.actualAnswer;

  }
  
  
  nextQuestion(
    question: Question,
    answer: Answer,
    idAnswer: number,
 
  ) {
    

    this.exam_progress = Number(((this.index + 1) * 100) / this.size);
    this.exam_progress=Number(this.exam_progress.toFixed(0));
  
    //this.PostsaveAnswers(question, answer)
    //Actualizar la pregunta en  el array
    
    if (this.index !== this.size) {
      // si las preguntas  no han terminado entonces avanzar
     this.next();
   
    }

    if (this.index === this.size) {
      this.finish = true; // Iniciar animación para terminar  la secuencia de preguntas
      this.index = this.index - 1;

      this.end = true;
    }

   // this.getIndexOfAnswerWithNonNullUserAnswer(this.index);
  }

}
export interface SendQuestions {
  IdQuestion: number;
  IdAnswer: number;
}
export interface End {
  text: string;
  description: string;
  color: string;
}
