const globalBlocks = [];
let currentColor;
let prevColor;
const prev = document.getElementById('prev');
const current = document.getElementById('current');
const right = document.querySelector('.right');
const eyedropper = document.getElementById('eyedropper');
const transform = document.getElementById('transform');
const bucket = document.getElementById('bucket');
const move = document.getElementById('move');

function load() {
// check for localStorage
  if (localStorage.items) {
    const vivod = JSON.parse(localStorage.getItem('items'));
    for (let i = 0; i < vivod.length; i += 1) {
      globalBlocks.push(vivod[i]);
    }
  }
  if (localStorage.prev) {
    currentColor = localStorage.getItem('current');
    prevColor = localStorage.getItem('prev');
    document.getElementById('current').style.backgroundColor = currentColor;
    document.getElementById('prev').style.backgroundColor = prevColor;
  } else {
    document.getElementById('current').style.backgroundColor = 'green';
  }
  // end check for localStorage

  const colorsArray = [
    '#F34235',
    '#E81E62',
    '#9B26AF',
    '#3E50B4',
    '#02A8F3',
    '#009587',
    '#4BAE4F',
    '#CCDB38',
    '#FEC007',
    '#785447',
    '#9D9D9D',
    '#5F7C8A',
    '#00BBD3',
    '#6639B6',
    '#FEEA3A',
  ];
  const circles = document.querySelectorAll('div.circle');
  for (let i = 0; i < circles.length; i += 1) {
    circles[i].style.backgroundColor = colorsArray[i];
  }
}
document.addEventListener('loadstart', load());

// START localStorage
let newDiv = '';
let k = 0;
if (!localStorage.items) {
  for (let i = 0; i < 3; i += 1) {
    for (let j = 0; j < 3; j += 1) {
      newDiv = document.createElement('div');
      newDiv.classList.add('item', 'draggable', 'droppable');
      newDiv.style.left = `${120 + 150 * i}px`;
      newDiv.style.top = `${100 + 150 * j}px`;
      k += 1;
      const element = {
        number: k,
        left: newDiv.style.left,
        top: newDiv.style.top,
        isCircle: false,
        backgroundColor: '#BDBDBD',
      };
      globalBlocks.push(element);
      newDiv.setAttribute('data', k);
      document.querySelector('.right').appendChild(newDiv);
      newDiv = '';
    }
  }
} else {
  const returnObj = JSON.parse(localStorage.getItem('items'));
  const returnObjArray = Object.values(returnObj);
  for (let i = 0; i < returnObjArray.length; i += 1) {
    newDiv = document.createElement('div');
    newDiv.classList.add('item', 'draggable', 'droppable');
    newDiv.style.left = returnObjArray[i].left;
    newDiv.style.top = returnObjArray[i].top;
    newDiv.style.backgroundColor = returnObjArray[i].backgroundColor;
    newDiv.setAttribute('data', returnObjArray[i].number);
    if (returnObjArray[i].isCircle) newDiv.classList.add('make-circle');
    document.querySelector('.right').appendChild(newDiv);
    newDiv = '';
  }
}

function saveCurerentState() {
  localStorage.removeItem('items');
  localStorage.removeItem('current');
  localStorage.removeItem('prev');
  const serialObj = JSON.stringify(globalBlocks);
  localStorage.setItem('items', serialObj);
  localStorage.setItem('prev', prev.style.backgroundColor);
  localStorage.setItem('current', current.style.backgroundColor);
}

// END localStorage
// BUTTONS on left area
function setToActive() {
  const lastActiveElement = document.getElementsByClassName('active');
  if (lastActiveElement[0] === this) {
    this.className = this.className.replace(' active', '');
    return;
  }
  if (lastActiveElement.length === 0) this.className += ' active';
  else {
    lastActiveElement[0].className = lastActiveElement[0].className.replace(' active', '');
    this.className += ' active';
  }
}
const buttons = document.getElementsByTagName('button');
for (let i = 0; i < buttons.length; i += 1) {
  buttons[i].addEventListener('click', setToActive);
}
// END buttons

// START clicks on color choosing area
const clickOnColorsContainer = function colotsContainerClick(event) {
  if (eyedropper.className.indexOf('active') !== -1) {
    if (event.target.children.length === 0) {
      if (current.style.backgroundColor === event.target.style.backgroundColor) {
        return;
      }
      prev.style.backgroundColor = current.style.backgroundColor;
      current.style.backgroundColor = event.target.style.backgroundColor;
      currentColor = current.style.backgroundColor;
      prevColor = event.target.style.backgroundColor;
      saveCurerentState();
    }
  }
};

const colorsDiv = document.querySelector('div.colors');
colorsDiv.addEventListener('click', clickOnColorsContainer);
prev.addEventListener('click', clickOnColorsContainer);

// END clicks on color choosing area

