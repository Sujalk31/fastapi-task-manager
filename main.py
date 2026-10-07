from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi import Request
from pydantic import BaseModel


app = FastAPI(title="Task Manager API")


# Serve CSS and JavaScript files
app.mount("/static", StaticFiles(directory="static"), name="static")

# HTML templates
templates = Jinja2Templates(directory="templates")


# -----------------------------
# Data model
# -----------------------------

class TaskCreate(BaseModel):
    title: str


class TaskUpdate(BaseModel):
    title: str
    completed: bool


class Task(BaseModel):
    id: int
    title: str
    completed: bool = False


# Temporary in-memory database
tasks = [
    {
        "id": 1,
        "title": "Learn FastAPI",
        "completed": False
    },
    {
        "id": 2,
        "title": "Build Task Manager",
        "completed": True
    }
]


# -----------------------------
# UI
# -----------------------------


@app.get("/", response_class=HTMLResponse)
def home(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="index.html",
        context={}
    )


# -----------------------------
# API ENDPOINTS
# -----------------------------

# GET - Get all tasks
@app.get("/tasks")
def get_tasks():
    return tasks


# GET - Get one task
@app.get("/tasks/{task_id}")
def get_task(task_id: int):

    for task in tasks:
        if task["id"] == task_id:
            return task

    raise HTTPException(
        status_code=404,
        detail="Task not found"
    )


# POST - Create a task
@app.post("/tasks")
def create_task(task: TaskCreate):

    new_id = max([t["id"] for t in tasks], default=0) + 1

    new_task = {
        "id": new_id,
        "title": task.title,
        "completed": False
    }

    tasks.append(new_task)

    return new_task


# PUT - Update a task
@app.put("/tasks/{task_id}")
def update_task(task_id: int, task_data: TaskUpdate):

    for task in tasks:

        if task["id"] == task_id:

            task["title"] = task_data.title
            task["completed"] = task_data.completed

            return task

    raise HTTPException(
        status_code=404,
        detail="Task not found"
    )

# DELETE - Delete a task
@app.delete("/tasks/{task_id}")
def delete_task(task_id: int):

    for task in tasks:

        if task["id"] == task_id:

            tasks.remove(task)

            return {
                "message": "Task deleted successfully"
            }

    raise HTTPException(
        status_code=404,
        detail="Task not found"
    )