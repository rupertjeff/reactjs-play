<!DOCTYPE html>
<html>
    <head>
        <title>Laravel</title>

        {!! Html::style(elixir('css/bootstrap.css')) !!}

        <script src="https://fb.me/react-15.0.2.js"></script>
        <script src="https://fb.me/react-dom-15.0.2.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.8.23/browser.min.js"></script>
        <script src="https://npmcdn.com/axios/dist/axios.min.js"></script>
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