// START clicks on work area
function clickOnBlocksContainer(event) {
  const item = event.target;
  if (Array.prototype.indexOf.call(document.getElementsByClassName('item'), item) !== -1) {
    if (bucket.className.indexOf('active') !== -1) {
      const color = window.getComputedStyle(current).backgroundColor;
      item.style.backgroundColor = color;
      globalBlocks[item.getAttribute('data') - 1].backgroundColor = color;
      saveCurerentState();
    }
    if (transform.className.indexOf('active') !== -1) {
      item.classList.toggle('make-circle');
      if (globalBlocks[item.getAttribute('data') - 1].isCircle) {
        globalBlocks[item.getAttribute('data') - 1].isCircle = false;
      } else globalBlocks[item.getAttribute('data') - 1].isCircle = true;
      saveCurerentState();
    }
    if (eyedropper.className.indexOf('active') !== -1) {
      if (current.style.backgroundColor === item.style.backgroundColor) {
        return;
      }
      prev.style.backgroundColor = current.style.backgroundColor;
      current.style.backgroundColor = item.style.backgroundColor;
      currentColor = current.style.backgroundColor;
      prevColor = item.style.backgroundColor;
      saveCurerentState();
    }
  }
}

function mdOnBlocksContainer(event) {
  const stats = right.getBoundingClientRect();
  const item = event.target;
  if (move.className.indexOf('active') !== -1) {
    if (!item.classList.contains('draggable')) return;
    const avatar = item.cloneNode(true);
    item.style.opacity = '0.3';
    item.style.zIndex = '1';
    avatar.style.zIndex = 9999;
    avatar.style.left = event.pageX;
    avatar.style.top = event.pageY;
    document.querySelector('.right').appendChild(avatar);
    const itemsArray = document.querySelectorAll('.item');
    right.style.border = '5px dotted #9a67ea';

    document.onmousemove = function mMove(moveEvent) {
      for (let x = 0; x < itemsArray.length; x += 1) {
        itemsArray[x].style.border = '3px dotted #9a67ea';
      }
      avatar.style.left = `${moveEvent.pageX - stats.left - avatar.offsetWidth / 2}px`;
      avatar.style.top = `${moveEvent.pageY - stats.top - avatar.offsetHeight / 2}px`;
      if (parseInt(avatar.style.left, 10) < 1) avatar.style.left = `${1}px`;
      if (parseInt(avatar.style.left, 10) > stats.width - avatar.offsetWidth - parseInt(right.style.border, 10) - 5) avatar.style.left = `${stats.width - avatar.offsetWidth - parseInt(right.style.border, 10) - 5}px`;
      if (parseInt(avatar.style.top, 10) < 0) avatar.style.top = `${1}px`;
      if (parseInt(avatar.style.top, 10) > stats.height - avatar.offsetHeight - parseInt(right.style.border, 10) - 5) avatar.style.top = `${stats.height - avatar.offsetHeight - parseInt(right.style.border, 10) - 5}px`;
    };
    document.onmouseup = function mUp(upEvent) {
      for (let x = 0; x < itemsArray.length; x += 1) {
        itemsArray[x].style.border = '3px dotted transparent';
      }

      right.style.border = '5px dotted transparent';
      avatar.style.visibility = 'hidden';
      const elem = document.elementFromPoint(upEvent.clientX, upEvent.clientY);
      avatar.style.visibility = 'visible';
      item.style.zIndex = '2';

      if (elem == null) {
        item.style.opacity = '1';
        avatar.style.display = 'none';
        document.onmousemove = null;
        document.onmouseup = null;
        return;
      }

      if (!elem.classList.contains('droppable') || elem === item) {
        avatar.style.display = 'none';
        avatar.remove();
        item.style.opacity = '1';
        item.style.left = `${parseInt(avatar.style.left, 10)}px`;
        item.style.top = `${parseInt(avatar.style.top, 10)}px`;
        globalBlocks[item.getAttribute('data') - 1].left = item.style.left;
        globalBlocks[item.getAttribute('data') - 1].top = item.style.top;
        saveCurerentState();
      } else {
        for (let i = 0; i < right.children.length; i += 1) {
          if (elem === right.children[i]) {
            item.style.opacity = '1';
            const tmpL = item.style.left;
            const tmpT = item.style.top;
            item.style.top = elem.style.top;
            item.style.left = elem.style.left;
            elem.style.top = tmpT;
            elem.style.left = tmpL;
            globalBlocks[item.getAttribute('data') - 1].left = item.style.left;
            globalBlocks[item.getAttribute('data') - 1].top = item.style.top;
            globalBlocks[elem.getAttribute('data') - 1].left = elem.style.left;
            globalBlocks[elem.getAttribute('data') - 1].top = elem.style.top;
            saveCurerentState();
            avatar.remove();
          }
        }
      }
      document.onmousemove = null;
      document.onmouseup = null;
    };
  }
}

// START Keys
function setToActiveByButton(button) {
  const lastActiveElement = document.getElementsByClassName('active');
  const thisButton = button;
  if (lastActiveElement[0] === button) {
    thisButton.className = thisButton.className.replace(' active', '');
    return;
  }
  if (lastActiveElement.length === 0) thisButton.className += ' active';
  else {
    lastActiveElement[0].className = lastActiveElement[0].className.replace(' active', '');
    thisButton.className += ' active';
  }
}

function keyDown(event) {
  const keyName = event.key;
  if (keyName === 'z') setToActiveByButton(buttons[0]);
  if (keyName === 'x') setToActiveByButton(buttons[1]);
  if (keyName === 'c') setToActiveByButton(buttons[2]);
  if (keyName === 'v') setToActiveByButton(buttons[3]);
}
document.addEventListener('keydown', keyDown);

// END keys

const blocksContainer = document.querySelector('.right');
blocksContainer.addEventListener('click', clickOnBlocksContainer);
blocksContainer.addEventListener('mousedown', mdOnBlocksContainer);
