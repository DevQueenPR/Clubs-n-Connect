// document.addEventListener('DOMContentLoaded', function () {
//     const calendarEl = document.getElementById('calendar');
//     const modal = new bootstrap.Modal(document.getElementById('eventModal'));
  
//     const calendar = new FullCalendar.Calendar(calendarEl, {
//       events: '/api/events', // Tu fuente de eventos
//       eventClick: function (info) {
//         // Llenar los campos del modal con la información del evento
//         document.getElementById('eventTitle').value = info.event.title;
//         document.getElementById('eventDate').value = info.event.start.toLocaleDateString();
//         document.getElementById('eventDescription').value = info.event.extendedProps.description;
  
//         // Mostrar el modal
//         modal.show();
//       },
//     });
  
//     calendar.render();
//   });
  