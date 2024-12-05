// Function 1: createElemWithText
function createElemWithText(element = "p", text = "", className) {
    const elem = document.createElement(element);
    elem.textContent = text;
    if (className) elem.className = className;
    return elem;
}

// Function 2: createSelectOptions
function createSelectOptions(users) {
    if (!Array.isArray(users)) return undefined;
    return users.map(user => {
        const option = document.createElement("option");
        option.value = user.id;
        option.textContent = user.name;
        return option;
    });
}

// Function 3: toggleCommentSection
function toggleCommentSection(postId) {
    if (!postId) return undefined;
    const section = document.querySelector(`section[data-post-id="${postId}"]`);
    if (!section) return null;
    section.classList.toggle("hide");
    return section;
}

// Function 4: toggleCommentButton
function toggleCommentButton(postId) {
    if (!postId) return undefined;
    const button = document.querySelector(`button[data-post-id="${postId}"]`);
    if (!button) return null;
    button.textContent = button.textContent === "Show Comments" ? "Hide Comments" : "Show Comments";
    return button;
}

// Function 5: deleteChildElements
function deleteChildElements(parentElement) {
    if (!(parentElement instanceof Element)) return undefined;
    while (parentElement.lastElementChild) {
        parentElement.removeChild(parentElement.lastElementChild);
    }
    return parentElement;
}

// Function 6: addButtonListeners
function addButtonListeners() {
    const buttons = document.querySelectorAll("main button");
    if (!buttons.length) return [];
    buttons.forEach(button => {
        const postId = button.dataset.postId;
        if (postId) {
            button.addEventListener("click", function (event) {
                toggleComments(event, postId);
            });
        }
    });
    return buttons;
}

// Function 7: removeButtonListeners
function removeButtonListeners() {
    const buttons = document.querySelectorAll("main button");
    buttons.forEach(button => {
        const postId = button.dataset.postId;
        if (postId) {
            button.removeEventListener("click", function (event) {
                toggleComments(event, postId);
            });
        }
    });
    return buttons;
}

// Function 8: createComments
function createComments(comments) {
    if (!Array.isArray(comments)) return undefined;
    const fragment = document.createDocumentFragment();
    comments.forEach(comment => {
        const article = document.createElement("article");
        const h3 = createElemWithText("h3", comment.name);
        const p1 = createElemWithText("p", comment.body);
        const p2 = createElemWithText("p", `From: ${comment.email}`);
        article.append(h3, p1, p2);
        fragment.appendChild(article);
    });
    return fragment;
}

// Function 9: populateSelectMenu
function populateSelectMenu(users) {
    if (!Array.isArray(users)) return undefined;
    const selectMenu = document.getElementById("selectMenu");
    const options = createSelectOptions(users);
    if (options) options.forEach(option => selectMenu.appendChild(option));
    return selectMenu;
}

// Function 10: getUsers
async function getUsers() {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        return await response.json();
    } catch (error) {
        console.error("Error fetching users:", error);
        return null;
    }
}

// Function 11: getUserPosts
async function getUserPosts(userId) {
    if (!userId) return undefined;
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
        const posts = await response.json();
        return posts;
    } catch (error) {
        console.error("Error fetching user posts:", error);
        return null;
    }
}

// Function 12: getUser
async function getUser(userId) {
    if (!userId) return undefined;
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching user:", error);
        return null;
    }
}

// Function 13: getPostComments
async function getPostComments(postId) {
    if (!postId) return undefined;
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching post comments:", error);
        return null;
    }
}

// Function 14: displayComments
async function displayComments(postId) {
    if (!postId) return undefined;
    const section = document.createElement("section");
    section.dataset.postId = postId;
    section.classList.add("comments", "hide");
    const comments = await getPostComments(postId);
    const fragment = createComments(comments);
    section.appendChild(fragment);
    return section;
}

// Function 15: createPosts
async function createPosts(posts) {
    if (!Array.isArray(posts)) return undefined;
    const fragment = document.createDocumentFragment();
    for (const post of posts) {
        const article = document.createElement("article");
        const h2 = createElemWithText("h2", post.title);
        const p1 = createElemWithText("p", post.body);
        const p2 = createElemWithText("p", `Post ID: ${post.id}`);
        const author = await getUser(post.userId);
        const p3 = createElemWithText("p", `Author: ${author?.name} with ${author?.company?.name}`);
        const p4 = createElemWithText("p", `${author?.company?.catchPhrase}`);
        const button = createElemWithText("button", "Show Comments");
        button.dataset.postId = post.id;
        const section = await displayComments(post.id);
        article.append(h2, p1, p2, p3, p4, button, section);
        fragment.appendChild(article);
    }
    return fragment;
}

// Function 16: displayPosts
async function displayPosts(posts) {
    const main = document.querySelector("main");
    deleteChildElements(main); // Clear the `main` element first
    let element;

    if (Array.isArray(posts) && posts.length) {
        element = await createPosts(posts); // Generate a document fragment with all posts
        main.appendChild(element); // Append the document fragment
    } else {
        // Display the default message if no posts are available
        element = createElemWithText("p", "Select an Employee to display their posts.", "default-text");
        main.appendChild(element);
    }

    return element; // Return the appended element (fragment or paragraph)
}

// Function 17: toggleComments
function toggleComments(event, postId) {
    if (!event || !postId) return undefined; // Validate inputs
    event.target.listener = true; // Required for testing

    const section = toggleCommentSection(postId); // Toggle the section visibility
    const button = toggleCommentButton(postId); // Toggle the button text

    if (section && button) {
        return [section, button]; // Return both elements in an array
    } else {
        console.error("Failed to toggle comments or button for postId:", postId);
        return undefined;
    }
}

// Function 18: refreshPosts
async function refreshPosts(posts) {
    if (!Array.isArray(posts)) return undefined;
    const buttonsRemoved = removeButtonListeners();
    const main = deleteChildElements(document.querySelector("main"));
    const fragment = await displayPosts(posts);
    const buttonsAdded = addButtonListeners();
    return [buttonsRemoved, main, fragment, buttonsAdded];
}

// Function 19: selectMenuChangeEventHandler
async function selectMenuChangeEventHandler(event) {
    if (!event?.target) return undefined; // Ensure the event and target exist
    const selectMenu = document.getElementById("selectMenu");
    selectMenu.disabled = true; // Disable the select menu while processing

    const userId = parseInt(event.target.value, 10) || 1; // Parse the user ID as an integer
    const posts = await getUserPosts(userId); // Fetch posts for the selected user

    if (Array.isArray(posts) && posts.length > 0) {
        const refreshPostsArray = await refreshPosts(posts); // Refresh posts in the DOM
        selectMenu.disabled = false; // Re-enable the select menu
        return [userId, posts, refreshPostsArray];
    } else {
        console.error("No posts found for userId:", userId);
        selectMenu.disabled = false;
        return [userId, [], undefined]; // Return empty data if no posts
    }
}

// Function 20: initPage
async function initPage() {
    const users = await getUsers();
    const selectMenu = populateSelectMenu(users);
    return [users, selectMenu];
}

// Function 21: initApp
function initApp() {
    initPage();
    const selectMenu = document.getElementById("selectMenu");
    selectMenu.addEventListener("change", selectMenuChangeEventHandler, false);
}

// Initialize app
document.addEventListener("DOMContentLoaded", initApp);
