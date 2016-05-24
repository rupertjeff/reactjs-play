<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Task
 *
 * @package App\Models
 */
class Task extends Model
{
    /**
     * @var array
     */
    protected $fillable = ['task'];

    public static function create(array $attributes = [])
    {
        $attributes['complete'] = false;
        
        return parent::create($attributes);
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
}
