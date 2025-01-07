import google.generativeai as genai
import json
import time
from datetime import datetime, timedelta

# Configure the Gemini model
def setup_model(api_key):
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-pro')
    return model

def get_conversation_length(article_text: str, length_preference: str) -> tuple[int, int]:
    """
    Determine the number of dialogue turns based on article length and preference.
    Returns (min_turns, max_turns)
    """
    word_count = len(article_text.split())
    
    if length_preference == "Adaptive":
        if word_count < 300:
            return (8, 12)
        elif word_count < 600:
            return (12, 18)
        elif word_count < 1000:
            return (18, 25)
        else:
            return (25, 35)
    elif length_preference == "Short":
        return (8, 12)
    elif length_preference == "Medium":
        return (15, 22)
    else:  # Long
        return (25, 35)

async def generate_podcast_script(article_text: str, host_name: str, guest_name: str, length: str, model, content_type: str = "article"):
    prompt = f"""
    Create a natural, engaging podcast conversation between {host_name} (Host) and {guest_name} (Guest) discussing this {content_type}. 
    The conversation should be formatted as a list of JSON objects.

    Content:
    {article_text}

    Length: {length}

    Requirements for the conversation:
    1. Make it dynamic and natural
    2. Include reactions and agreements, such as "Oh", "Yeah", "Wow", "I totally agree", "Agreed", "I would disagree","I'd like to add...", "As it was quoted...", "That's fascinating", "Can you ellaborate...", "Uh-uh", "I can relate", "True", "Absolutely!", "I have a different perspective", "I know right?", "Tell me about it!", "Isn't that amazing?", "Interesting!", etc.
    3. Host will sometimes ask questions to Guest and Guest will answer
    4. Keep each dialogue segment between 5-30 words
    5. IMPORTANT:Host and Guest will call each other by their first names
    6. Cover all the main points of the content
    7. Include personal opinions
    8. Start with the Host greeting the listeners, then introducing himself and Guest by their names, Host will mention that this is a {content_type} they're discussing and introducing the topic setting up the context
    9. Host and Guest will have a conversation with intelligent analysis, insightful discussions and natural engagement
    10. Host and Guest will quote from the content and talk about it
    11. Before closing up, Host will summarize the content and thank Guest
    12. Host will close up by thanking the listeners. Host and Guest will end smoothly

    Format each dialogue somewhat (not exactly) like this example:
    [
        {{
            "Host": {{
                "dialogue": "Welcome to the podcast! I'm {host_name} and today we're discussing..."
            }}
        }},
        {{
            "Guest": {{
                "dialogue": "Thanks for having me! This {content_type} really caught my attention..."
            }}
        }},
        {{
            "Host": {{
                "dialogue": "What stood out to you the most?"
            }}
        }},
        {{
            "Guest": {{
                "dialogue": "Well, I found it fascinating that..."
            }}
        }},
        ...
    ]
    But feel free to be creative in using language as long as it's realistic.
    """

    try:
        response = await model.generate_content_async(prompt)
        if response.text:
            try:
                # Parse the response as JSON
                script = json.loads(response.text)
                return script
            except json.JSONDecodeError as e:
                print(f"Error parsing JSON: {e}")
                print("Raw response:", response.text)
                return None
        else:
            print("Empty response from model")
            return None
    except Exception as e:
        print(f"Error generating script: {e}")
        print("Raw response:", response.text)
        return None

