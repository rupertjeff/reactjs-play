<!DOCTYPE html>
<html>
    <head>
        <title>Laravel</title>

        {!! Html::style(elixir('css/bootstrap.css')) !!}

        {!! Html::script(elixir('js/react.js')) !!}
        {!! Html::script(elixir('js/helpers.js')) !!}
        <script>
            window.baseUrl = '{{ url('/') }}';
        </script>
    </head>
    <body>
        <div class="container-fluid">
            <div class="content" id="todo-list">
            </div>
        </div>

        {!! Html::script('js/app.js') !!}
    </body>
</html>
