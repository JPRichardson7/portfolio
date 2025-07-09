# File System Management: Challenge-Based Learning Template

## Learning Goals

Build a simple file organization system through hands-on challenges. Each challenge presents a specific problem, guides you to attempt a solution, then shows a working implementation.

**Core Philosophy**: Challenge-based learning mirrors real problem-solving - encounter problems, attempt solutions with guidance, then see working implementations.

---

## Challenge 1: The Organization Problem (5 minutes)

### The Problem

Your project files are scattered everywhere. You need a system that creates clean, organized folders for each project automatically.

### Learning Target

**File system navigation** - Understanding how programs create and organize folders

### Your Challenge

Write a function that takes a project name like "My Project" and creates a folder called `projects/My-Project/` (spaces become hyphens).

### Concepts You'll Need

- **Path joining**: `os.path.join()` safely combines folder paths across operating systems
- **Folder creation**: `os.makedirs()` creates folder structures
- **String manipulation**: Methods like `.replace()` for cleaning up names

### Hints

1. Import `os` to access file system functions
2. Replace spaces with hyphens to make folder names filesystem-friendly
3. Use `os.path.join()` to combine 'projects' with your cleaned project name
4. Use `exist_ok=True` to avoid crashes if the folder already exists

### Try It First

Take 3 minutes to attempt this before looking at the solution.

### Test Your Solution

```python
test_folder = create_project_folder("My Project")
# Should create: projects/My-Project/
# Should print: "Created folder: projects/My-Project"
# Should return: "projects/My-Project"

# Test with different name
test_folder2 = create_project_folder("Blog Posts")
# Should create: projects/Blog-Posts/
```

### Solution

```python
import os

def create_project_folder(project_name):
    """Create a clean folder for our project"""
    folder_name = project_name.replace(' ', '-')  # Replace spaces with hyphens
    folder_path = os.path.join('projects', folder_name)  # Safely combine paths
    
    os.makedirs(folder_path, exist_ok=True)  # Create folder, don't crash if exists
    print(f"Created folder: {folder_path}")
    return folder_path
```

### Challenge Questions

1. What does `exist_ok=True` actually do, and what happens if you remove it?
2. Why use `os.path.join()` instead of just `"projects/" + folder_name`?
3. What would happen if project names had characters like `/` or `?`?

#### Answers

1. "xxxx"
2. "xxxx"
3. "xxxx"

---

## Challenge 2: The Version Control Problem (5 minutes)

### The Problem

You're saving multiple versions of files but can't tell them apart. You need timestamps in filenames to track when each version was created.

### Learning Target

**String manipulation and time handling** - Building filenames with timestamps while preserving file extensions

### Your Challenge

Create a function that takes a base filename like "notes.txt" and adds a timestamp to make it "notes_2025-06-13_14-30-15.txt". The timestamp should go BEFORE the file extension.

### Concepts You'll Need

- **String splitting**: `os.path.splitext()` separates filename from extension
- **Time formatting**: `datetime.now().strftime()` creates formatted timestamp strings
- **String reconstruction**: Building new strings from component parts

### Hints

1. Import `datetime` for timestamp functionality
2. Use `os.path.splitext()` to separate "notes.txt" into ("notes", ".txt")
3. Format timestamp as YYYY-MM-DD_HH-MM-SS (no colons - they break Windows!)
4. Rebuild as: name + underscore + timestamp + extension

### Try It First

Take 3 minutes to figure out how to insert a timestamp in the middle of a filename.

### Test Your Solution

```python
timestamped_name = add_timestamp("notes.txt")
# Should return: "notes_2025-06-13_14-30-15.txt" (with current timestamp)
# The .txt extension should be preserved at the end

timestamped_name2 = add_timestamp("report.pdf")
# Should return: "report_2025-06-13_14-30-15.pdf" (with current timestamp)

# Test file without extension
timestamped_name3 = add_timestamp("README")
# Should return: "README_2025-06-13_14-30-15"
```

