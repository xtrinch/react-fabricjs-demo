# React - fabric.js demo

This is a demo repo of a small 2d floor planner with fabric.js. It supports zooming, panning, drag and drop of components onto the canvas, moving and rotating the components on the canvas.

# Images

![alt tag](https://raw.githubusercontent.com/xTrinch/react-fabricjs-demo/master/images/demo.jpg)

## Technology stack:

- React
- Fabric.js
- Material.UI

## Setup

Copy `.env.example` over to `env.local` and/or customize environment variables.
Run with `yarn start`.

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />

### `yarn format`

Runs `eslint` and `prettier` and writes what they could fix to filesystem.

## Production setup

```bash
$ cp .env.example .env
$ docker-compose up -d
```

Will spin up a nginx container and copy the files into it. You should be able to access the frontend at the specified port.
