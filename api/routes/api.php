<?php

use App\Http\Controllers\Evaluations\Evaluation\EvaluationController;
use App\Http\Controllers\Evaluations\Evaluation\LoginController;
use App\Http\Controllers\Evaluations\Evaluation\ToolsController;
use App\Http\Controllers\Evaluations\Evaluation\UserActionPlanController;
use App\Http\Controllers\Evaluations\Asesores\AsesoresController;

use App\Http\Controllers\Evaluations\Evaluation360\ActionPlan360Controller;
use App\Http\Controllers\Evaluations\DesempeñoCompetencias\UserEvaluationController;
use App\Http\Controllers\PLD\PLDUsersController;
use App\Http\Controllers\Evaluations\DesempeñoCompetencias\UserTestController;
use App\Http\Controllers\PLD\TestController;
use App\Http\Controllers\Evaluations\Evaluation\UserController;
use App\Http\Controllers\Evaluations\Evaluation360\Evaluation360Controller;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Aws\S3\S3Client;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/login', [LoginController::class, 'login'])->name('login');
//Route::get('/PLDUser', [PLDUserController::class, 'index'])->name('index');
Route::resource('/PLDUser', PLDUsersController::class, [
    'names' => [
        'index' => 'Consultar examenes pld del Usuario',
        'show' => 'Consultar Detalle de las Evaluaciones del Usuario',

    ]
]);

Route::get('/user', [UserController::class, 'index'])->name('Consultar Usuarios');

Route::resource('/evaluations', EvaluationController::class, [
    'names' => [
        'index' => 'Consultar Evaluaciones',
        'store' => 'Registrar Evaluaciones',
        'show' => 'Consultar Detalle de la Evaluación',
        'update' => 'Actualizar Evaluación',
        'destroy' => 'Borrar Evaluaciones'
    ]
]);

Route::resource('/user-evaluations', UserEvaluationController::class, [
    'names' => [
        'index' => 'Consultar Evaluaciones del Usuario',
        'store' => 'Registrar Evaluaciones al Usuario',
        'show' => 'Consultar Detalle de las Evaluaciones del Usuario',
        'update' => 'Actualizar Evaluaciones del Usuario',
        'destroy' => 'Borrar Evaluaciones del Usuario'
    ]
]);

Route::post('/user/sendPasswordResetEmail', [UserController::class, 'sendPasswordResetEmail'])->name('Enviar correo para cambio de contraseña');
Route::post('/user/resetPassword', [UserController::class, 'resetPassword'])->name('Cambiar contraseña');
Route::get('/evaluation360/showTest/{id}', [Evaluation360Controller::class, 'showTest'])->name('Ver tests');

Route::post('/evaluation360/changeStatus', [Evaluation360Controller::class, 'changeStatus'])->name('Cambiar status');
Route::post('/evaluation360/getFinish360', [Evaluation360Controller::class, 'getFinish360'])->name('Consultar reporte 360');
Route::post('/evaluation360/get360', [Evaluation360Controller::class, 'get360'])->name('Consultar evaluacinoes 360');
Route::post('/evaluation360/Users', [Evaluation360Controller::class, 'Users'])->name('Consultar users 360');
Route::post('/evaluation360/Users360', [Evaluation360Controller::class, 'Users360'])->name('Consultar users 360');
Route::post('/evaluation360/assign', [Evaluation360Controller::class, 'assign'])->name('Asignar clientes  internos');
Route::post('/evaluation360/assignUsers', [Evaluation360Controller::class, 'assignUsers'])->name('Consultar clientes  internos');
Route::post('/evaluation360/assign360', [Evaluation360Controller::class, 'assign360'])->name('Consultar clientes  internos');
Route::post('/evaluation360/getPersonal360', [Evaluation360Controller::class, 'getPersonal360'])->name('Crear asesores');
Route::post('/evaluation360/getUsersAdmin360', [Evaluation360Controller::class, 'getUsersAdmin360'])->name('Crear asesores');
Route::post('/evaluation360/actionPlan', [Evaluation360Controller::class, 'actionPlan'])->name('Consultar planes de  accion');
Route::post('/evaluation360/saveAnswer360', [Evaluation360Controller::class, 'saveAnswer360'])->name('Guardar Respuesta del Usuario');
Route::post('/evaluation360/saveSuggetions', [Evaluation360Controller::class, 'saveSuggetions'])->name('Guardar Respuesta del Usuario');
Route::post('/evaluation360/getPreview', [Evaluation360Controller::class, 'getPreview'])->name('Cosultar modulos de test');
Route::post('/evaluation360/saveAnswerAverage', [Evaluation360Controller::class, 'saveAnswerAverage'])->name('Guardar promedio del modulo');
Route::post('/evaluation360/getAverages', [Evaluation360Controller::class, 'getAverages'])->name('Cosultar promedios');

