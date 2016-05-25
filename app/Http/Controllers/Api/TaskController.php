<?php

namespace App\Http\Controllers\Api;

use App\Http\Api\JsonResponder;
use App\Http\Controllers\Controller;
use App\Http\Transformers\Task as TaskTransformer;
use App\Models\Task;
use Illuminate\Http\Request;

/**
 * Class TaskController
 *
 * @package App\Http\Controllers\Api
 */
class TaskController extends Controller
{
    use JsonResponder;

    /**
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        return $this->respondSuccess(Task::orderBy('sort', 'asc')->get(), new TaskTransformer, 'task');
    }

    /**
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        return $this->respondSuccess(Task::create($request->only(['task'])), new TaskTransformer, 'task');
    }

    /**
     * @param Request $request
     * @param Task    $task
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Task $task)
    {
        $values = $request->only(['task', 'complete']);

        $task->task     = $values['task'];
        $task->complete = (bool)$values['complete'];
        $task->save();

        return $this->respondSuccess($task, new TaskTransformer, 'task');
    }

    /**
     * @param Task $task
     *
     * @return \Symfony\Component\HttpFoundation\Response
     * @throws \Exception
     */
    public function destroy(Task $task)
    {
        $task->delete();

        return $this->respondNoContent();
    }

    /**
     * @param Request $request
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function updateSort(Request $request)
    {
        (new Task)->updateSort($request->get('ids'));
        $tasks = Task::all();

        return $this->respondSuccess($tasks, new TaskTransformer, 'task');
    }
}
