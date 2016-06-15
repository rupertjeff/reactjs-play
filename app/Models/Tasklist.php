<?php

namespace App\Models;

use DB;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Tasklist
 *
 * @package App\Models
 *
 * @method static int                                                                      count()
 * @method static \Illuminate\Database\Query\Builder|\Illuminate\Database\Eloquent\Builder orderBy($column, $direction = 'asc')
 */
class Tasklist extends Model
{
    /**
     * @var array
     */
    protected $fillable = ['name', 'sort'];

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
        $attributes['sort'] = self::getNextSortValue();

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
     * @return string
     */
    public function getName(): string
    {
        return $this->getAttribute('name');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function tasks()
    {
        return $this->hasMany(Task::class);
    }
}
