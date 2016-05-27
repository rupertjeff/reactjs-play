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
        // .scripts([
        //     './node_modules/react/dist/react-with-addons.min.js',
        //     './node_modules/react-dom/dist/react-dom.min.js',
        //     './node_modules/react-dnd/dist/ReactDnD.min.js',
        //     './node_modules/react-dnd-html5-backend/dist/ReactDnDHTML5Backend.min.js'
        // ], 'public/js/react.js')
        // .scripts([
        //     './node_modules/axios/dist/axios.min.js'
        // ], 'public/js/helpers.js')
        // .babel([
        //     'config.js',
        //     'services/task.js',
        //     'components/task.js',
        //     'components/taskList.js',
        //     'components/taskForm.js',
        //     'components/todoList.js'
        // ], 'public/js/app.js')
        .version([
            'css/bootstrap.css'
            // 'js/react.js',
            // 'js/helpers.js',
            // 'js/app.js'
        ]);
});
