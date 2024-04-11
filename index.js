document.addEventListener('DOMContentLoaded', () => {
    // Function to fetch movie details by ID
    async function fetchMovieDetails(movieId) {
        const response = await fetch(`http://localhost:3000/films/${movieId}`);
        const data = await response.json();
        return data;
    }

    // Function to fetch all movies
    async function fetchAllMovies() {
        const response = await fetch('http://localhost:3000/films');
        const data = await response.json();
        return data;
    }

    // Function to update tickets sold for a movie
    async function updateTicketsSold(movieId, ticketsSold) {
        const response = await fetch(`http://localhost:3000/films/${movieId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ tickets_sold: ticketsSold })
        });
        const data = await response.json();
        return data;
    }

    // Function to handle buying a ticket
    async function buyTicket(movieId) {
        // Fetch current movie details
        const movieDetails = await fetchMovieDetails(movieId);
        const capacity = movieDetails.capacity;
        let ticketsSold = movieDetails.tickets_sold;

        // Check if tickets are available
        if (ticketsSold < capacity) {
            // Update tickets sold count
            ticketsSold++;
            await updateTicketsSold(movieId, ticketsSold);
            // Update frontend display
            const availableTickets = capacity - ticketsSold;
            document.getElementById('available-tickets').textContent = availableTickets;

            // Create a new ticket entry
            const newTicket = {
                film_id: movieId,
                number_of_tickets: 1 // Assuming only 1 ticket is bought at a time
            };
            // POST request to create new ticket
            await fetch('http://localhost:3000/tickets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newTicket)
            });

            alert('Ticket purchased successfully!');
        } else {
            alert('Sorry, all tickets are sold out!');
        }
    }

    // Load the first movie's details on page load
    fetchMovieDetails(1)
        .then(movie => {
            // Update HTML elements with movie details
            document.getElementById('movie-title').textContent = movie.title;
            document.getElementById('runtime').textContent = movie.runtime;
            document.getElementById('showtime').textContent = movie.showtime;
            const availableTickets = movie.capacity - movie.tickets_sold;
            document.getElementById('available-tickets').textContent = availableTickets;

            // Optionally, you can update the poster image
            document.getElementById('poster-image').src = movie.poster;
        })
        .catch(error => console.error('Error fetching movie details:', error));

    // Load all movies in the menu
    fetchAllMovies()
        .then(movies => {
            const filmsList = document.getElementById('films');
            movies.forEach(movie => {
                const li = document.createElement('li');
                li.textContent = movie.title;
                li.addEventListener('click', () => {
                    fetchMovieDetails(movie.id)
                        .then(movie => {
                            // Update movie details on click
                            document.getElementById('movie-title').textContent = movie.title;
                            document.getElementById('runtime').textContent = movie.runtime;
                            document.getElementById('showtime').textContent = movie.showtime;
                            const availableTickets = movie.capacity - movie.tickets_sold;
                            document.getElementById('available-tickets').textContent = availableTickets;
                            document.getElementById('poster-image').src = movie.poster;
                        })
                        .catch(error => console.error('Error fetching movie details:', error));
                });
                filmsList.appendChild(li);
            });
        })
        .catch(error => console.error('Error fetching movie list:', error));

    // Event listener for Buy Ticket button
    document.getElementById('buy-ticket').addEventListener('click', () => {
        const movieId = 1; // Assuming the user is buying a ticket for the first movie
        buyTicket(movieId);
    });
});
