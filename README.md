# react-igniter

Welcome to **react-igniter**!
<img src="./react-igniter.png" align="right" height="120px">

Command Line Interface built for writing common React code faster and easier.

## What does it do?

React-igniter is a lightweight command line interface designed to help you in your everyday work. It offers you a quick way to generate a lot of boilerplate code like routers, api files, and react components.

## What is new?

Release v1.0.4 is out! New features include the following:

1. Added possibility to include/exclude index file.
2. Added the ability to check for package updates by running `rig -u`.
3. Added the ability to install the latest version of react-igniter to your system.
4. Extended configuration object to support inclusion of index file.

For a detailed list of features and changes per version visit the CHANGELOG.MD file.

## What does it generate?

It can generate either `typescript` or `javascript` versions of the following:

- React components
- React routers (via [React-router](https://reactrouter.com/))
- React Api files (via [Axios](https://axios-http.com/))

All of the above features are configurable in what exactly you want to generate by choosing the different options in the actual CLI.

### **React components**

React components generator support the following features:

- Naming the component (reflected across all generated files)
- Adding test files with the first test already set up.
- Adding styling modules to the component (supports sass, css & styled-components)
- Choosing between typescript & javascript components.
- Adding storybook with the first story already set up.
- Choosing between default and named component export
- Choosing if you want to include index file that exports the component or not

The generated output will be a folder containing the above mentioned features, the folder content will differ depending on the options you choose.

### **React routers**

React routers generator supports the following features:

- Naming the router
- Choosing if you want to generate tabs for the routes
- Creating an arbitrary amount of routes depending on your input (space separated values)
- Choosing if you are setting up the main application router or a sub-router
- Choosing between the typescript and javascript versions

The generator will require you to have `react-router` and `react-router-dom` packages installed in your project directory. It will automatically detect if you are using version 5 or 6 of the package and generate the appropriate files based on version.

### **React api**

React api generator supports the following features:

- Initializing the BaseApi class which handles the base configuration of the api like interceptors for requests and responses, headers and so on.
- Extended API's which inherit the BaseApi class and extend its configuration
- Choosing between typescript and javascript versions
- Adding CRUD operations to each generated API (excluding the base one)
- Adding the base prefix, defaults to `/`

This generator requires you to have `axios` installed in your project directory. The extended api's you create require the BaseApi import to work, once you generate the BaseApi you can add new files without re-initializing the base api.
The output will be generated to the `/api` folder.

### **React igniter configs**

Running the config setup will generate a config file in your current project directory with default presets which allows you to skip questions in the CLI, like choosing if you want to generate js/ts each time. Each time a new release is out the config file will be updated accordingly and you can just update it with the command already there.

### **CLI Options**

- `-u` - Adding this flag tells the CLI to check if there is a newer version of the package and if there is, asks you if you want to upgrade.

## How to get it up and running?

The whole installation is very simple. To use it you will need to have node installed and you can pull it in with the following command:

`npm install -g react-igniter`

After installation you can run `rig` to get the CLI which will guide you through the process of creating the component you need.

If you want to directly use it without actually installing it locally you can simply run:

`npx rig`

After this we recommend first choosing the option to initialize the configuration file and to set your values to whatever you wish for easier generation and a more pleasant experience.

If you want to check if there are updates to the package and install them you can run the following command:

`rig -u`

## Our vision

Our vision with this package is to speed up the every day development process and empower developers. We want to create a robust and extensive CLI to support as many cases as possible and to offer a lot of features out of the box.

## Feature roadmap

- Adding a form generator with react-hook-form & yup.
- Improving the feature-set offered by react-component generator (optional index.js/ts file in component output..)
- Adding functionality under the hood to streamline the process and make it easier.

## Developer note

If you like this package and find it useful please do consider giving the project a star on github. If you wish to see some features added feel free to contact the project contributors or submit a feature request on github.

Thank you for your support.

Happy coding!
