document.addEventListener('DOMContentLoaded', loadBookings);

function showAvailability(mentorName) {
    const availabilityDiv = document.getElementById(`${mentorName}-availability`);
    availabilityDiv.style.display = availabilityDiv.style.display === 'none' ? 'block' : 'none';
}


document.querySelectorAll('.available').forEach(item => {
    item.addEventListener('click', (event) => {
        const time = event.target.getAttribute('data-time');
        const mentor = event.target.closest('.profile').getAttribute('data-name');
        bookSession(mentor, time);
    });
});

function bookSession(mentor, time) {
    const bookingList = document.getElementById('booking-list');

    const bookingEntry = {
        mentor,
        time
    };
    const li = document.createElement('li');
    li.classList.add("listof-book");
    li.textContent = `Booked with ${mentor} on ${new Date(time).toLocaleString()}`;
    li.setAttribute('data-time', time);
    li.setAttribute('data-mentor', mentor);
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.onclick = () => removeBooking(li, time, mentor);
    li.appendChild(removeButton);
    bookingList.appendChild(li);
    saveBooking(bookingEntry);
    markSlotAsBooked(time);
    sendEmailToMentor(mentor, time);
}

function removeBooking(bookingElement, time, mentor) {
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const updatedBookings = bookings.filter(b => b.mentor !== mentor || b.time !== time);
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
    bookingElement.remove();
    markSlotAsAvailable(time);
}

function saveBooking(booking) {
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));
}

function loadBookings() {
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const bookingList = document.getElementById('booking-list');
    bookings.forEach(booking => {
        const li = document.createElement('li');
        li.textContent = `Booked with ${booking.mentor} on ${new Date(booking.time).toLocaleString()}`;
        li.setAttribute('data-time', booking.time);
        li.setAttribute('data-mentor', booking.mentor);
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.onclick = () => removeBooking(li, booking.time, booking.mentor);
        li.appendChild(removeButton);
        bookingList.appendChild(li);
    });
}

function markSlotAsBooked(time) {
    const slot = document.querySelector(`li[data-time="${time}"]`);
    if (slot) {
        slot.classList.remove('available');
        slot.classList.add('booked');
        slot.textContent += ' (Booked)';
    }
}

function markSlotAsAvailable(time) {
    const slot = document.querySelector(`li[data-time="${time}"]`);
    if (slot) {
        alert(`The slot you booked is removed successfully.!`);
        slot.classList.add('available');
        slot.classList.remove('booked');
        slot.textContent = slot.textContent.replace(' (Booked)', '');
    }
}

function sendEmailToMentor(mentor, time) {
    const emailContent = `Dear ${mentor},\n\nA new mentorship session has been booked for you on ${new Date(time).toLocaleString()}.\n\nBest regards,\nMentorship Booking System`;
    console.log("Sending email to mentor:");
    console.log(emailContent);
    alert(`Email sent to ${mentor}: ${emailContent}`);
}