Route::resource('/evaluation360', Evaluation360Controller::class, [
    'names' => [
        'index' => 'Consultar Evaluaciones del Usuario',
        'show' => 'Consultar Usuarios',
        
    ]
]);
Route::resource('/asesores', AsesoresController::class, [
    'names' => [
        'index' => 'Consultar Evaluaciones del Usuario',
        'show' => 'Consultar Usuarios',
        
    ]
]);
Route::post('/asesores/saveAnswerAsesores', [AsesoresController::class, 'saveAnswerAsesores'])->name('Guardar promedio del modulo');
Route::post('/asesores/assignAsesors', [AsesoresController::class, 'assignAsesors'])->name('Guardar promedio del modulo');
Route::get('/asesores/showTest/{id}', [AsesoresController::class, 'showTest'])->name('Ver tests');


// Route::post('/user-tests/saveAnswers', [UserTestController::class, 'saveAnswers'])->name('Guardar Respuestas del Usuario');
Route::post('/user-tests/saveAnswer', [UserTestController::class, 'saveAnswer'])->name('Guardar Respuesta del Usuario');
Route::post('/PLDUser/saveAnswerPLD', [PLDUsersController::class, 'saveAnswerPLD'])->name('Guardar Respuesta del Usuario');
Route::post('/PLDUser/showExams', [PLDUsersController::class, 'showExams'])->name('Ver examenes');
Route::post('/user-tests/saveModuleNote', [UserTestController::class, 'saveModuleNote'])->name('Guardar nota del modulo');
Route::post('/user-tests/saveSuggetions', [UserTestController::class, 'saveSuggetions'])->name('Guardar campos del test');

Route::post('/user-tests/changeProcess', [UserTestController::class, 'changeProcess'])->name('Cambiar de proceso');
Route::resource('/user-tests', UserTestController::class, [
    'names' => [
        'index' => 'Consultar Pruebas del Usuario',
        'store' => 'Registrar Pruebas del Usuario',
        'show' => 'Consultar Detalle de las Pruebas del Usuario',
        'update' => 'Actualizar Pruebas del Usuario',
        'destroy' => 'Borrar Pruebas del Usuario'
    ]
]);
Route::get('/test/pld', [TestController::class, 'showPLD'])->name('Mostrar los Tests de PLD');
Route::get('/test/pldForm/{id_test}', [TestController::class, 'indexPLD'])->name('Mostrar el formulario del Test de PLD');
Route::put('/test/pldForm/{id_test}', [TestController::class, 'updatePLD'])->name('Actualizar formulario Test de PLD');
Route::post('/test/pld', [TestController::class, 'storePLD'])->name('Registrar Test PLD');
Route::delete('/test/pld/{id}', [TestController::class, 'destroy'])->name('Borrar el Test');


Route::post('/user-actionPlan/confirmActionPlan', [UserActionPlanController::class, 'confirmActionPlan'])->name('Confirmar Plan de Acción');
Route::post('/user-actionPlan/storeSignature', [UserActionPlanController::class, 'storeSignature'])->name('Guardar Firma del Usuario');
Route::resource('/user-actionPlan', UserActionPlanController::class, [
    'names' => [
        'index' => 'Consultar Planes de Acción del Usuario',
        'store' => 'Registrar Plan de Acción del Usuario',
        'show' => 'Consultar Detalle Plan de Acción del Usuario',
        'update' => 'Actualizar Plan de Acción del Usuario',
        'destroy' => 'Borrar Plan de Acción del Usuario'
    ]
]);
Route::post('/action-Plan360/confirmActionPlan', [ActionPlan360Controller::class, 'confirmActionPlan'])->name('Confirmar Plan de Acción');
Route::post('/action-Plan360/storeSignature', [ActionPlan360Controller::class, 'storeSignature'])->name('Guardar Firma del Usuario');
Route::resource('/action-Plan360', ActionPlan360Controller::class, [
    'names' => [
        'index' => 'Consultar Planes de Acción del Usuario',
        'store' => 'Registrar Plan de Acción del Usuario',
        'show' => 'Consultar Detalle Plan de Acción del Usuario',
        'update' => 'Actualizar Plan de Acción del Usuario',
        'destroy' => 'Borrar Plan de Acción del Usuario'
    ]
]);
Route::get('/tools/permissions', [ToolsController::class, 'permissions'])->name('Consultar Permisos');
Route::post('/tools/permissions/create', [ToolsController::class, 'storePermissions'])->name('Crear Permisos');
Route::post('/tools/permissions/assign', [ToolsController::class, 'assignPermissions'])->name('Asignar Permisos');
Route::post('/tools/permissions/check', [ToolsController::class, 'checkPermission'])->name('Comprobar Permisos');
Route::get('/tools/roles', [ToolsController::class, 'roles'])->name('Consultar Roles');
Route::get('/tools/roles/get', [ToolsController::class, 'role'])->name('Consultar Roles');
Route::post('/tools/roles/create', [ToolsController::class, 'storeRoles'])->name('Crear Roles');
Route::post('/tools/roles/assign', [ToolsController::class, 'assignRoles'])->name('Asignar Roles');
