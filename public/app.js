function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++ ) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function createEventsGraph(events) {
  const colors = [];
  const values = [];
  Object.keys(events).forEach((key) => {
    values.push(events[key]);
    colors.push(getRandomColor());
  });


  let ctx = document.querySelector('.event-graph');
  let chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(events),
      datasets: [{
        label: '# of Events',
        data: values,
        backgroundColor: colors
      }]
    },
    options: {
      scales: {
        xAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      },
    }
  });
}

function processData(response) {
  let events = {};
  response.forEach((p) => {
    if (typeof events[p.event] == 'undefined') {
      events[p.event] = 1;
    } else {
      events[p.event] = events[p.event] + 1;
    }
  });
  createEventsGraph(events);
}

function getData() {
  let input = document.querySelector('.date-input');
  let date = new Date(input.value);
  let request = {
    month: date.getMonth() + 1,
    day: date.getDate() + 1,
    year: date.getFullYear()
  };

  $.post('/plays', request, (response) => {
    processData(response);
  });
}
