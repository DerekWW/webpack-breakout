import _ from 'lodash';
import React from 'react';
import Chart from 'chart.js';

const button = document.createElement('button');
button.innerText = 'Click me!!!';
button.onclick = () => {
  System.import('./image_viewer')
    .then((module) => {
      console.log('hola'); 
    })
};

document.body.appendChild(button);
