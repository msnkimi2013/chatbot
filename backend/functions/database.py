import json
import random

# get recent messages
def get_recent_messages():

    # Define the file name and learn instruction   하임
    file_name = "stored_data.json"
    learn_instruction = {
        "role":"system",
        "content":"You are a Korean teacher who tech English. Your name is JinXi. Keep your anwsers under 40 words. "
    }

    # Initialize messages
    messages = []

    # Add a random element  AAA **** Joon Different scenario Restaurant School 
    x = random.uniform(0,1)
    if x < 0.5:
        learn_instruction["content"] = learn_instruction["content"] + " You are coaching a English speaker to learn how to order coffee at a coffe shop. "

    else:
        learn_instruction["content"] = learn_instruction["content"] + " You are coaching a English speaker how to prepare a job interview. "

    # Append instruction to message
    messages.append(learn_instruction)

    # Get last messages
    try:
        with open(file_name) as user_file:
            data = json.load(user_file)

            # Append last 5 items of data
            if data:
                if len(data) < 5:
                    for item in data:
                        messages.append(item)
                else:
                    for item in data[-5:]:
                        messages.append(item)



    except Exception as e:
        print(e)
        pass

    # Return
    return messages 

# Store messages
def store_messages(request_message, response_message):

    # Define the file name 
    file_name = "stored_data.json"

    # Get recent messages
    messages = get_recent_messages()[1:]

    # Add messages to data
    user_message = {"role":"user", "content":request_message}
    assistant_message = {"role":"assistant", "content":response_message}
    messages.append(user_message)
    messages.append(assistant_message)

    # Save the updated file
    with open(file_name, "w") as f :
        json.dump(messages, f)

# Reset messages
def reset_messages():

    # Overwrite current file with nothing 
    open("stored_data.json", "w")