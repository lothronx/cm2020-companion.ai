import openai
from mongodbsetup import insert_user_message, insert_ai_message, get_messages



api_key = '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'  


import openai

def validate_connection(api_key):

    openai.api_key = api_key
    
    try:
        response = openai.Completion.create(
            model="text-davinci-002",
            prompt="test",
            max_tokens=5
        )
        
        if response and response.get("choices"):
            return True
        else:
            return False
            
    except Exception as e:
        print(f"Error: {e}")
        return False
    
# Test the function
if validate_connection(api_key):
    print("Connection successful!")
else:
    print("Connection failed!")

## With Multiple Companions 

def CustomChatGPT(user_id,  user_input):
    # Add user's message to the database
    insert_user_message(user_id, user_input)

    # Retrieve past message contents from the database
    past_messages = get_messages(user_id)

    # Add the current user's message to the list
    past_messages.append({"role": "user", "content": user_input})

    # Get a reply from ChatGPT
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=past_messages
    )
    ChatGPT_reply = response["choices"][0]["message"]["content"]

    # Add assistant's reply to the database
    insert_ai_message(user_id, ChatGPT_reply)

    return ChatGPT_reply


if __name__ == "__main__":
    validate_connection(api_key)