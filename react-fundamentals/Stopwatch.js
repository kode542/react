// Open codepen.io(Settings > Add external scripts/pens > React, ReactDOM, Redux)
// Include in HTML file this > (<div class="root"></div>)


let model = {
  running: false,
  time: 0
};

let view = (model) => {
  let minutes = Math.floor(model.time / 60)
  let seconds = model.time - (minutes * 60)
  let secondsFormatted = `${seconds < 10 ? '0' : ''}${seconds}`
  return <div>{minutes} : {secondsFormatted}</div>
}

let intents = {
  TICK: 'TICK',
  START: 'START',
  STOP: 'STOP',
  RESET: 'RESET'
};

const update = (model, intent) => {
  const updates = {
    'TICK': (model) => Object.assign(model, {time: model.time + 1})
  };
  return updates[intent](model);
}

const render = () => {
  ReactDOM.render(view(model),
    document.getElementById('root')
  );
};

render();

setInterval(() => {
  model = update(model, 'TICK');
  render();
}, 1000);