from flask import Flask, request, jsonify, render_template
import openai

app = Flask(__name__)

# Cấu hình OpenAI API Key
openai.api_key = "YOUR_OPENAI_API_KEY"

@app.route('/')
def index():
    return render_template('chat.tsx')

@app.route('/api', methods=['POST'])
def chat():
    try:
        data = request.json
        user_message = data.get("message", "")

        if not user_message:
            return jsonify({"error": "Message is required"}), 400

     
client = OpenAI()

completion = client.chat.completions.create(
  model="gpt-4o",
  messages=[
    {"role": "developer", "content": "You are a helpful assistant."},
    {"role": "user", "content": "Hello!"}
  ]
)

print(completion.choices[0].message)

      

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
