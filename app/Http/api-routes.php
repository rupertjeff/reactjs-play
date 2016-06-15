<?php

Route::group(['prefix' => 'tasks'], function () {
    Route::get('/', ['uses' => 'TaskController@index']);
    Route::post('/', ['uses' => 'TaskController@store']);
    Route::put('{task}', ['uses' => 'TaskController@update']);
    Route::delete('{task}', ['uses' => 'TaskController@destroy']);
    Route::patch('sort', ['uses' => 'TaskController@updateSort']);
});

Route::group(['prefix' => 'tasklists'], function () {
    Route::get('/', ['uses' => 'TaskListController@index']);
    Route::post('/', ['uses' => 'TaskListController@store']);
    Route::get('{tasklist}', ['uses' => 'TaskListController@show']);
    Route::delete('{tasklist}', ['uses' => 'TaskListController@destroy']);
    Route::patch('sort', ['uses' => 'TaskListController@updateSort']);
});
