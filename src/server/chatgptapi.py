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

## Base Code I have run before 
# def CustomChatGPT(user_input):
#     messages.append({"role": "user", "content": user_input})
#     response = openai.ChatCompletion.create(
#         model = "gpt-3.5-turbo",
#         messages = messages
#     )
#     ChatGPT_reply = response["choices"][0]["message"]["content"]
#     messages.append({"role": "assistant", "content": ChatGPT_reply})
#     return ChatGPT_reply


def CustomChatGPT(user_id, companion_id, user_input):
    # Add user's message to the database
    insert_user_message(user_id, companion_id, user_input)

    # Get a reply from ChatGPT
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "system", "content": "You are an AI Powered Love Assistant"}, {"role": "user", "content": user_input}]
    )
    ChatGPT_reply = response["choices"][0]["message"]["content"]

    # Add assistant's reply to the database
    insert_ai_message(user_id, companion_id, ChatGPT_reply)

    return ChatGPT_reply



if __name__ == "__main__":
    validate_connection(api_key)