# Node.js Webpack Boilerplate 

## Required

- Node.js 8.x up

## Feature

- ES6/ES7 supported

## The Load Priority of import/require

When import/require a js or json file in development, it will load according to priority.

1. **app/src**
1. **node_modules**

## Global Variables/Functions

### log

> Function

Display a colorful log in console.

**Arguments**

- 1st argument(required): Any(Object, Array, String, Boolean), text to show.
- 2nd argument(optional): String, log style, this following is all style(default is cyan).
  - white
  - red
  - green
  - yellow
  - cyan
  - magenta 

**Example**

```javascript
log('foobar')

log('foobar', 'green')
```

### now

> Function

Log current time

### args

> Object

All node.js process arguments.

If you enter the command like this following.

```bash
node app.js --text=hi --foo=bar
```

Your args variable will be like this

```json
{
  "text": "hi",
  "foo": "bar"
}
```

## Production

With production script, it will build app and copy app to **prod** directory.

```bash
yarn prod
```

**Auto Copy File**

You can put any file which you wanna copy to **prod** directory to **app/copyfile** directory.

After app built, it will auto copy all files under **app/copyfile** to **prod** directory.