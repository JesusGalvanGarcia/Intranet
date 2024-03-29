<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserEvaluation extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = "user_evaluations";

    protected $fillable = [
        'user_id',
        'evaluation_id',
        'actual_attempt',
        'process_id',
        'type_evaluator_id',
        'responsable_id',
        'actual_attempt',
        'finish_date',
        'status_id',
        'created_by',
        'updated_by',
        'deleted_by'
    ];

    public function user_tests()
    {
        return $this->hasMany(UserTest::class);
    }

    public function evaluation()
    {
        return $this->belongsTo(Evaluation::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
