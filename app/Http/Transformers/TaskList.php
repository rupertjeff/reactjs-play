<?php

namespace App\Http\Transformers;

use App\Models\Tasklist as TasklistModel;
use League\Fractal\TransformerAbstract;

/**
 * Class TaskList
 *
 * @package App\Http\Transformers
 */
class TaskList extends TransformerAbstract
{
    /**
     * @var array
     */
    protected $defaultIncludes = [
        'tasks'
    ];

    /**
     * @param TasklistModel $tasklist
     *
     * @return array
     */
    public function transform(TasklistModel $tasklist)
    {
        return [
            'id' => $tasklist->getKey(),
            'name' => $tasklist->getName(),
        ];
    }

    /**
     * @param TasklistModel $tasklist
     *
     * @return \League\Fractal\Resource\Collection
     */
    public function includeTasks(TasklistModel $tasklist)
    {
        return $this->collection($tasklist->tasks()->orderBy('sort', 'asc')->get(), new Task, 'task');
    }
}
