<?php

namespace App\Providers;

use Illuminate\Routing\Router;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;

/**
 * Class RouteServiceProvider
 *
 * @package App\Providers
 */
class RouteServiceProvider extends ServiceProvider
{
    /**
     * This namespace is applied to your controller routes.
     *
     * In addition, it is set as the URL generator's root namespace.
     *
     * @var string
     */
    protected $namespace = 'App\Http\Controllers';

    /**
     * Define your route model bindings, pattern filters, etc.
     *
     * @param  \Illuminate\Routing\Router $router
     *
     * @return void
     */
    public function boot(Router $router)
    {
        parent::boot($router);
    }

    /**
     * Define the routes for the application.
     *
     * @param  \Illuminate\Routing\Router $router
     *
     * @return void
     */
    public function map(Router $router)
    {
        $this->mapApiRoutes($router);
        $this->mapWebRoutes($router);
    }

    /**
     * Define the "api" routes for the application.
     *
     * These routes all receive session state, JWT instead of CSRF, etc.
     *
     * @param Router $router
     */
    protected function mapApiRoutes(Router $router)
    {
        $router->group([
            'namespace'  => $this->namespace . '\Api',
            'middleware' => 'api',
            'prefix'     => 'api',
        ], function ($router) {
            require app_path('Http/api-routes.php');
        });
    }

    /**
     * Define the "web" routes for the application.
     *
     * These routes all receive session state, CSRF protection, etc.
     *
     * @param  \Illuminate\Routing\Router $router
     *
     * @return void
     */
    protected function mapWebRoutes(Router $router)
    {
        $router->group([
            'namespace'  => $this->namespace,
            'middleware' => 'web',
        ], function ($router) {
            require app_path('Http/routes.php');
        });
    }
}
