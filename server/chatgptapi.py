# Import necessary libraries and functions.
import openai
from mongodbsetup import insert_user_message, insert_ai_message, get_messages_openai

# Define the API key for OpenAI; used for authenticating and making requests.
api_key = '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'

# Initialize the OpenAI library.
import openai

def validate_connection(api_key):
    """
    Tests the connection to the OpenAI API.
    Returns True if the connection is successful, otherwise returns False.
    """

    # Set the OpenAI API key.
    openai.api_key = api_key

    try:
        # Make a sample request to the OpenAI API to test the connection.
        response = openai.Completion.create(
            model="text-davinci-002",
            prompt="test",
            max_tokens=5
        )

        # Check if the response contains expected data.
        if response and response.get("choices"):
            return True
        else:
            return False

    except Exception as e:
        # If there's an error during the request, print it.
        print(f"Error: {e}")
        return False

# Test the function to validate the connection.
if validate_connection(api_key):
    print("Connection successful!")
else:
    print("Connection failed!")

def CustomChatGPT(user_id, user_input):
    """
    Engages in a conversation with the ChatGPT model.
    The function first logs the user's message and then gets a reply from ChatGPT.
    """

    # Store the user's message in the database.
    insert_user_message(user_id, user_input)

    # Fetch previous messages between the user and ChatGPT from the database.
    past_messages = get_messages_openai(user_id)

    # Add the current user message to the message history.
    past_messages.append({"role": "user", "content": user_input})

    # Interact with the ChatGPT model using the message history to get a contextual reply.
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=past_messages
    )
    ChatGPT_reply = response["choices"][0]["message"]["content"]

    # Store the ChatGPT's reply in the database.
    insert_ai_message(user_id, ChatGPT_reply)

    # Return the reply to be used elsewhere.
    return ChatGPT_reply

# If this script is executed directly, validate the OpenAI connection.
if __name__ == "__main__":
    validate_connection(api_key)
