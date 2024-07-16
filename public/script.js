document.addEventListener('DOMContentLoaded', () => {
    const baseURL = 'http://localhost:3000'; // Replace with your backend server URL

    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');
    const createPostForm = document.getElementById('createPostForm');
    const postsList = document.getElementById('postsList');

    let posts = []; // Initialize an empty array to store posts
    let token = ''; // Initialize token variable

    if (signupForm) {
        const formElement = signupForm.querySelector('form');
        formElement.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(formElement);
            const userData = {
                username: formData.get('username'),
                email: formData.get('email'),
                password: formData.get('password')
            };

            try {
                const response = await fetch(`${baseURL}/api/auth/signup`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                });
                const data = await response.json();
                if (response.ok) {
                    alert('Registered successful');
                    formElement.reset();
                } else {
                    alert(data.message || 'Signup failed. Please try again.');
                }
            } catch (error) {
                console.error('Signup Error:', error);
                alert('Signup failed. Please try again.');
            }
        });
    } else {
        console.error('Signup form not found in DOM.');
    }

    if (loginForm) {
        const formElement = loginForm.querySelector('form');
        formElement.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(formElement);
            const userData = {
                email: formData.get('email'),
                password: formData.get('password')
            };

            try {
                const response = await fetch(`${baseURL}/api/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                });
                const data = await response.json();
                if (response.ok) {
                    token = data.token; // Store token globally
                    localStorage.setItem('token', token);
                    alert('Login successful');
                    formElement.reset();
                } else {
                    alert(data.message || 'Login failed. Please try again.');
                }
            } catch (error) {
                console.error('Login Error:', error);
                alert('Login failed. Please try again.');
            }
        });
    }

    createPostForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(createPostForm);
        const postData = {
            title: formData.get('title'),
            content: formData.get('content')
        };

        try {
            const response = await fetch(`${baseURL}/api/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(postData)
            });
            const data = await response.json();
            if (response.ok) {
                alert('Post created successfully');
                createPostForm.reset();
                fetchPosts(); // Refresh posts list after creating a new post
            } else {
                alert('Failed to create post. Please try again.');
            }
        } catch (error) {
            console.error('Create Post Error:', error);
            alert('Failed to create post. Please try again.');
        }
    });

    async function fetchPosts() {
        try {
            const response = await fetch(`${baseURL}/api/posts/get`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error(`Fetch Posts Error: ${response.status} ${response.statusText}`);
            }
            posts = await response.json(); // Store fetched posts globally
            console.log('Fetched posts:', posts);
            renderPosts(); // Render fetched posts
        } catch (error) {
            console.error('Fetch Posts Error:', error.message);
            alert('Failed to fetch posts. Please try again.');
        }
    }

    window.addEventListener('load', fetchPosts);

    function renderPosts() {
        postsList.innerHTML = ''; // Clear previous posts
        posts.forEach(post => {
            const postItem = document.createElement('div');
            postItem.classList.add('postItem');
            postItem.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.content}</p>
                <button class="btn btn-edit" data-id="${post.id}">Edit</button>
                <button class="btn btn-delete" data-id="${post.id}">Delete</button>
            `;
            postsList.appendChild(postItem);

            postItem.querySelector('.btn-edit').addEventListener('click', async (e) => {
                const postId = e.target.getAttribute('data-id');
                const postToUpdate = posts.find(p => p.id == postId); // Use == to compare string and number
                if (!postToUpdate) {
                    alert('Post not found for editing.');
                    return;
                }
                // Replace post item HTML with edit form
                postItem.innerHTML = `
                    <form class="edit-post-form">
                        <div class="form-group">
                            <label for="editTitle">Title:</label>
                            <input type="text" id="editTitle" name="title" value="${postToUpdate.title}" required>
                        </div>
                        <div class="form-group">
                            <label for="editContent">Content:</label>
                            <textarea id="editContent" name="content" rows="4" required>${postToUpdate.content}</textarea>
                        </div>
                        <button type="submit" class="btn btn-update" data-id="${postToUpdate.id}">Update</button>
                        <button type="button" class="btn btn-cancel">Cancel</button>
                    </form>
                `;
                // Add event listener for cancel button to revert back to original post view
                const btnCancel = postItem.querySelector('.btn-cancel');
                btnCancel.addEventListener('click', (e) => {
                    e.preventDefault();
                    renderPost(postToUpdate); // Re-render original post
                });

                // Add event listener for update button
                const btnUpdate = postItem.querySelector('.btn-update');
                btnUpdate.addEventListener('click', async (e) => {
                    e.preventDefault();
                    const formData = new FormData(postItem.querySelector('.edit-post-form'));
                    const updatedData = {
                        title: formData.get('title'),
                        content: formData.get('content')
                    };

                    try {
                        const response = await fetch(`${baseURL}/api/posts/${postId}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify(updatedData)
                        });
                        if (response.ok) {
                            alert('Post updated successfully');
                            fetchPosts(); // Refresh posts list after update
                        } else {
                            const data = await response.json();
                            alert(data.message || 'Failed to update post. Please try again.');
                        }
                    } catch (error) {
                        console.error('Update Post Error:', error);
                        alert('Failed to update post. Please try again.');
                    }
                });
            });

            postItem.querySelector('.btn-delete').addEventListener('click', async (e) => {
                const postId = e.target.getAttribute('data-id');
                try {
                    const response = await fetch(`${baseURL}/api/posts/${postId}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (response.ok) {
                        alert('Post deleted successfully');
                        postItem.remove();
                    } else {
                        const data = await response.json();
                        alert(data.message || 'Failed to delete post. Please try again.');
                    }
                } catch (error) {
                    console.error('Delete Post Error:', error);
                    alert('Failed to delete post. Please try again.');
                }
            });
        });
    }

    function renderPost(post) {
        const postItem = document.querySelector(`[data-id="${post.id}"]`).closest('.postItem');
        if (postItem) {
            postItem.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.content}</p>
                <button class="btn btn-edit" data-id="${post.id}">Edit</button>
                <button class="btn btn-delete" data-id="${post.id}">Delete</button>
            `;
            postItem.querySelector('.btn-edit').addEventListener('click', async (e) => {
                const postId = e.target.getAttribute('data-id');
                const postToUpdate = posts.find(p => p.id == postId); // Use == to compare string and number
                if (!postToUpdate) {
                    alert('Post not found for editing.');
                    return;
                }
                // Replace post item HTML with edit form
                postItem.innerHTML = `
                    <form class="edit-post-form">
                        <div class="form-group">
                            <label for="editTitle">Title:</label>
                            <input type="text" id="editTitle" name="title" value="${postToUpdate.title}" required>
                        </div>
                        <div class="form-group">
                            <label for="editContent">Content:</label>
                            <textarea id="editContent" name="content" rows="4" required>${postToUpdate.content}</textarea>
                        </div>
                        <button type="submit" class="btn btn-update" data-id="${postToUpdate.id}">Update</button>
                        <button type="button" class="btn btn-cancel">Cancel</button>
                    </form>
                `;
                // Add event listener for cancel button to revert back to original post view
                const btnCancel = postItem.querySelector('.btn-cancel');
                btnCancel.addEventListener('click', (e) => {
                    e.preventDefault();
                    renderPost(postToUpdate); // Re-render original post
                });

                // Add event listener for update button
                const btnUpdate = postItem.querySelector('.btn-update');
                btnUpdate.addEventListener('click', async (e) => {
                    e.preventDefault();
                    const formData = new FormData(postItem.querySelector('.edit-post-form'));
                    const updatedData = {
                        title: formData.get('title'),
                        content: formData.get('content')
                    };

                    try {
                        const response = await fetch(`${baseURL}/api/posts/${postId}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify(updatedData)
                        });
                        if (response.ok) {
                            alert('Post updated successfully');
                            fetchPosts(); // Refresh posts list after update
                        } else {
                            const data = await response.json();
                            alert(data.message || 'Failed to update post. Please try again.');
                        }
                    } catch (error) {
                        console.error('Update Post Error:', error);
                        alert('Failed to update post. Please try again.');
                    }
                });
            });

            postItem.querySelector('.btn-delete').addEventListener('click', async (e) => {
                const postId = e.target.getAttribute('data-id');
                try {
                    const response = await fetch(`${baseURL}/api/posts/${postId}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (response.ok) {
                        alert('Post deleted successfully');
                        postItem.remove();
                    } else {
                        const data = await response.json();
                        alert(data.message || 'Failed to delete post. Please try again.');
                    }
                } catch (error) {
                    console.error('Delete Post Error:', error);
                    alert('Failed to delete post. Please try again.');
                }
            });
        }
    }
});
