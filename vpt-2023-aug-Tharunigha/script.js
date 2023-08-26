const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const resultsDiv = document.getElementById("results");

searchButton.addEventListener("click", () => {
    const searchTerm = searchInput.value.trim();
    if (searchTerm === "") {
        resultsDiv.innerHTML = "<p>Please enter a search term.</p>";
        return;
    }

    // Clear previous results
    resultsDiv.innerHTML = "<p>Searching...</p>";

    // Make API request
    fetch(`http://openlibrary.org/search.json?q=${searchTerm}`)
        .then(response => response.json())
        .then(data => displayResults(data.docs))
        .catch(error => {
            console.error("Error fetching data:", error);
            resultsDiv.innerHTML = "<p>An error occurred. Please try again later.</p>";
        });
});

function displayResults(results) {
    if (results.length === 0) {
        resultsDiv.innerHTML = "<p>No results found.</p>";
        return;
    }

    resultsDiv.innerHTML = "<ul>" +
        results.map(result => `<li>${result.title}</li>`).join("") +
        "</ul>";
}
// ... (previous code)

function displayResults(results) {
    if (results.length === 0) {
        resultsDiv.innerHTML = "<p>No results found.</p>";
        return;
    }

    const resultList = document.createElement("ul");

    results.forEach(result => {
        const listItem = document.createElement("li");
        const titleLink = document.createElement("a");
        titleLink.textContent = result.title;
        titleLink.href = "#"; // We'll update this later
        titleLink.addEventListener("click", () => {
            fetchBookDetails(result.key, listItem);
        });

        listItem.appendChild(titleLink);
        resultList.appendChild(listItem);
    });

    resultsDiv.innerHTML = "";
    resultsDiv.appendChild(resultList);
}

function fetchBookDetails(bookKey, listItem) {
    fetch(`https://openlibrary.org${bookKey}.json`)
        .then(response => response.json())
        .then(data => displayBookDetails(data, listItem))
        .catch(error => {
            console.error("Error fetching book details:", error);
            listItem.innerHTML = "<p>An error occurred while fetching details.</p>";
        });
}

function displayBookDetails(bookDetails, listItem) {
    const detailsDiv = document.createElement("div");
    detailsDiv.classList.add("book-details");

    const title = document.createElement("h2");
    title.textContent = bookDetails.title;
    detailsDiv.appendChild(title);

    if (bookDetails.author_name) {
        const authors = document.createElement("p");
        authors.textContent = "Author(s): " + bookDetails.author_name.join(", ");
        detailsDiv.appendChild(authors);
    }

    // You can add more details like cover images, publication year, etc.

    listItem.appendChild(detailsDiv);
}
