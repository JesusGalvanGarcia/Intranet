import {TestModel} from './evaluationDetail';
export class CollaboratorEvaluation {
    user_evaluation_id: string;
    evaluation_id: string;
    collaborator_id: string;
    collaborator_name: string;
    responsable_name: string;
    process_id: string;
    actual_process: string;
    finish_date: Date | null;
    start_date: Date | null;

    status: string;
    detail:TestModel[]
  }
  
  
 