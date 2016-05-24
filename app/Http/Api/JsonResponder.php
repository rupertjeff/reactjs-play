<?php

namespace App\Http\Api;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response as Statuses;

/**
 * Class JsonResponder
 *
 * @package App\Http\Api
 */
trait JsonResponder
{
    use Responder;

    /**
     * @param array $data
     * @param int   $status
     *
     * @return JsonResponse
     */
    protected function respond(array $data, int $status = Statuses::HTTP_OK): JsonResponse
    {
        return response()->json($data, $status);
    }
}