### Solution

```python
import os
from datetime import datetime

def add_timestamp(base_filename):
    """Add a timestamp to a filename before the extension"""
    timestamp = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
    
    # Split filename and extension
    name, ext = os.path.splitext(base_filename)  # "notes.txt" -> ("notes", ".txt")
    timestamped_name = f"{name}_{timestamp}{ext}"
    
    return timestamped_name
```

### Challenge Questions

1. What exactly does `os.path.splitext("notes.txt")` return?
2. Why format the timestamp as `%Y-%m-%d_%H-%M-%S` instead of using colons?
3. How does this function handle files without extensions?

#### Answers

1. "xxxx"
2. "xxxx"
3. "xxxx"
---

## Challenge 3: The Project Manager Problem (10 minutes)

### The Problem

You have separate functions for creating folders and generating filenames, but you have to remember and coordinate them manually. You need a system that "remembers" your project and handles everything automatically.

### Learning Target

**Object-oriented programming basics** - Creating classes that remember data and provide convenient methods

### Your Challenge

Create a `ProjectManager` class that remembers your project path and provides convenient methods for creating timestamped files without having to pass the folder path every time.

### Concepts You'll Need

- **Classes**: Blueprints that group related data and functions together
- **Constructors**: `__init__` method runs when you create a new instance
- **Instance variables**: `self.something` lets the object remember data
- **Method coordination**: Having methods work together using shared data

### Hints

1. The `__init__` method should take a project name and create the folder automatically
2. Store the folder path in `self.project_path` so other methods can use it
3. Create a method that generates timestamped filenames within the project folder
4. Use your existing functions rather than rewriting the logic

### Try It First

Take 5 minutes to create a class that encapsulates project management.

### Test Your Solution

```python
# Create a project manager
pm = ProjectManager("My Blog")
# Should print: "Created folder: projects/My-Blog"

# Generate timestamped file paths
file1 = pm.create_file_path("post1.md")
# Should return: "projects/My-Blog/post1_2025-06-13_14-30-15.md"
# Should print: "File path: projects/My-Blog/post1_2025-06-13_14-30-15.md"

file2 = pm.create_file_path("draft.txt") 
# Should return: "projects/My-Blog/draft_2025-06-13_14-30-16.txt"

# Test that the object remembers the project
print(f"Project: {pm.project_name}")  # Should print: "Project: My Blog"
print(f"Path: {pm.project_path}")     # Should print: "Path: projects/My-Blog"
```

### Solution

```python
class ProjectManager:
    def __init__(self, project_name):
        """Initialize a new project manager"""
        self.project_name = project_name
        self.project_path = create_project_folder(project_name)  # Use existing function
    
    def create_file_path(self, base_filename):
        """Create a timestamped file path within this project"""
        timestamped_name = add_timestamp(base_filename)  # Use existing function
        full_path = os.path.join(self.project_path, timestamped_name)
        
        print(f"File path: {full_path}")
        return full_path
```

### Challenge Questions

1. What does `self` represent and why is it in every method?
2. How does the class "remember" the project path between method calls?
3. Why reuse existing functions instead of rewriting the logic in the class?
4. What other methods might be useful to add to this class?

#### Answers

1. "xxxx"
2. "xxxx"
3. "xxxx"
4. "xxxx"
---

## Summary

You've built a complete project file management system! You learned:

- **File system operations** - Creating folders and managing paths
- **Time handling** - Adding timestamps to track file versions
- **Object-oriented design** - Creating classes that remember data and coordinate functions
- **Code reuse** - Building on existing functions rather than duplicating logic

### Next Steps

This pattern works for any domain:

- **Problem-first approach** - Start with concrete pain points
- **Incremental building** - Each challenge builds on previous learning  
- **Test-driven validation** - See expected behavior before implementing
- **Practical focus** - Build tools you actually need

The same methodology applies whether you're learning data analysis, web development, or system administration - identify real problems, break them into manageable challenges, and build working solutions step by step.
