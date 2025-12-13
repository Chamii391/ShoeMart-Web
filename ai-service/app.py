from flask import Flask, request, jsonify
from ai_model import generate_altnames, generate_description

app = Flask(__name__)

@app.route("/generate_altnames", methods=["POST"])
def altnames():
    data = request.json
    return jsonify({
        "altNames": generate_altnames(
            data["name"],
            data["main_category"],
            data.get("color", ""),
            data.get("country", "")
        )
    })


@app.route("/generate_description", methods=["POST"])
def description():
    data = request.json
    return jsonify({
        "description": generate_description(
            data["name"],
            data["main_category"],
            data["price"],
            data.get("color", ""),
            data.get("country", "")
        )
    })


app.run(port=5002, debug=True)
