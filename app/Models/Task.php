<?php

namespace App\Models;

use DB;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Task
 *
 * @package App\Models
 *
 * @method static int                                                                      count()
 * @method static \Illuminate\Database\Query\Builder|\Illuminate\Database\Eloquent\Builder orderBy($column, $direction = 'asc')
 */
class Task extends Model
{
    /**
     * @var array
     */
    protected $fillable = ['tasklist_id', 'task', 'sort'];

    /**
     * @return int
     */
    public static function getNextSortValue(): int
    {
        $count = self::count();

        return $count + 1;
    }

    /**
     * @param array $attributes
     *
     * @return Task
     */
    public static function create(array $attributes = [])
    {
        $attributes['complete'] = false;
        $attributes['sort']     = self::getNextSortValue();

        return parent::create($attributes);
    }

    /**
     * @param array $ids
     *
     * @return bool
     */
    public static function updateSort(array $ids)
    {
        $instance = new static;

        $count = 0;
        foreach ($ids as $id) {
            DB::table($instance->getTable())
                ->where('id', $id)
                ->update([
                    'sort' => ++$count,
                ]);
        }

        return true;
    }

    /**
     * @return int
     */
    public function getTasklistId(): int
    {
        return (int)$this->getAttribute('tasklist_id');
    }
    
    /**
     * @return string
     */
    public function getTask(): string
    {
        return $this->getAttribute('task');
    }

    /**
     * @return bool
     */
    public function isComplete(): bool
    {
        return (bool)$this->getAttribute('complete');
    }

    /**
     * @return int
     */
    public function getSort(): int
    {
        return (int)$this->getAttribute('sort');
    }
}
