# **Amar Campus \- Your Campus, Connected**

**Amar Campus** is a mobile-first Progressive Web App (PWA) designed to be the central digital hub for university students in Bangladesh. Our mission is to solve the problem of information fragmentation by providing a single, trusted platform for official academic communications, peer-to-peer knowledge sharing, and essential student support services.

## **🚀 The Problem**

University students face a daily struggle with scattered information. Official class updates are lost in the noise of chaotic social media groups, while valuable career-enhancing opportunities are easily missed. This creates unnecessary stress and hinders students from pursuing crucial development activities. "Amar Campus" aims to solve this by creating a centralized, credible, and supportive digital environment.

## **✨ Key Features**

Our platform is built around three core modules designed to address the most critical aspects of student life:

### **1\. The Class Feed**

The **anchor** of our app. This is a dedicated, read-only announcement feed for each class section, managed by the verified Class Representative (CR). It acts as the single source of truth for official updates like schedule changes, assignment deadlines, and exam notices, eliminating the ambiguity of social media.

### **2\. The Student Growth Hub**

The **community engine**. A dynamic, peer-to-peer space where students can share and discover knowledge and opportunities. Content is organized into clear categories:

* **Upskilling:** Share links to free courses, tutorials, and learning resources.  
* **Internships & Opportunities:** Post about job openings, competitions, and scholarships.  
* **Extracurriculars:** Announce club events, workshops, and seminars.  
* **Campus Life & Tips:** Share practical advice for navigating university life.

### **3\. The Campus Voice Box**

The **support system**. A dedicated space for sensitive and supportive communication, featuring:

* **Anonymous Help Forum:** A safe space for students to ask for help on sensitive topics (mental health, academic struggles) without revealing their identity.  
* **Confidential Incident Reporting:** A structured form for students to report issues like harassment or infrastructure problems directly to designated faculty or administrators.

## **🛠️ Technology Stack**

We are building this application using a modern, efficient, and serverless technology stack to ensure rapid development and a superior real-time user experience.

| Category | Technology | Reason |
| :---- | :---- | :---- |
| **Frontend** | **React JS (with Vite)** | For a fast, dynamic, and component-based user interface. Vite provides an incredibly fast development experience. |
| **Styling** | **Tailwind CSS** | For rapid, mobile-first UI development with a consistent and utility-first design language. |
| **Backend & DB** | **Google Firebase** | A comprehensive BaaS (Backend-as-a-Service) platform providing: • Firestore: A real-time NoSQL database for instant data updates. • Firebase Auth: Secure and easy-to-implement user authentication. |
| **Architecture** | **Progressive Web App (PWA)** | Enables an app-like experience with home screen installation, offline access capabilities, and future-readiness for push notifications. |

## **⚙️ Project Setup**

To get a local copy up and running, follow these simple steps.

### **Prerequisites**

* Node.js (LTS version) installed on your machine.  
* An active Firebase project with Firestore and Email/Password Authentication enabled.

### **Installation**

1. **Clone the repo**  
   git clone https://github.com/mahmudhas100/Amar-Campus.git

2. **Navigate to the project directory**  
   cd Amar-Campus

3. **Install NPM packages**  
   npm install

4. **Configure Firebase**  
   * Create a firebase.js file in the /src directory.  
   * Add your Firebase project configuration keys to this file.  
5. **Start the development server**  
   npm run dev

## **🗺️ Future Roadmap**

Our vision for "Amar Campus" extends beyond the initial launch. Key features planned for future versions include:

* **Student Note-Sharing:** A dedicated module for students to upload, share, and rate class notes.  
* **Lost & Found:** A campus-wide utility to help students find their lost items.  
* **Alumni Connect:** A networking feature to connect current students with university alumni for mentorship and career advice.

## **📄 License**

Distributed under the MIT License. See LICENSE for more information.