
# 📄 File Talk AI – Frontend

This is the frontend for **File Talk AI**, a web application that allows users to upload PDF files and interact with them using AI-powered features like Q&A, summarization, and question generation.

## 🔗 Live Demo

👉 [Try File Talk AI Live](https://filetalkai.vercel.app/)

## 🚀 Features

- 📁 Upload PDF files to Cloudinary
- ❓ Ask questions based on the content of the uploaded PDF
- 📝 Get document summaries
- 🧠 Generate 20 most relevant questions from the PDF
- 🌐 Integrated with a Django backend for AI processing

---

## 🖥️ Tech Stack

- **Frontend:** Vite + React
- **Backend:** [Django (Python)](https://github.com/AkshayPanchivala/File-Talk-AI-Backend)
- **Cloud Storage:** Cloudinary

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/AkshayPanchivala/File-Talk-AI-Frontend
cd File-Talk-AI-frontend
````

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
VITE_API_BASE_URL=http://your-backend-url.com/api/v1/chat-bot/
VITE_FILE_UPLOAD_URL=https://api.cloudinary.com/v1_1/<your-cloud-name>/upload
```

Replace:

* `http://your-backend-url.com` with your Django backend URL
* `<your-cloud-name>` with your Cloudinary cloud name

---

## ☁️ Cloudinary Setup

To use Cloudinary for file uploads:

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Create an upload preset (unsigned)
3. Get your **cloud name** and **upload preset** from the dashboard
4. Update the frontend code to use those details in your file upload logic

---

## 🧪 Run the App

Start the development server:

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🧠 App Flow

1. **Upload PDF**
   User uploads a PDF file. The file is stored in Cloudinary.

2. **Choose an Action**

   * **Q\&A Mode:** Ask any question based on the content of the uploaded document.
   * **Summarization:** Generate a summary of the entire document.
   * **Generate Questions:** Automatically generate 20 relevant questions based on the document.
   * **Main Menu:** Lets the user reset the app. Once clicked, the user is automatically redirected to the first step (uploading a new file).


3. **Get Results**
   The results are fetched from the Django backend and displayed in the UI.

---

## 🔗 Backend Repository

Make sure the backend is also running. You can find it here:
👉 [File Talk AI – Backend (Django)]([https://github.com/AkshayPanchivala/File-Talk-AI-be](https://github.com/AkshayPanchivala/File-Talk-AI-Backend))

---

## 📃 License

This project is licensed under the MIT License.

---

## 🙌 Acknowledgements

* [OpenAI](https://groq.com/)
* [Cloudinary](https://cloudinary.com/)
* [Vite](https://vitejs.dev/)
* [Django](https://www.djangoproject.com/)
