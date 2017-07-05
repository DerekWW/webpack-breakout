# webpack-breakout


#### What is Webpack?
Webpack is a build tool, typically for front-end code. It has the ability to take in your code and return a bundle file of all your code. It can also use loaders to process your files(compile sass to css) or minify your whole frontend.


#### Minimum Webpack Config
Webpack uses a ```webpack.config.js``` file to determine what it should do to your code. At a minimum it needs a entry point where it will start processing your files, and an output location to store the finished result.

```javascript
const path = require('path')

const config = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js'
  },

}

module.exports = config
```

*NOTE*: The entry point you choose should not have any exports, it needs to be a file that contains only imports.

Lets add a build script to our package.json so we can run webpack ``` "build": "webpack" ```

#### Webpack Tools

Webpack has 2 main layers of tooling that you can use for processing your code.

- ######Loaders: Loaders target certain file types to process such as .js, .jsx, .sass, .css, ....etc
- ######Plugins: Plugins will target the bundle file that is created after the loaders have processed your code

######Loaders
The most popular webpack loader is babel. Babel allows us to write our front end code in the newest javascript standard, babel will transpile it to ES5 for us!
Babel is a very modular library, so we need to bring in a few packages in order to use it.


__JS Loaders__
```bash
npm install --save babel-loader babel-core babel-preset-env
```

We can add loaders to out webpack config file by using the *module* key in our configuration.

The module key is a object with a rules key, rules will be an array where we can specify our loaders

```javascript
module: {
  rules: [
    {
      use: 'babel-loader',
      test: /\.js$/
    }
  ]
}
```

Here we have a rule that us using the babel-loader, and only targeting files that end in .js
Lets run the build script and see if our lets/consts/ and arrow functions are still being used.

---

Now that we have babel turning our code into ES5 we can take full advantage of all the cool ES6 features that are not supported yet! We can now replace our 'require' and 'module.exports' with 'import' and 'export'!

--------

__CSS Loaders__

We can also use loaders to process our css! Lets make a new file in our src folder called 'image_viwer.js'

```javascript
// src/image_viewer.js

const img = document.createElement('img');
img.src = 'http://lorempixel.com/400/400';

document.body.appendChild(img);

```
now lets create styles folder in our root, and add a css file to it
```css
/*  styles/image_viewer.css  */

img {
  border: 5px black dotted;
}
```

Now lets import our css into our file!!! Change image_viewer.js to the following!
```javascript
import '../styles/image_viewer.css' // this is the new line

const img = document.createElement('img');
img.src = 'http://lorempixel.com/400/400';

document.body.appendChild(img);

```
We can teach webpack how to handle css files with the use of a few more loaders. Lets install css-loader and style-loader.

```bash
npm install --save css-loader style-loader
```

- css-loader: tells webpack what to do with css imports
- style-loader: tells webpack to inject the css into our HTML

The last step we need to take is to update our ```webpack.config.js``` to use our new loaders.

 Since we need to use multiple loaders on the same file type we can add them to and array, just be careful as webpack will use the last index of the array and pipe the results towards the front of the array. In the case below our css will be processed by css-loader first and the results will be piped into style-loader. __note:__ If you have an array of loaders, they will run from right to left.   <---------|


 ```javascript
 {
   use: ['style-loader', 'css-loader'],
   test: /\.css$/
 }
 ```

If we build this now and reload our page we can see our css being applied. However our build folder still only contains one single bundle.js file and we never linked our css file in our html. So where is the css being stored? Open up the inspector in chrome and find out!

This approach is actually very inefficient and can hinder page load times. Lets fix it so that we can create a file in our build folder that will store our css.

We will make use of a plugin to help us do this. Plugins differ from in that they have the ability to separate out code from our bundle.js and save it separately.

```bash
npm install --save-dev extract-text-webpack-plugin
```

Then in our config file we need to change some things

```javascript
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin') //new

const config = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        use: 'babel-loader',
        test: /\.js$/
      },
      {
        use: ExtractTextPlugin.extract({         //updated
          use: 'css-loader'
        }),
        test: /\.css$/
      }
    ]
  },
  plugins: [                                //new
    new ExtractTextPlugin('style.css')
  ]


}
```

We should now have a style.css file in our build folder! The only problem is that it is not linked to our HTML anymore! Add the following to link it!

```HTML
<link rel="stylesheet" href="./build/style.css">
```

__SASS__

We can also use webpack to compile SASS for us! Lets make a image.scss file in our styles folder!

__Image Loaders__

We can also add in loaders to process any images that we would like to serve locally. We currently have two images in our asset folder. These two images are vastly different in size, with big.jpeg being 147kb and small.jpeg being only 9kb. We will use two loaders to handle optimizing our images.

- image-webpack-loader: can resize images for us as it loads them
- url-loader: can store the image in different formats depending on size of image


```bash
npm install --save-dev image-webpack-loader url-loader file-loader
```
__note:__ file-loader must be installed as url-loader uses it as a dependency


Now we can update our webpack config to use these packages!

Add this to your rules array
```javascript
{
  test: /\.(jpe?g|png|gif|svg)$/,
  use: [
    {
      loader: 'url-loader',
      options: { limit: 40000 } // roughly 40kb
    },
    'image-webpack-loader'
  ]
}
```

The options object for url-loader is specifying the max image size it will apply to. If it does apply to a certain image it will store it for us as a string instead of a file.

Now we can import our images into the file where we want to use them. Lets update image_viewer.js to the following

```javascript
import '../styles/image_viewer.css';
import big from '../assets/big.jpeg';         //new
import small from '../assets/small.jpeg';     //new

const img = document.createElement('img');
img.src = small;                              //update

document.body.appendChild(img);

const bigImg = document.createElement('img'); //new
bigImg.src = big;                             //new

document.body.appendChild(bigImg);            //new
```

As you can see we can now simply import images and store a reference to them as a variable. Lets rebuild our project and see what our page looks like.  

Looks like there is an error being thrown in the console! It cant find our large image that was saved as its own file! This is because by default the path assumes that the image gets put into the root of our project(which will be the case in production) but we need to prefix the path with the build folder. Luckily webpack has a setting to fix this. In webpack.config update the output settings to include a publicPath key that points at the build folder.

```javascript
output: {
  path: path.resolve(__dirname, 'build'),
  filename: 'bundle.js',
  publicPath: 'build/'    //new
},
```

- [image-webpack-loader](https://github.com/tcoopman/image-webpack-loader)
- [url-loader](https://github.com/webpack-contrib/url-loader)
