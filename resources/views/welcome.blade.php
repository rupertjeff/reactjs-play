<!DOCTYPE html>
<html>
    <head>
        <title>Laravel</title>

        {!! Html::style(elixir('css/bootstrap.css')) !!}

        <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.8.23/browser.min.js"></script>
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

        {!! Html::script('js/test.js', ['type' => 'text/babel']) !!}
    </body>
</html>
