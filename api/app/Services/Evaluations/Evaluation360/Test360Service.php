<?php

namespace App\Services\Evaluations\Evaluation360;

use App\Models\Task;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\ServiceProvider;
use App\Mail\Evaluations\Evaluation360\sendEmail360 as sendEmail360;
use App\Models\Process;
use App\Models\User;
use App\Models\UserActionPlan;
use App\Mail\Evaluations\Evaluation360\signatures360 as Signatures360;
use App\Mail\Evaluations\Evaluation360\evaluation360 as evaluation360;
use App\Mail\Evaluations\Evaluation360\sendReport as sendReport;

use App\Models\UserCollaborator;


use App\Mail\Evaluations\Evaluation360\actionPlan360 as ActionPlan;


class Test360Service extends ServiceProvider
{
    static function sendEmail360($evaluation, $name, $email,$date)
    {

        Mail::to($email)->send(new sendEmail360($name,$evaluation,$email,$date));

    }

    static function sendTestMail($evaluation_data)
    {  

        // Se obtiene el nombre de
        $evaluated_user = User::find($evaluation_data['user_evaluation']->user_id);

        $responsable_user = User::find($evaluation_data['user_evaluation']->responsable_id);

        $responsable_leader_id = UserCollaborator::where('collaborator_id', $evaluation_data['user_evaluation']->responsable_id)->first();
        $responsable_leader = User::find($responsable_leader_id?->user_id);

        $process = Process::find($evaluation_data['user_evaluation']->process_id);

      
        $mail = Mail::to($responsable_user?->email)->cc(['francisco.delarosa@trinitas.mx'])->send(new evaluation360($evaluation_data, $evaluated_user, $responsable_user, $process));
       
        
    }
    static function sendReport($evaluation_data)
    {  

        // Se obtiene el nombre de
        $evaluated_user = User::find($evaluation_data->user_id);      
        $mail = Mail::to( $evaluated_user?->email)->cc(['francisco.delarosa@trinitas.mx'])->send(new sendReport($evaluated_user->name, $evaluated_user->id,$evaluation_data->evaluation_id));
       
        
    }

    static function sendConfirmMail($user_evaluation, $evaluation_name, $file)
    {
        $evaluated_user = User::find($user_evaluation->user_id);

        $responsable_user = User::find($user_evaluation->responsable_id);

        $responsable_leader_id = UserCollaborator::where('collaborator_id', $user_evaluation->responsable_id)->first();

        $responsable_leader = User::find($responsable_leader_id?->user_id);

        $mail = Mail::to('brenda.ortiz@trinitas.mx')->cc('francisco.delarosa@trinitas.mx')->send(new ActionPlan($evaluation_name, $evaluated_user, $responsable_user,$file));
       // $mail = Mail::to($evaluated_user->email)->cc(['francisco.delarosa@trinitas.mx', $responsable_leader?->email])->send(new Signatures($evaluation_name, $evaluated_user, $responsable_user));

    }
    static function findUserActionPlan(UserActionPlan $user_action_plan)
    {

        if ($user_action_plan->action_plan)
            if ($user_action_plan->action_plan->evaluation)
                if ($user_action_plan->action_plan->evaluation->user_evaluations)
                    return  $user_action_plan->action_plan->evaluation->user_evaluations
                        ->where('user_id', $user_action_plan->user_id)
                        ->where('responsable_id', $user_action_plan->responsable_id)
                        ->first();

                else
                    return false;
            else
                return false;
        else
            return false;
    }

    static function sendConfirmSignaturesMail($user_evaluation, $evaluation_name)
    {

        $evaluated_user = User::find($user_evaluation->user_id);

        $responsable_user = User::find($user_evaluation->responsable_id);

        $responsable_leader_id = UserCollaborator::where('collaborator_id', $user_evaluation->responsable_id)->first();
        $responsable_leader = User::find($responsable_leader_id?->user_id);

        $mail = Mail::to('brenda.ortiz@trinitas.mx')->cc('francisco.delarosa@trinitas.mx')->send(new Signatures360($evaluation_name, $evaluated_user, $responsable_user));
    // $mail = Mail::to($evaluated_user->email)->cc(['francisco.delarosa@trinitas.mx', $responsable_leader?->email])->send(new Signatures($evaluation_name, $evaluated_user, $responsable_user));
    }

  
}
