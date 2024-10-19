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

window.onload = function() {
    loadChatMessages();
};

function setReminder() {
    const sessionTime = document.getElementById('session-time').value;
    const reminderMessage = document.getElementById('reminder-message');

    if (sessionTime) {
        const sessionDate = new Date(sessionTime);
        const now = new Date();
        const timeDifference = sessionDate - now;

        if (timeDifference > 0) {
            reminderMessage.textContent = 'Reminder set for ' + sessionTime;
            setTimeout(() => {
                alert('Reminder: You have a session scheduled now!');
            }, timeDifference);
        } else {
            alert('Please select a future time.');
            reminderMessage.textContent = 'Please select a future time.';
        }
    } else {
        alert('Please select a time for the session.');
        reminderMessage.textContent = 'Please select a time for the session.';
    }
}

function sendMessage() {
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');

    if (chatInput.value.trim()) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.textContent = chatInput.value;
        chatMessages.appendChild(messageDiv);
        saveMessageToLocalStorage(chatInput.value);
        chatInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

function saveMessageToLocalStorage(message) {
    let messages = JSON.parse(localStorage.getItem('chatMessages')) || [];
    messages.push(message);
    localStorage.setItem('chatMessages', JSON.stringify(messages));
}

function loadChatMessages() {
    const chatMessages = document.getElementById('chat-messages');
    let messages = JSON.parse(localStorage.getItem('chatMessages')) || [];
    messages.forEach((message) => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.textContent = message;
        chatMessages.appendChild(messageDiv);
    });
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function clearChat() {
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML = '';
    localStorage.removeItem('chatMessages');
}
