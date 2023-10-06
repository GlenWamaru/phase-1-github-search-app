document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.getElementById("searchForm");
    const searchInput = document.getElementById("searchInput");
    const searchResults = document.getElementById("searchResults");
    const reposList = document.getElementById("reposList");
    let currentSearchType = "user"; // Default to searching for users

    // Function to fetch user data from GitHub API
    async function fetchUserData(username) {
        try {
            const response = await fetch(`https://api.github.com/search/users?q=${username}`, {
                headers: {
                    "Accept": "application/vnd.github.v3+json"
                }
            });
            const data = await response.json();
            return data.items; // Returns an array of users
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    }

    // Function to fetch user repositories from GitHub API
    async function fetchUserRepos(username) {
        try {
            const response = await fetch(`https://api.github.com/users/${username}/repos`, {
                headers: {
                    "Accept": "application/vnd.github.v3+json"
                }
            });
            const data = await response.json();
            return data; // Returns an array of repositories
        } catch (error) {
            console.error("Error fetching user repositories:", error);
        }
    }

    // Function to display user data in the search results
    function displayUserData(users) {
        searchResults.innerHTML = "";
        users.forEach(user => {
            const userCard = document.createElement("div");
            userCard.classList.add("user-card");
            userCard.innerHTML = `
                <img src="${user.avatar_url}" alt="${user.login}">
                <h3>${user.login}</h3>
                <a href="${user.html_url}" target="_blank">Profile</a>
            `;
            userCard.addEventListener("click", () => {
                fetchUserRepos(user.login)
                    .then(repos => displayUserRepos(repos));
            });
            searchResults.appendChild(userCard);
        });
    }

    // Function to display user repositories
    function displayUserRepos(repos) {
        reposList.innerHTML = "";
        repos.forEach(repo => {
            const repoItem = document.createElement("div");
            repoItem.classList.add("repo-item");
            repoItem.innerHTML = `
                <h3>${repo.name}</h3>
                <p>${repo.description || "No description available"}</p>
                <a href="${repo.html_url}" target="_blank">View Repo</a>
            `;
            reposList.appendChild(repoItem);
        });
    }

    // Event listener for form submission
    searchForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const searchTerm = searchInput.value.trim();
        if (currentSearchType === "user") {
            const users = await fetchUserData(searchTerm);
            displayUserData(users);
        } else if (currentSearchType === "repo") {
            // Implement repo search logic here (bonus)
        }
    });

    // Bonus: Toggle search type between users and repos
    const toggleButton = document.createElement("button");
    toggleButton.textContent = "Toggle Search Type";
    toggleButton.addEventListener("click", () => {
        currentSearchType = currentSearchType === "user" ? "repo" : "user";
        searchForm.reset();
        searchInput.placeholder = `Enter GitHub ${currentSearchType}`;
    });
    searchForm.appendChild(toggleButton);
});
