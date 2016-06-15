<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddFieldsTablesForMultipleTaskLists extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tasklists', function (Blueprint $table) {
            $table->increments('id');

            $table->string('name');
            $table->unsignedInteger('sort');

            $table->timestamps();
        });

        Schema::table('tasks', function (Blueprint $table) {
            $table->unsignedInteger('tasklist_id')->after('id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::tabel('tasks', function (Blueprint $table) {
            $table->dropColumn('tasklist_id');
        });

        Schema::drop('tasklists');
    }
}
