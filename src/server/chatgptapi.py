import openai

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


messages = [{"role": "system", "content": "You are an AI Powered Love Assistant"}]


## Base Code I have run before 
def CustomChatGPT(user_input):
    messages.append({"role": "user", "content": user_input})
    response = openai.ChatCompletion.create(
        model = "gpt-3.5-turbo",
        messages = messages
    )
    ChatGPT_reply = response["choices"][0]["message"]["content"]
    messages.append({"role": "assistant", "content": ChatGPT_reply})
    return ChatGPT_reply


if __name__ == "__main__":
    validate_connection(api_key)