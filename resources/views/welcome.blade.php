<!DOCTYPE html>
<html>
    <head>
        <title>Laravel</title>

        {!! Html::style(elixir('css/bootstrap.css')) !!}

        <script>
            window.baseUrl = '{{ url('/') }}';
        </script>
    </head>
    <body>
        <div class="container-fluid">
            <div class="content" id="todo-list">
            </div>
        </div>

        {!! Html::script('js/common.js') !!}
        {!! Html::script('js/app.js') !!}
    </body>
</html>
