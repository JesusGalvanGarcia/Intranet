import { Component, OnInit } from '@angular/core';
import { UserEvaluationService } from '../../../../shared/services/Evaluations/Desempeño/userEvaluation.service';
import { Chart, ChartType } from 'chart.js/auto';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Evaluation360Service } from '@services/Evaluations/Evaluation360/evaluation360.service';
import { MatCardModule } from '@angular/material/card';
import { LoadingComponent } from '../../../app/loading/loading.component';
import jspdf from 'jspdf';
import { ElementRef, Renderer2 } from '@angular/core';
import html2canvas from 'html2canvas';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import { MensajeService } from '@http/mensaje.service';

@Component({
  selector: 'app-personal360',
  standalone: true,
  templateUrl: './personal360.component.html',
  styleUrls: ['./personal360.component.css'],
  imports:[CommonModule,MatCardModule,  LoadingComponent]
})
export class Personal360Component implements OnInit {
  body: any;
  promedioData: any;
  evaluatorData: any;
  generalData: any;
  general:any;
  auto:any;
  names:any;
  email:any;
  modulesGrafic:any;
  tableLabels: any;
  tableData: any;
  isLoading:boolean=true;
  user_id:number;
  name:any;
  rol:any;
  see:boolean=true;
  lideres:any;
  lateral:any;
  question_averages:any;
  colaboradores:any;
  autoevaluacion:any;
  cliente:any;
  evaluation_id:number;
  // Atributo que almacena los datos del chart
  public chart: Chart;
  response:any;
  menuVisible: boolean = false;

 
  ngOnInit(): void {
    var user=localStorage.getItem("email");

    this.name=localStorage.getItem("collaborator_name");
    this.rol=localStorage.getItem("admin");
    this.getData();
  }
  constructor(private el: ElementRef, private renderer: Renderer2,public message:MensajeService,public evaluation360:Evaluation360Service,public evaluationService: UserEvaluationService, public router:Router,   private route: ActivatedRoute, 
    ) {
    this.route.params.subscribe(params => {
      this.user_id = params['idUser']; 
      this.evaluation_id = params['idEvaluation']; 
    });

  }

scrollToElement(id:any) {
    var element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
    }
  }
  postApproved()
  {
    this.isLoading=true;
    let data = {
      user_evaluation: this.user_id,
      user_id: localStorage.getItem("user_id"),
      evaluation_id: this.evaluation_id
    };
    this.evaluation360.changeStatus(data)
    .then((response: any) => {
     this.message.success("El  reporte se ha aprobado con exito");
     this.back();
    })
    .catch((error: any) => {
      this.isLoading=false;
      this.message.warning(error.message+" "+error.code);

      // Handle errors here
    });
  }
  toggleMenu() {
    this.menuVisible = !this.menuVisible; // Alternar la visibilidad del menú
  }
  back()
  { 
    localStorage.setItem("page_evaluation",  this.evaluation_id.toString());
    if( this.rol=localStorage.getItem("admin")!="")
   {
     this.router.navigate(['admin360']);
 
   }
    else
    this.router.navigate(['evaluacion360']);

  }
  numbers(num:any)
  {
    return num.toFixed(1);
  }
  sum(labels: any): number {
    // Calculate the sum of values in the labels array
    return labels.reduce((accumulator: number, currentValue: number) => accumulator + currentValue, 0);
}

