<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::group(['prefix' => 'api', 'namespace' => 'Api'], function () {
    Route::group(['prefix' => 'tasks'], function () {
        Route::get('/', ['uses' => 'TaskController@index']);
        Route::post('/', ['uses' => 'TaskController@store']);
        Route::put('/{task}', ['uses' => 'TaskController@update']);
        Route::delete('/{task}', ['uses' => 'TaskController@destroy']);
    });
});

Route::get('/', function () {
    return view('welcome');
});
