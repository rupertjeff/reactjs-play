var elixir = require('laravel-elixir');

require('laravel-elixir-webpack-advanced');

elixir.config.js.babel.options.presets = [
    'react'
];

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */

elixir(function(mix) {
    mix.sass('bootstrap.scss')
        .scripts('test.js')
        .version([
            'css/bootstrap.css',
            'js/test.js'
        ]);
});
