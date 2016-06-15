<?php

namespace App\Http\Transformers;

use App\Models\Task as TaskModel;
use League\Fractal\TransformerAbstract;

/**
 * Class Task
 *
 * @package App\Http\Transformers
 */
class Task extends TransformerAbstract
{
    /**
     * @param TaskModel $task
     *
     * @return array
     */
    public function transform(TaskModel $task)
    {
        return [
            'id'         => $task->getKey(),
            'tasklistId' => $task->getTasklistId(),
            'task'       => $task->getTask(),
            'complete'   => $task->isComplete(),
        ];
    }
}
