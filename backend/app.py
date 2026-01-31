from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

DB_NAME = "tasks.db"

def get_db():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            status TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()

init_db()

# ---------- GET TASKS ----------
@app.route("/tasks", methods=["GET"])
@app.route("/tasks/", methods=["GET"])
def get_tasks():
    conn = get_db()
    tasks = conn.execute("SELECT * FROM tasks").fetchall()
    conn.close()
    return jsonify([dict(task) for task in tasks])

# ---------- ADD TASK ----------
@app.route("/tasks", methods=["POST"])
@app.route("/tasks/", methods=["POST"])
def add_task():
    data = request.json
    conn = get_db()
    conn.execute(
        "INSERT INTO tasks (title, description, status) VALUES (?, ?, ?)",
        (data["title"], data["description"], data["status"])
    )
    conn.commit()
    conn.close()
    return jsonify({"message": "Task added"}), 201

# ---------- UPDATE TASK ----------
@app.route("/tasks/<int:task_id>", methods=["PUT"])
@app.route("/tasks/<int:task_id>/", methods=["PUT"])
def update_task(task_id):
    data = request.json
    conn = get_db()
    conn.execute(
        "UPDATE tasks SET title=?, description=?, status=? WHERE id=?",
        (data["title"], data["description"], data["status"], task_id)
    )
    conn.commit()
    conn.close()
    return jsonify({"message": "Task updated"})

# ---------- DELETE TASK ----------
@app.route("/tasks/<int:task_id>", methods=["DELETE"])
@app.route("/tasks/<int:task_id>/", methods=["DELETE"])
def delete_task(task_id):
    conn = get_db()
    conn.execute("DELETE FROM tasks WHERE id=?", (task_id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Task deleted"})

if __name__ == "__main__":
    app.run(debug=True)
