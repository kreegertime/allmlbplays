function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++ ) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


function createPitchTypeGraph(labels, types, pitch_types) {
  const traces = [];
  for (let i = 0; i < types.length; i++) {
    traces.push({
      mode: 'markers',
      name: labels[i],
      x: pitch_types[types[i]],
      marker: {
        color: getRandomColor(),
        size: 10,
        opacity: 0.4
      },
      type: 'scatter'
    });
  }

  var layout = {
    showlegend: true,
    autosize: true,
    width: 1200,
    height: 800
  }

  Plotly.newPlot('myDiv', traces, layout);
}

function getPitchData() {
  let input = document.querySelector('.date-input');
  var request = {
    date: input.value
  };
  $.post('/pitch_data', request, (response) => {
    processPitchData(response);
  });
}


function processPitchData(pitches) {
  let labels = [];
  let types = [];
  let pitch_types = {};

  pitches.forEach((pitch) => {
    if (typeof pitch_types[pitch.type] == 'undefined') {
      labels.push(pitch.description);
      types.push(pitch.type);
      pitch_types[pitch.type] = [];
    }
    pitch_types[pitch.type].push(pitch.start_speed);
  });
  createPitchTypeGraph(labels, types, pitch_types);
}

