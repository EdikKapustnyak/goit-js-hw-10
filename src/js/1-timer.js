document.addEventListener('DOMContentLoaded', () => {
    const datetimePicker = document.getElementById('datetime-picker');
    const startButton = document.querySelector('[data-start]');
    const daysValue = document.querySelector('[data-days]');
    const hoursValue = document.querySelector('[data-hours]');
    const minutesValue = document.querySelector('[data-minutes]');
    const secondsValue = document.querySelector('[data-seconds]');
  
    let userSelectedDate = null;
    let countdownInterval = null;
  
    const options = {
      enableTime: true,
      time_24hr: true,
      defaultDate: new Date(),
      minuteIncrement: 1,
      onClose(selectedDates) {
        const selectedDate = selectedDates[0];
        if (selectedDate < new Date()) {
          iziToast.error({
            title: 'Помилка',
            message: 'Будь ласка, оберіть дату в майбутньому',
          });
          startButton.disabled = true;
        } else {
          userSelectedDate = selectedDate;
          startButton.disabled = false;
        }
      },
    };
  
    flatpickr(datetimePicker, options);
  
    startButton.addEventListener('click', () => {
      if (!userSelectedDate) return;
  
      startButton.disabled = true;
      datetimePicker.disabled = true;
  
      countdownInterval = setInterval(() => {
        const now = new Date();
        const timeDifference = userSelectedDate - now;
  
        if (timeDifference <= 0) {
          clearInterval(countdownInterval);
          updateTimer(0,0,0,0);
          datetimePicker.disabled = false;
          return;
        }
  
        const { days, hours, minutes, seconds } = convertMs(timeDifference);
        updateTimer(days, hours, minutes, seconds);
      }, 1000);
    });
  
    function convertMs(ms) {
      const second = 1000;
      const minute = second * 60;
      const hour = minute * 60;
      const day = hour * 24;
  
      const days = Math.floor(ms / day);
      const hours = Math.floor((ms % day) / hour);
      const minutes = Math.floor(((ms % day) % hour) / minute);
      const seconds = Math.floor((((ms % day) % hour) % minute) / second);
  
      return { days, hours, minutes, seconds };
    }
  
    function addLeadingZero(value) {
      return String(value).padStart(2, '0');
    }
  
    function updateTimer(days, hours, minutes, seconds) {
      daysValue.textContent = addLeadingZero(days);
      hoursValue.textContent = addLeadingZero(hours);
      minutesValue.textContent = addLeadingZero(minutes);
      secondsValue.textContent = addLeadingZero(seconds);
    }
  });