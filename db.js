// Import the default export from the openai module
import OpenAI from 'openai';

// Initialize the OpenAI API client with configuration
const openai = new OpenAI({
    organization: 'org-gzOFtIzqZvjxmSuRp9xbIJv6',
    apiKey: 'sk-proj-1z8fj9URpmCSp0sq7dyJT3BlbkFJfhUfu9zOQwAe1YdK9elF',
});

// Define an async function to get the chat completion
async function getCompletion() {
    try {
        const completion = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: 'Hello' }],
        });
        console.log(completion.data.choices[0].message);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Call the function
getCompletion();
