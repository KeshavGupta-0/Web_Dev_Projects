#Update login page and signup page frontend
from flask import Flask,render_template,request,redirect,url_for,session
import mysql.connector

app=Flask(__name__)#Initialization

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="@Keshav25",
    database="audicore"
)
cursor = db.cursor()


@app.route("/")
def home():
    return render_template("index.html")

app.secret_key="supersecretkey"
@app.route("/login",methods=["GET","POST"])
def login():
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]
        remember = request.form.get("remember")  # will be "on" if checked, None if not

        sql = "SELECT * FROM users WHERE username=%s AND password=%s"
        values = (username, password)
        cursor.execute(sql, values)
        user = cursor.fetchone()

        if user:
            session["username"]=username
            if remember == "on":
                session.permanent = True  # keeps session active even after browser closes
            return redirect(url_for("dashboard"))
        else:
            return "Invalid Credentials"
    return render_template("login.html")


@app.route("/guest")
def guest():
    return render_template("guest.html")


@app.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "POST":
        username = request.form["username"]
        email = request.form["email"]
        phone = request.form["phone"]
        password = request.form["password"]
        confirm_password = request.form["confirm_password"]
        terms = request.form.get("terms")  # "on" if checked, None if not

        # Check if passwords match
        if password != confirm_password:
            return "❌ Passwords do not match. Please try again."

        # Check if terms are accepted
        if terms is None:
            return "❌ You must agree to the Terms & Conditions."

        # Convert checkbox into boolean (1 or 0)
        terms_accepted = 1 if terms == "on" else 0

        # Insert into database
        sql = """
            INSERT INTO users (username, email, phone, password, terms_accepted)
            VALUES (%s, %s, %s, %s, %s)
        """
        values = (username, email, phone, password, terms_accepted)

        try:
            cursor.execute(sql, values)
            db.commit()
        except Exception as e:
            return f"❌ Error: {e}"

        return redirect(url_for("login"))

    return render_template("signup.html")


@app.route("/dashboard")
def dashboard():
    if "username" in session:
        return render_template("dashboard.html",username=session["username"])
    else:
        return redirect(url_for("login"))
    
@app.route("/logout")
def logout():
    session.pop("username", None)
    return redirect(url_for("login"))

if __name__=="__main__":
    app.run(debug=True)