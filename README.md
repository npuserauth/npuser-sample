# npuer-sample
A sample that uses the no password user authentication (npuser) services

# Sample npuser client

This sample NodeJS project demonstrates how a npusr client sends the initial
authorization request to the npuser server. It then prompts the user, on the command line,
to enter the verification code.  Get and enter the code. The sample app then sends the verification
request which validates the user.

## Configuration

Copy the sample environment files into your local (not in git).
```
cp sample.dev.env .env.dev
cp sample.prod.env .env.prod
```

The DEV sample should work as is with the defaults used by a locally running npuser authorization service.

The PROD sample needs real client id and secret and email address.

Adjust the .env files to suit your needs and run the sample ...

## Build
Need to build to convert Typescript to JS
```
npm run build:run
```

## Run
```
# dev
npm run run

#prod
npm run run:prod
```

## How to obtain the verification code

This sample application sends the authorization request.  You then need to find the
verification code the npuser authorization server creaetd.

If you are running this as a developer of npuser then you can see the npuser server's
console output. The verification code is there.

If you are running this as a developer of an application that will use the npuser server
then configure this sample to reach out to a running service. You will then need to
modify the sample code to use a real email address that you can access. The verification
code will appear in your inbox.


## How was this project created?

```
# initialize the project
npm init -y

# install webbpack
npm install webpack webpack-cli --save-dev
npm install nodemon-webpack-plugin --save-dev
touch webpack.config.js

# application dependencies
npm install dotenv --save
npm install npuser-client --save
npm install readline --save

```

Add a webpage.config.js file (set target as node)
```
const NodemonPlugin = require('nodemon-webpack-plugin'); // Ding
const path = require('path')
module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve('./dist'),
    filename: 'main.js',
  },
  plugins: [
    new NodemonPlugin(), // Dong
  ],
  target: 'node'
};
```

Adjust the scripts in the package.json file.
```
  "scripts": {
    "watch": "webpack --watch --mode=development",
    "build": "webpack --mode=development && npm run run",
    "run": "node dist/main.js"
  },
```


## How I created the sample client

In the root folder, locally install the Vue CLI.  I prefer to locally install this tool whenever I need it so that I can
get the latest version without affecting any other projects.
```
npm install @vue/cli --save-dev
npm install @vue/cli-init --save-dev
```

Then to run the local Vue CLI you need to reach into the node_modules directories.

```
node ../node_modules/@vue/cli/bin/vue.js create npuser-sample-client
```

For this sample I made the following choices.  None of these are needed for your application.
```
Vue CLI v4.5.9
? Please pick a preset: Manually select features
? Check the features needed for your project:
 ◉ Choose Vue version
 ◉ Babel
 ◉ TypeScript
 ◉ Progressive Web App (PWA) Support
❯◉ Router
 ◉ Vuex
 ◉ CSS Pre-processors
 ◉ Linter / Formatter
 ◉ Unit Testing
 ◉ E2E Testing

Vue CLI v4.5.9
? Please pick a preset: Manually select features
? Check the features needed for your project: Choose Vue version, Babel, TS, PWA, Router, Vuex, CSS Pre-processors, Linter, Unit, E2E
? Choose a version of Vue.js that you want to start the project with 3.x (Preview)
? Use class-style component syntax? No
? Use Babel alongside TypeScript (required for modern mode, auto-detected polyfills, transpiling JSX)? Yes
? Use history mode for router? (Requires proper server setup for index fallback in production) Yes
? Pick a CSS pre-processor (PostCSS, Autoprefixer and CSS Modules are supported by default): Sass/SCSS (with node-sass)
? Pick a linter / formatter config: Standard
? Pick additional lint features: Lint on save
? Pick a unit testing solution: Jest
? Pick an E2E testing solution: Cypress
? Where do you prefer placing config for Babel, ESLint, etc.? In dedicated config files
? Save this as a preset for future projects? (y/N)
```

Next remove Vue icons and insert icon for my application
```
## get the npuser icon...
cd npuser-sample-client/public
cp ../../../npuser/client/public/favicon.ico .

## remove all the Vue icon files
cd img/icons
rm *
```

I then removed the boilerplate Vue code in
```
public/index.html
src/components/HelloWorld.vue
src/views/Home.vue
```

Run the client with the vue web server and verify all is OK
```
npm run serve -- --port 8081
```

I like to use Pug instead of HTML
```
node ../node_modules/@vue/cli/bin/vue.js add pug
```

Next, let's add pages and components and routing that will require authentication, once we've set up the basic pages.
For this step I went looking for a sample so I can do what we often do, copy and paste existing code. I like the tutorials
that Digital Ocean provides and used this one for this sample. Starting at Step 3

https://www.digitalocean.com/community/tutorials/how-to-set-up-vue-js-authentication-and-route-handling-using-vue-router#step-3-%E2%80%94-updating-the-vue-router-file

## Set up sample server

Your application needs an API service.  For this sample we provide a very basic Node JS Express server that is based on the server
found in the "How To Set Up Vue.js Authentication and Route Handling Using vue-router" tutorial, mentioned above.
Because we will use NP User the server code that supports adding new users (your customers) and allowing them to
login is very simple compared to normal applications.

## The problems with passwords

In the normal flow of user authentication you're new potential customer needs to register on your application.
This is when your application will lose so many potential customers.  You invested a lot of time and effort
promoting your application or website. People are coming but are they registering?  Every step between the time
your new potential customer arrives and when they start to see value from your application is a step that can lose
a new customer.

The registration process is a jump your new users will need to make before they can see value.  Typically,
applications ask new users to provide their name, a user id, their email address and a password.

Many users want to use an easy to remember password which is often a weak password.  Weak passwords
are an attack vector on your server.  To protect your application and your customers your application
needs to impose rules to get only strong passwords.
For example, passwords must be of a certain length, contain a mixture of upper and lower case letters,
contains a mixture of numbers and symbols, etc.
Some applications go further and add more general rules such as insisting that users not reuse passwords they have used before.

To make matters more complicated, the definitions of a "strong password" changes as
security experts continue to find ways to counteract the threats from malicious
hackers.

As well, your user interface ought to guide your new customer as they compose their new password. That means
every rule imposed on the password field needs to be implemented not only on your server but also in your user interface.

Then you need to consider the privacy issues.  We've all read tragic stories of top tier corporations getting hacked
and millions of user accounts are stolen along with users passwords that we stored in plain text.

But, we are not done with the problems with passwords.  What happens when your user forgets their password?  Your application
and your user interface need to help your users recover their password, if they are a real user!  Now, your user interface needs
a whole new set of web pages, api calls and business logic.  Plus, your application needs API to accept a password reset request.

The first step checks if the user is registered or not.  Question.  If not do you immediately tell the
user that the user id or email address they entered is a valid user?  Best practice suggests you don't because that helps
malicious hackers see who has registered with your business. The second step typically involves generating a code
and sending that to your user via email. Your application needs code to work with your application's email service.
The process continues and it has many other traps to avoid.  Instead, let's consider using NP User.

Can we sum up this topic and agree it is very challenging to correctly handle password and user registration?


## NP User no password authentication

Install the NP User client library on your API server
```
 npm install --save npuser-client
```