average(aspect: any, question: any,autoevaluacion:any): any {
    let labels = Object.values(this.question_averages[aspect][question]);

    // Check if labels.length is zero to avoid division by zero
    if (labels.length === 0) {
        return 'N/A';
    }

    // Calculate the average
    let avg = this.sum(labels) / labels.length;

    // Check if the result is NaN
    if (isNaN(avg)) {
        return 'N/A';
    }

    return (avg - autoevaluacion).toFixed(2);
}

  
  async getData() {
    this.body = {
      user_id: this.user_id,
      user_id_valid: localStorage.getItem("user_id"),
      evaluation_id: this.evaluation_id
    };

    try {
      const response = await this.evaluation360.GetAverages(this.body);
     
      this.promedioData = response.modulos;
      this.evaluatorData = response.evaluador;
      this.generalData = response.general;
      this.colaboradores=response.evaluator_keys;
      this.modulesGrafic=response.grafica_keys;
      this.question_averages=response.question_averages;
      this.response=response.Comments;
      this.tableLabels = response.modules_keys;      
      this.names=response.user.collaborator_name;
      this.email=response.user.email;
      this.general=response.general_average;
      this.auto=response.general_auto_average;
      this.tableData= response.general_auto_average;
      this.processData(response.grafica_keys ,response.modules_values,'radar','chart','Promedio por modulo');
      this.processData(response.evaluator_keys,response.evaluator_values ,'bar','evaluators','Promedio  por evaluador');
      this.processData(response.grafica_keys ,response.modules_values,'bar','promedio','Promedio general');
      this.isLoading=false;
    } catch (error:any) {
      this.isLoading=false;
      this.message.warning(error.message+" "+error.code);
    
    }
  }
  checkNan(data:any)
  {
    return isNaN(data); 
  }
  getObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }
  private processData(datas: any,values:any, name: any, grafic: any, title: any): void {
    const labels = datas;
  
    // Define un array de colores para cada barra
    const backgroundColors: string[] = [
      'rgba(255, 99, 132, 0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(255, 205, 86, 0.2)',
      'rgba(75, 192, 192, 0.2)',
      'rgba(153, 102, 255, 0.2)',
      'rgba(255, 159, 64, 0.2)',
      'rgba(255, 0, 0, 0.2)',
      'rgba(0, 255, 0, 0.2)',
      'rgba(0, 0, 255, 0.2)',
      'rgba(128, 128, 0, 0.2)',
      'rgba(0, 128, 128, 0.2)',
      'rgba(128, 0, 128, 0.2)',
      'rgba(255, 140, 0, 0.2)',
      'rgba(0, 255, 255, 0.2)',
      'rgba(255, 0, 255, 0.2)',
    ];
   const colors=this.shuffleArray(backgroundColors);
  
    const data = {
      labels: labels,
      datasets: [
        {
          label: title,
          data: values,
          backgroundColor: colors,
          borderColor: colors.map(color => color.replace('0.2', '1')), // Bordes con opacidad completa
          borderWidth: 1
        }
      ]
    };
  
    this.chart = new Chart(grafic, {
      type: name as ChartType,
      data: data,
      options: {
        responsive: true,
        indexAxis: 'y',
        scales: {
          r: {
            beginAtZero: true
          }
        },
        plugins: {
          datalabels: {
            anchor: 'end',
            align: 'end',
            formatter: function(value, context) {
              return value; // Devuelve el valor de la etiqueta
            }
          }
        }
      },
      plugins: [ChartDataLabels] // Agrega el plugin como una extensión
    });
    
    
  }
  
  onSelect(event: any): void {

  }
   shuffleArray(array: any[]): any[] {
    let currentIndex = array.length, randomIndex;
  
    // Mientras queden elementos a mezclar
    while (currentIndex !== 0) {
  
      // Selecciona un elemento sin mezclar
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // Intercambia el elemento seleccionado con el actual
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }
  

  convertToPDF(): void {
    const divElement = this.el.nativeElement.querySelector('#boton');
    const divElementMargen = this.el.nativeElement.querySelector('#reporte');

    // Verifica si se encontró el elemento antes de modificarlo
    if (divElement) {
      // Cambia el estilo del elemento
      this.renderer.setStyle(divElement, 'display', 'none');
      this.renderer.setStyle(divElementMargen, 'padding-left', '0px');

    }
    this.isLoading=true;
  
    const pdf = new jspdf('p', 'mm', 'a4');
  
    const addNewPage = () => {
      pdf.addPage();
    };
  
    const convertElementToPDF = async (elementId: string) => {
      this.see=false;
      const dataElement = document.getElementById(elementId);
  
      if (dataElement) {
        const canvas = await html2canvas(dataElement);
  
        const imgWidth = 208;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
        const contentDataURL = canvas.toDataURL('image/png');
        pdf.addImage(contentDataURL, 'PNG', 0, 0, imgWidth, imgHeight);
     
      } else {
        console.error(`No se encontró el elemento con el ID "${elementId}".`);
      }
    };
    const convertElementToTablePDF = async (elementId: string,pages:number) => {
      // Get the content element
      const dataElement = document.getElementById(elementId);
    
      // Check if the main content element exists
      if (dataElement) {
        // Get the total height of the content
        const totalHeight = 2000
    
        // Set the canvas height to the total height
        const canvas = await html2canvas(dataElement, { height: totalHeight });
        const imgWidth = 208;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
        // Calculate the number of pages based on the canvas height
        const numPages =pages;
    
        // Create a new jsPDF instance
        let starts=[208,2000,3900,5700,6700,7000]
        // Loop through each page and add it to the PDF
        for (let page = 0; page < numPages; page++) {
          // Capture each page individually
          const pageCanvas = await html2canvas(dataElement, {
            height: totalHeight,
            windowHeight: canvas.height,
            y: starts[page],
          });
    
          // Add the image of each page to the PDF
          pdf.addImage(pageCanvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight);
    
          // Add a new page for the next iteration (if there are more pages)
       
          if (page < numPages - 1) {
            pdf.addPage();
          }
          
        }
    
        // Save the PDF
    
      }
    };
    
  
    const convertAllElements = async () => {
      try{
        await convertElementToTablePDF('reporte',5);

      // Puedes agregar más llamadas a convertElementToPDF para otros elementos
  
      pdf.save('Reporte-360.pdf');
      this.isLoading=false;
      const divElement = this.el.nativeElement.querySelector('#boton');

      // Verifica si se encontró el elemento antes de modificarlo
      if (divElement) {
        // Cambia el estilo del elemento
        this.renderer.setStyle(divElement, 'display', 'flex');
        this.renderer.setStyle(divElementMargen, 'padding-left', '80px');

      }
    } catch (error) {
      this.isLoading=false;
      console.error( error);
    }
    };
  
    convertAllElements();
  
  }
  
}
