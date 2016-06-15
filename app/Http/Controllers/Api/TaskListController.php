<?php

namespace App\Http\Controllers\Api;

use App\Http\Api\JsonResponder;
use App\Http\Controllers\Controller;
use App\Http\Transformers\TaskList as TaskListTransformer;
use App\Models\Tasklist;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Class TaskListController
 *
 * @package App\Http\Controllers\Api
 */
class TaskListController extends Controller
{
    use JsonResponder;

    /**
     * @return JsonResponse
     */
    public function index()
    {
        return $this->respondSuccess(Tasklist::orderBy('sort', 'asc')->get(), new TaskListTransformer, 'tasklist');
    }

    /**
     * @param Request $request
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function store(Request $request)
    {
        return $this->respondSuccess(Tasklist::create($request->only(['name'])), new TaskListTransformer, 'tasklist');
    }

    public function show(Tasklist $tasklist)
    {
        return $this->respondSuccess($tasklist, new TaskListTransformer, 'tasklist');
    }

    /**
     * @param Tasklist $tasklist
     *
     * @return \Symfony\Component\HttpFoundation\Response
     * @throws \Exception
     */
    public function destroy(Tasklist $tasklist)
    {
        $tasklist->delete();

        return $this->respondNoContent();
    }

    public function updateSort(Request $request)
    {
        Tasklist::updateSort($request->get('ids'));
        $tasklists = Tasklist::all();

        return $this->respondSuccess($tasklists, new TaskListTransformer, 'tasklist');
    }
}
