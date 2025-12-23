# Next.js Frontend Template

Frontend template built with **Next.js**, designed to be used as a base for modern and scalable web applications.

This project is designed with clean structure and best practices in mind, allowing easy integration with backend APIs and fast iteration during development.

## Landing 
<img width="1358" height="647" alt="image" src="https://github.com/user-attachments/assets/a0014641-72a0-4d10-80ce-094598395979" />

## Landing - logged in user 
<img width="1366" height="649" alt="image" src="https://github.com/user-attachments/assets/7928eaab-8b84-4513-862b-a2cbedd8c884" />

## Home - Access will be granted if the user is logged in.
<img width="1366" height="646" alt="image" src="https://github.com/user-attachments/assets/609d9ada-09fc-4bd2-ad03-c361db82ebc2" />

## Sign in
<img width="1366" height="647" alt="image" src="https://github.com/user-attachments/assets/09ab0124-bc2e-487c-9600-429b998a2eae" />

## Sign up
<img width="1366" height="651" alt="image" src="https://github.com/user-attachments/assets/0392d677-078b-4479-b594-733278fbd534" />

## Verify account
<img width="1366" height="648" alt="image" src="https://github.com/user-attachments/assets/b63682b7-4c4d-4774-be2c-cb3290dac307" />


## Backend

The backend template designed to work with this frontend is available here:
- https://github.com/amorindev/go-tmpl

## Architecture

- Framework: Next.js (App Router)
- Language: TypeScript
- Styling: CSS / Tailwind
- Authentication: Cookie-based
- API Communication: REST (Axios)
- State Management: Optional (Redux)
- Environment-based configuration

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/amorindev/nextjs-tmpl
    cd nextjs-tmpl
    ```

2. Install dependencies:
    ```bash
    pnpm install
    ```

3. Set environment variables, add a `.env` file if needed:
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:8000
    ```

4. Run the development server:
    ```bash
    pnpm dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
