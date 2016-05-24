<?php

namespace App\Http\Api;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Response as Statuses;
use League\Fractal\TransformerAbstract;
use Spatie\Fractal\Fractal;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class Responder
 *
 * @package App\Http\Api
 */
trait Responder
{
    /**
     * @param mixed $data
     * @param int   $status
     *
     * @return Response
     */
    protected abstract function respond(array $data, int $status = Statuses::HTTP_OK): Response;

    /**
     * @param Fractal|mixed       $data
     * @param TransformerAbstract $transformer
     * @param string              $key
     *
     * @return Response
     */
    protected function respondSuccess($data, TransformerAbstract $transformer = null, $key = ''): Response
    {
        if ( ! $data instanceof Fractal) {
            $data = $this->processData($data, $transformer, $key);
        }

        return $this->respond($data->toArray());
    }

    /**
     * @return Response
     */
    protected function respondNoContent()
    {
        return response(null, Statuses::HTTP_NO_CONTENT);
    }

    /**
     * @param mixed $error
     *
     * @return Response
     */
    protected function respondServerError($error): Response
    {
        return $this->respond($error, Statuses::HTTP_INTERNAL_SERVER_ERROR);
    }

    /**
     * @param mixed               $data
     * @param TransformerAbstract $transformer
     * @param string              $key
     *
     * @return Fractal
     */
    protected function processData($data, TransformerAbstract $transformer, string $key = ''): Fractal
    {
        $fractal = fractal();

        if ($this->isCollection($data)) {
            $fractal->collection($data, $transformer, $key);
        } else {
            $fractal->item($data, $transformer, $key);
        }

        return $fractal;
    }

    /**
     * @param mixed $data
     *
     * @return bool
     */
    protected function isCollection($data): bool
    {
        if ($data instanceof Model) {
            return false;
        }

        if ($data instanceof Arrayable) {
            return true;
        }

        if ( ! is_array($data)) {
            return false;
        }

        if ( ! array_key_exists(0, $data)) {
            return false;
        }

        return true;
    }
}
