Plaintext


# Minimalist Typing Test Clone

A responsive, high-performance touch typing test inspired by Monkeytype. This application runs entirely in the browser using static HTML, CSS, and modern JavaScript, with local persistence via the browser's storage.

## Features

* **Standard 30-Second Test:** Measures typing speed (WPM) and accuracy.

* **Accurate Word Formulas:** Calculates both **Net WPM** (for typing output) and **Raw WPM** (for raw finger speed), matching industry standards.

* **Robust Backspace Support:** Seamless character correction, enabling backtracking across word boundaries while maintaining accurate live score adjustment.

* **Local Leaderboard:** Saves top scores directly to the browser's local storage (up to top 10 scores). Keeps track of Name, WPM, and Accuracy.

* **Direct Leaderboard Inspection:** Users can check high scores immediately via a dedicated button without taking a test.

## Project Structure

```
├── index.html       # Application layout and structure
├── style.css        # Minimalist dark-palette styling
├── script.js        # Core game logic, state machine, and WPM formulas
├── Dockerfile       # Light-weight Nginx environment configurations
└── docker-compose.yml # Ease-of-deployment setup orchestrator
```

## Running the Application

### 1. Simple Local Run

Since the application uses standard client-side code, you can run it without any local server:

* Simply double-click the `index.html` file to open it in any web browser.

### 2. Docker Run (Standard)

If you have Docker and Docker Compose installed:

1. Open your terminal in the project directory.

2. Build and start the container in the background:
```
docker-compose up -d --build
```

3. Open your browser and navigate to `http://localhost:8080`.

### 3. Packaging for Offline Deployment

If you need to transfer this to an offline computer:

#### On the Online computer:

1. Build the local image:
```
docker build -t local_typing_app .
```

2. Export the image to a tarball archive:
```
docker save -o typing_app_offline.tar local_typing_app
```

3. Copy the `typing_app_offline.tar` file to a USB drive.

#### On the Offline computer:

1. Plug in the USB drive and navigate to the tarball's directory.

2. Load the image into Docker:
```
docker load -i typing_app_offline.tar
```

3. Run the container:
```
docker run -d -p 8080:80 --name typing_clone_container local_typing_app
```

4. Access the web app at `http://localhost:8080`.