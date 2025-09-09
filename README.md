# Babali Travel Platform

Babali is a comprehensive travel ticketing system supporting bus, train, and flight bookings. It features a modular Django backend, a modern Next.js frontend, and a dedicated microservice for ticket printing.

## Features

- **Multi-modal booking:** Bus, train, and flight ticket management
- **User authentication:** Secure registration and login
- **PDF ticket generation:** Automated ticket creation and scheduled cleanup
- **Printer microservice:** Seamless ticket printing integration
- **Scalable architecture:** Modular apps for easy maintenance and extension

## Project Structure

```
babali/
├── backend/        # Django backend (bus, train, flight apps)
├── frontend/       # Next.js frontend
├── printer_ms/     # Printer microservice
├── diagrams/       # Architecture and design documentation
├── env/            # Python virtual environment
├── setup.sh        # Setup and cron job script
├── requirements.txt
└── README.md
```

## Getting Started

### Backend

1. **Create and activate a virtual environment:**
    ```sh
    python -m venv env
    env\Scripts\activate  # On Windows
    # or
    source env/bin/activate  # On Linux/Mac
    ```
2. **Install dependencies:**
    ```sh
    pip install -r requirements.txt
    ```
3. **Apply migrations and start the server:**
    ```sh
    cd backend
    python manage.py migrate
    python manage.py runserver
    ```

### Frontend

1. **Install dependencies:**
    ```sh
    cd frontend
    npm install
    ```
2. **Start the development server:**
    ```sh
    npm run dev
    ```
    Visit [http://localhost:3000](http://localhost:3000) in your browser.

### Printer Microservice

See the [`printer_ms/`](printer_ms/) directory for setup and usage instructions.

### Automated PDF Cleanup

Run the setup script to enable scheduled cleanup of old ticket PDFs:
```sh
bash setup.sh
```

## Documentation

- Architecture diagrams, CRC cards, and use case documentation are available in the [`diagrams/`](diagrams/) folder.
