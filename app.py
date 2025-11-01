from flask import Flask, render_template
app = Flask(__name__, template_folder="template")

@app.route("/")
def index():
    return render_template("index.html")   # your wrapper page

@app.route("/login")
def login():
    return render_template("reach_login.html")

if __name__ == "__main__":
    app.run(debug=True)





