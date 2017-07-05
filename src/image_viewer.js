import '../styles/image_viewer.css';
import big from '../assets/big.jpeg';
import small from '../assets/small.jpeg';
import '../styles/party.scss';

// export default () => {
  const img = document.createElement('img');
  img.src = small;

  document.body.appendChild(img);

  const bigImg = document.createElement('img');
  bigImg.src = big;

  document.body.appendChild(bigImg);
// }
