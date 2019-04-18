## html
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="format-detection" content="telephone=no,email=no">
    <title></title>
    <link rel="stylesheet" href="./css/reset.css">
    <link rel="stylesheet" href="./css/common.css">
    <link rel="stylesheet" href="./css/font.css">
    <script src="./js/rem.js"></script>
    <style type="text/css">

    </style>

<body>


    <script src=""></script>
    <script>

    </script>
</body>

</html>
```

**vscode**

```json
{
    "myhtml5": {
        "prefix": "html",
        "body": [
            "<!DOCTYPE html>",
            "<html lang=\"en\">",

            "<head>",
            "\t<meta charset=\"UTF-8\">",
            "\t<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no\">",
            "\t<meta http-equiv=\"X-UA-Compatible\" content=\"ie=edge\">",
            "\t<meta name=\"format-detection\" content=\"telephone=no,email=no\">",
            "\t<title>$1</title>",
            "\t<link rel=\"stylesheet\" href=\"./css/reset.css\">",
            "\t<link rel=\"stylesheet\" href=\"./css/common.css\">",
            "\t<link rel=\"stylesheet\" href=\"./css/font.css\">",
            "\t<script src=\"./js/rem.js\"></script>",
            "\t<style type=\"text/css\">",
            "\t</style>",
            "</head>",
            "<body>",
            "$2",
            "\t<script src=\"\"></script>",
            "\t<script>",
            "\t</script>",
            "</body>",
            "</html>"
        ],
        "description": "create my html5 document"
    }
}
```

## vue

```vue
<template>
    <div id=""></div>
</template>

<script>

export default {
    name: '',
    data () {
        return {

        }
    },
    components: {

    },
    methods: {

    }
}
</script>
```

**vscode**

```json
{
    "myvue": {
        "prefix": "vueHtml",
        "body": [
            "<template>",
            "\t<div id=\"$1\"></div>",
            "</template>\n",
            "<script>\n",
            "export default {",
            "\tname: '$2',",
            "\tdata () {",
            "\t\treturn {\n",
            "\t\t}",
            "\t},",
            "\tcomponents: {\n",
            "\t},",
            "\tmethods: {\n",
            "\t}",
            "}",
            "</script>"
        ],
        "description": "create my vue document"
    }
}
```

