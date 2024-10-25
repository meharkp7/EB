document.getElementById('send-btn').addEventListener('click', sendMessage);

function sendMessage() {
    const userInput = document.getElementById('user-input').value.trim();
    if (userInput === '') return;

    // Display user's message
    displayMessage(userInput, 'user-message');

    // Determine the type of request and send it to the server
    if (userInput.toLowerCase().includes('suggest') || userInput.toLowerCase().includes('projects')) {
        fetch('/project-suggestions')
            .then(response => response.json())
            .then(data => {
                const suggestions = data.suggestions.join(', ');
                displayMessage(`Here are some recommended projects: ${suggestions}`, 'bot-message');
            })
            .catch(() => displayMessage('Sorry, something went wrong.', 'bot-message'));
    } else if (userInput.toLowerCase().includes('sentiment')) {
        const projectName = extractProjectName(userInput);
        if (projectName) {
            fetch('/analyze-sentiment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ project_name: projectName }),
            })
                .then(response => response.json())
                .then(data => {
                    const sentiment = data.sentiment;
                    displayMessage(`The sentiment for ${projectName} is ${sentiment}.`, 'bot-message');
                })
                .catch(() => displayMessage('Sorry, something went wrong.', 'bot-message'));
        } else {
            displayMessage('Please specify the project name for sentiment analysis.', 'bot-message');
        }
    } else {
        displayMessage("I'm not sure how to help with that.", 'bot-message');
    }

    // Clear user input
    document.getElementById('user-input').value = '';
}

function displayMessage(message, className) {
    const chatBox = document.getElementById('chat-box');
    const messageDiv = document.createElement('div');
    messageDiv.className = className;
    messageDiv.textContent = message;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function extractProjectName(input) {
    // Extract the project name from the user input. This is a basic example.
    const words = input.split(' ');
    return words.length > 1 ? words[words.length - 1] : null;
}